"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { galleryPhotoSchema } from "@/lib/validators/gallery";

export type GalleryPhotoActionState = { ok: true } | { ok: false; error: string };

async function revalidateAlbumPaths(albumId: string) {
  const album = await prisma.album.findUnique({ where: { id: albumId } });
  revalidatePath(`/dashboard/galerie/${albumId}`);
  revalidatePath("/impact");
  if (album) revalidatePath(`/galerie/${album.slug}`);
}

export async function addGalleryPhoto(
  albumId: string,
  photoId: string,
  caption: string,
): Promise<GalleryPhotoActionState> {
  const admin = await requireAdmin();
  const parsed = galleryPhotoSchema.safeParse({ albumId, photoId, caption: caption || null });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const last = await prisma.galleryPhoto.findFirst({
    where: { albumId },
    orderBy: { order: "desc" },
  });
  const photo = await prisma.galleryPhoto.create({
    data: { ...parsed.data, order: (last?.order ?? -1) + 1 },
  });

  await logAudit({ userId: admin.id, action: "CREATE", entity: "GalleryPhoto", entityId: photo.id });
  await revalidateAlbumPaths(albumId);
  return { ok: true };
}

export async function updateGalleryPhotoCaption(
  photoId: string,
  caption: string,
): Promise<GalleryPhotoActionState> {
  const admin = await requireAdmin();
  const photo = await prisma.galleryPhoto.update({
    where: { id: photoId },
    data: { caption: caption || null },
  });

  await logAudit({ userId: admin.id, action: "UPDATE", entity: "GalleryPhoto", entityId: photoId });
  await revalidateAlbumPaths(photo.albumId);
  return { ok: true };
}

export async function deleteGalleryPhoto(photoId: string): Promise<void> {
  const admin = await requireAdmin();
  const photo = await prisma.galleryPhoto.delete({ where: { id: photoId } });
  await logAudit({ userId: admin.id, action: "DELETE", entity: "GalleryPhoto", entityId: photoId });
  await revalidateAlbumPaths(photo.albumId);
}

export async function moveGalleryPhoto(photoId: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  const current = await prisma.galleryPhoto.findUnique({ where: { id: photoId } });
  if (!current) return;

  const neighbor = await prisma.galleryPhoto.findFirst({
    where: {
      albumId: current.albumId,
      order: direction === "up" ? { lt: current.order } : { gt: current.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.galleryPhoto.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.galleryPhoto.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  await revalidateAlbumPaths(current.albumId);
}
