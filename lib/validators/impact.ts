import { z } from "zod";

export const impactStatSchema = z.object({
  label: z.string().min(1, "Le libellé est requis.").max(160),
  labelEn: z.string().max(160).nullable().optional(),
  value: z.string().min(1, "La valeur est requise.").max(40),
});

export type ImpactStatInput = z.infer<typeof impactStatSchema>;
