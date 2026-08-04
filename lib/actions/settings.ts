"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { Prisma } from "@/app/generated/prisma/client";
import { defaultSettings, settingsSchema, type SettingsInput } from "@/lib/validators/settings";

const SETTINGS_KEY = "general";

export async function getSettings(): Promise<SettingsInput> {
  const row = await prisma.setting.findUnique({ where: { key: SETTINGS_KEY } });
  if (!row) return defaultSettings;
  return { ...defaultSettings, ...(row.value as Partial<SettingsInput>) };
}

export type SettingsActionState = { ok: true } | { ok: false; error: string };

export async function updateSettings(
  _prevState: SettingsActionState | null,
  formData: FormData,
): Promise<SettingsActionState> {
  const admin = await requireAdmin();

  const parsed = settingsSchema.safeParse({
    contactEmail: formData.get("contactEmail") ?? "",
    contactPhone: formData.get("contactPhone") ?? "",
    contactAddress: formData.get("contactAddress") ?? "",
    socialFacebook: formData.get("socialFacebook") ?? "",
    socialInstagram: formData.get("socialInstagram") ?? "",
    socialTwitter: formData.get("socialTwitter") ?? "",
    socialLinkedin: formData.get("socialLinkedin") ?? "",
    homeIntroText: formData.get("homeIntroText") ?? "",
    contactFormReceiverEmail: formData.get("contactFormReceiverEmail") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Le formulaire contient des erreurs.",
    };
  }

  await prisma.setting.upsert({
    where: { key: SETTINGS_KEY },
    create: { key: SETTINGS_KEY, value: parsed.data as Prisma.InputJsonValue },
    update: { value: parsed.data as Prisma.InputJsonValue },
  });

  await logAudit({ userId: admin.id, action: "UPDATE", entity: "Setting", entityId: SETTINGS_KEY });

  return { ok: true };
}
