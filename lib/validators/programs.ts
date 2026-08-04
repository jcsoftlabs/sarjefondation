import { z } from "zod";
import { slugSchema } from "@/lib/validators/articles";

export const programSchema = z.object({
  title: z.string().min(1, "Le titre est requis.").max(200),
  slug: slugSchema,
  summary: z.string().min(1, "Le résumé est requis.").max(300),
  content: z.record(z.string(), z.unknown()),
  coverId: z.string().nullable().optional(),
  isActive: z.boolean(),
});

export type ProgramInput = z.infer<typeof programSchema>;
