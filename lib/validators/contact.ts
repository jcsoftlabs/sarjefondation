import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Le nom est requis.").max(120),
  email: z.email("Adresse email invalide."),
  subject: z.enum(["benevolat", "partenariat", "don", "autre"]),
  message: z.string().min(1, "Le message est requis.").max(2000),
  // Honeypot : champ invisible pour un visiteur humain, souvent rempli par
  // les robots de spam. S'il contient quoi que ce soit, la soumission est
  // silencieusement ignorée.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
