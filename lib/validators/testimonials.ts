import { z } from "zod";

export const testimonialSchema = z.object({
  author: z.string().min(1, "Le nom est requis.").max(120),
  role: z.string().max(120).nullable().optional(),
  quote: z.string().min(1, "Le témoignage est requis.").max(1000),
  photoId: z.string().nullable().optional(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
