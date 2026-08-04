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
    prisma.article.findMany({ where: { coverId: id }, select: { id: true, title: true, slug: true } }),
    prisma.program.findMany({ where: { coverId: id }, select: { id: true, title: true, slug: true } }),
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

  // Revalider les pages publiques qui affichaient cette image avant de la
  // supprimer — la référence sera mise à NULL (ON DELETE SET NULL), mais le
  // rendu déjà en cache doit être régénéré pour ne plus l'afficher.
  const usage = await getMediaUsage(id);

  await prisma.media.delete({ where: { id } });
  await logAudit({ userId: admin.id, action: "DELETE", entity: "Media", entityId: id });

  revalidatePath("/dashboard/medias");
  if (usage.articles.length > 0 || usage.programs.length > 0) {
    revalidatePath("/");
  }
  if (usage.teamMembers.length > 0) {
    revalidatePath("/la-fondation/equipe");
  }
  if (usage.testimonials.length > 0) {
    revalidatePath("/impact");
  }
  for (const article of usage.articles) {
    revalidatePath("/actualites");
    revalidatePath(`/actualites/${article.slug}`);
  }
  for (const program of usage.programs) {
    revalidatePath("/programmes");
    revalidatePath(`/programmes/${program.slug}`);
  }

  return { ok: true };
}
