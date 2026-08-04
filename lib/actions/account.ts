"use server";

import bcrypt from "bcrypt";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { changePasswordSchema } from "@/lib/validators/settings";

export type ChangePasswordActionState = { ok: true } | { ok: false; error: string };

export async function changePassword(
  _prevState: ChangePasswordActionState | null,
  formData: FormData,
): Promise<ChangePasswordActionState> {
  const admin = await requireAdmin();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Le formulaire contient des erreurs.",
    };
  }

  const user = await prisma.user.findUnique({ where: { id: admin.id } });
  if (!user) {
    return { ok: false, error: "Utilisateur introuvable." };
  }

  const currentMatches = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!currentMatches) {
    return { ok: false, error: "Le mot de passe actuel est incorrect." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  await logAudit({ userId: user.id, action: "UPDATE", entity: "User", entityId: user.id });

  return { ok: true };
}
