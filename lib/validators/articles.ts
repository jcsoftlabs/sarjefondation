import { z } from "zod";
import { slugify } from "@/lib/slugify";

export { slugify };

export const slugSchema = z
  .string()
  .min(1, "Le slug est requis.")
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    "Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets.",
  );

export const articleSchema = z.object({
  title: z.string().min(1, "Le titre est requis.").max(200),
  slug: slugSchema,
  excerpt: z.string().min(1, "Le résumé est requis.").max(300),
  content: z.record(z.string(), z.unknown()),
  coverId: z.string().nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type ArticleInput = z.infer<typeof articleSchema>;
