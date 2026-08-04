"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { galleryPhotoSchema } from "@/lib/validators/gallery";

export type GalleryPhotoActionState = { ok: true } | { ok: false; error: string };

function parseGalleryPhotoForm(formData: FormData) {
  return galleryPhotoSchema.safeParse({
    photoId: formData.get("photoId"),
    caption: formData.get("caption") || null,
  });
}

export async function createGalleryPhoto(
  _prevState: GalleryPhotoActionState | null,
  formData: FormData,
): Promise<GalleryPhotoActionState> {
  const admin = await requireAdmin();
  const parsed = parseGalleryPhotoForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const last = await prisma.galleryPhoto.findFirst({ orderBy: { order: "desc" } });
  const photo = await prisma.galleryPhoto.create({
    data: { ...parsed.data, order: (last?.order ?? -1) + 1 },
  });

  await logAudit({ userId: admin.id, action: "CREATE", entity: "GalleryPhoto", entityId: photo.id });
  revalidatePath("/dashboard/galerie");
  revalidatePath("/impact");
  redirect("/dashboard/galerie");
}

export async function updateGalleryPhoto(
  id: string,
  _prevState: GalleryPhotoActionState | null,
  formData: FormData,
): Promise<GalleryPhotoActionState> {
  const admin = await requireAdmin();
  const parsed = parseGalleryPhotoForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const existing = await prisma.galleryPhoto.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: "Photo introuvable." };
  }

  await prisma.galleryPhoto.update({ where: { id }, data: parsed.data });
  await logAudit({ userId: admin.id, action: "UPDATE", entity: "GalleryPhoto", entityId: id });
  revalidatePath("/dashboard/galerie");
  revalidatePath("/impact");
  return { ok: true };
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  const admin = await requireAdmin();
  await prisma.galleryPhoto.delete({ where: { id } });
  await logAudit({ userId: admin.id, action: "DELETE", entity: "GalleryPhoto", entityId: id });
  revalidatePath("/dashboard/galerie");
  revalidatePath("/impact");
  redirect("/dashboard/galerie");
}

export async function moveGalleryPhoto(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  const current = await prisma.galleryPhoto.findUnique({ where: { id } });
  if (!current) return;

  const neighbor = await prisma.galleryPhoto.findFirst({
    where: direction === "up" ? { order: { lt: current.order } } : { order: { gt: current.order } },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.galleryPhoto.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.galleryPhoto.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  revalidatePath("/dashboard/galerie");
  revalidatePath("/impact");
}
