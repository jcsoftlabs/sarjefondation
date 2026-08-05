import { z } from "zod";
import { slugSchema } from "@/lib/validators/articles";

export const albumSchema = z.object({
  title: z.string().min(1, "Le titre est requis.").max(160),
  titleEn: z.string().max(160).nullable().optional(),
  slug: slugSchema,
  description: z.string().max(500).nullable().optional(),
  descriptionEn: z.string().max(500).nullable().optional(),
  coverId: z.string().nullable().optional(),
});

export type AlbumInput = z.infer<typeof albumSchema>;
