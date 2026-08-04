"use server";

import { headers } from "next/headers";
import { contactSchema } from "@/lib/validators/contact";
import { isRateLimited, recordAttempt } from "@/lib/rate-limit";
import { getSettings } from "@/lib/actions/settings";
import { resend } from "@/lib/resend";

export type ContactActionState = { ok: true } | { ok: false; error: string };

const subjectLabels: Record<string, string> = {
  benevolat: "Bénévolat",
  partenariat: "Partenariat",
  don: "Don",
  autre: "Autre",
};

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

export async function submitContactForm(
  _prevState: ContactActionState | null,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: "Le formulaire contient des erreurs." };
  }

  // Honeypot rempli : on fait comme si tout allait bien, sans envoyer
  // l'email, pour ne pas révéler au robot qu'il a été détecté.
  if (parsed.data.website) {
    return { ok: true };
  }

  const ip = await getClientIp();
  const identifier = `contact:${ip}`;
  if (await isRateLimited(identifier)) {
    return {
      ok: false,
      error: "Trop de messages envoyés. Réessayez dans 15 minutes.",
    };
  }
  await recordAttempt(identifier);

  const settings = await getSettings();
  const receiver = settings.contactFormReceiverEmail;

  if (!receiver) {
    console.error(
      "submitContactForm: aucun email de réception configuré dans les paramètres.",
    );
    return {
      ok: false,
      error: "Une erreur est survenue. Merci de réessayer plus tard.",
    };
  }

  if (resend) {
    const { error } = await resend.emails.send({
      from: "Fondation Sarje <onboarding@resend.dev>",
      to: receiver,
      replyTo: parsed.data.email,
      subject: `[Contact] ${subjectLabels[parsed.data.subject]} — ${parsed.data.name}`,
      text: `De : ${parsed.data.name} (${parsed.data.email})\nSujet : ${subjectLabels[parsed.data.subject]}\n\n${parsed.data.message}`,
    });
    if (error) {
      console.error("submitContactForm: échec de l'envoi Resend", error);
      return {
        ok: false,
        error: "Une erreur est survenue. Merci de réessayer plus tard.",
      };
    }
  }

  return { ok: true };
}
