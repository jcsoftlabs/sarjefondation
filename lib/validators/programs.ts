import { z } from "zod";
import { slugSchema } from "@/lib/validators/articles";

export const programSchema = z.object({
  title: z.string().min(1, "Le titre est requis.").max(200),
  titleEn: z.string().max(200).nullable().optional(),
  slug: slugSchema,
  summary: z.string().min(1, "Le résumé est requis.").max(300),
  summaryEn: z.string().max(300).nullable().optional(),
  content: z.record(z.string(), z.unknown()),
  contentEn: z.record(z.string(), z.unknown()).nullable().optional(),
  coverId: z.string().nullable().optional(),
  isActive: z.boolean(),
});

export type ProgramInput = z.infer<typeof programSchema>;
