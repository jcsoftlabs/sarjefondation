import { z } from "zod";

export const settingsSchema = z.object({
  contactEmail: z.union([z.email("Adresse email invalide."), z.literal("")]),
  contactPhone: z.string().max(40).optional(),
  contactAddress: z.string().max(300).optional(),
  socialFacebook: z.string().max(300).optional(),
  socialInstagram: z.string().max(300).optional(),
  socialTwitter: z.string().max(300).optional(),
  socialLinkedin: z.string().max(300).optional(),
  homeIntroText: z.string().max(500).optional(),
  contactFormReceiverEmail: z.union([z.email("Adresse email invalide."), z.literal("")]),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export const defaultSettings: SettingsInput = {
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  socialFacebook: "",
  socialInstagram: "",
  socialTwitter: "",
  socialLinkedin: "",
  homeIntroText: "",
  contactFormReceiverEmail: "",
};

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis."),
    newPassword: z.string().min(8, "8 caractères minimum."),
    confirmPassword: z.string().min(1, "Confirmation requise."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });
