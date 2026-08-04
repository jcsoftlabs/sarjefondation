"use server";

import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import bcrypt from "bcrypt";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isRateLimited, recordAttempt } from "@/lib/rate-limit";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "@/lib/validators/auth";
import { resend } from "@/lib/resend";

type ActionResult = { ok: true } | { ok: false; error: string };

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Email ou mot de passe incorrect." };
  }

  const ip = await getClientIp();
  if (await isRateLimited(ip)) {
    return {
      ok: false,
      error: "Trop de tentatives. Réessayez dans 15 minutes.",
    };
  }
  await recordAttempt(ip);

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Email ou mot de passe incorrect." };
    }
    throw error;
  }
}

export async function forgotPasswordAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Adresse email invalide." };
  }

  const ip = await getClientIp();
  if (await isRateLimited(ip)) {
    return {
      ok: false,
      error: "Trop de tentatives. Réessayez dans 15 minutes.",
    };
  }
  await recordAttempt(ip);

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  // Toujours la même réponse, que le compte existe ou non, pour ne pas
  // révéler quelles adresses sont enregistrées.
  if (user) {
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reinitialiser/${rawToken}`;

    if (resend) {
      await resend.emails.send({
        from: "Fondation Sarje <onboarding@resend.dev>",
        to: user.email,
        subject: "Réinitialisation de votre mot de passe",
        text: `Bonjour ${user.name},\n\nPour réinitialiser votre mot de passe, suivez ce lien (valable 1 heure) :\n${resetUrl}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.`,
      });
    }
  }

  return { ok: true };
}

export async function resetPasswordAction(
  token: string,
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Formulaire invalide.",
    };
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (
    !resetToken ||
    resetToken.usedAt ||
    resetToken.expiresAt < new Date()
  ) {
    return {
      ok: false,
      error: "Ce lien de réinitialisation n'est plus valide.",
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
