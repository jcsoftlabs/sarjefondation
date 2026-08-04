"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function searchMedia(query?: string) {
  await requireAdmin();
  return prisma.media.findMany({
    where: query ? { alt: { contains: query, mode: "insensitive" } } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getMediaUsage(id: string) {
  await requireAdmin();
  const [articles, programs, teamMembers, testimonials] = await Promise.all([
    prisma.article.findMany({ where: { coverId: id }, select: { id: true, title: true } }),
    prisma.program.findMany({ where: { coverId: id }, select: { id: true, title: true } }),
    prisma.teamMember.findMany({ where: { photoId: id }, select: { id: true, name: true } }),
    prisma.testimonial.findMany({ where: { photoId: id }, select: { id: true, author: true } }),
  ]);
  return { articles, programs, teamMembers, testimonials };
}

export async function deleteMedia(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = await requireAdmin();
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return { ok: false, error: "Média introuvable." };
  }

  await prisma.media.delete({ where: { id } });
  await logAudit({ userId: admin.id, action: "DELETE", entity: "Media", entityId: id });
  revalidatePath("/dashboard/medias");
  return { ok: true };
}
