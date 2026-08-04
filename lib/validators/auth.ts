import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Adresse email invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Adresse email invalide."),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "8 caractères minimum."),
    confirmPassword: z.string().min(1, "Confirmation requise."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });
