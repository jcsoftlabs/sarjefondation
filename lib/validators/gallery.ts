import { z } from "zod";

export const galleryPhotoSchema = z.object({
  albumId: z.string().min(1),
  photoId: z.string().min(1, "Choisissez une image."),
  caption: z.string().max(200).nullable().optional(),
});

export type GalleryPhotoInput = z.infer<typeof galleryPhotoSchema>;
