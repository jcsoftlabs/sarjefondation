import { z } from "zod";

// Bornes de sécurité : un centime minimum n'a pas de sens, et un plafond
// évite qu'une erreur de saisie (ou un abus) ne crée une intention de
// paiement à un montant absurde.
export const donationSchema = z.object({
  amountCents: z
    .number()
    .int()
    .min(200, "Le don minimum est de 2 $.")
    .max(5_000_000, "Le don maximum est de 50 000 $."),
  donorName: z.string().max(120).optional(),
  donorEmail: z.union([z.email("Adresse email invalide."), z.literal("")]).optional(),
});

export type DonationInput = z.infer<typeof donationSchema>;

export const presetAmountsUsd = [10, 25, 50, 100];
