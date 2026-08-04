import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Le nom est requis.").max(120),
  role: z.string().min(1, "Le rôle est requis.").max(120),
  bio: z.string().max(1000).nullable().optional(),
  photoId: z.string().nullable().optional(),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
