"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { albumSchema } from "@/lib/validators/albums";

export type AlbumActionState =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function parseAlbumForm(formData: FormData) {
  return albumSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description") || null,
    coverId: formData.get("coverId") || null,
  });
}

export async function createAlbum(
  _prevState: AlbumActionState | null,
  formData: FormData,
): Promise<AlbumActionState> {
  const admin = await requireAdmin();
  const parsed = parseAlbumForm(formData);
  if (!parsed.success) {
    return { ok: false, error: "Le formulaire contient des erreurs." };
  }

  const slugTaken = await prisma.album.findUnique({ where: { slug: parsed.data.slug } });
  if (slugTaken) {
    return {
      ok: false,
      error: "Ce slug est déjà utilisé par un autre album.",
      fieldErrors: { slug: "Ce slug est déjà utilisé par un autre album." },
    };
  }

  const last = await prisma.album.findFirst({ orderBy: { order: "desc" } });
  const album = await prisma.album.create({
    data: { ...parsed.data, order: (last?.order ?? -1) + 1 },
  });

  await logAudit({ userId: admin.id, action: "CREATE", entity: "Album", entityId: album.id });
  revalidatePath("/dashboard/galerie");
  revalidatePath("/impact");
  redirect(`/dashboard/galerie/${album.id}`);
}

export async function updateAlbum(
  id: string,
  _prevState: AlbumActionState | null,
  formData: FormData,
): Promise<AlbumActionState> {
  const admin = await requireAdmin();
  const parsed = parseAlbumForm(formData);
  if (!parsed.success) {
    return { ok: false, error: "Le formulaire contient des erreurs." };
  }

  const existing = await prisma.album.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: "Album introuvable." };
  }

  const slugTaken = await prisma.album.findUnique({ where: { slug: parsed.data.slug } });
  if (slugTaken && slugTaken.id !== id) {
    return {
      ok: false,
      error: "Ce slug est déjà utilisé par un autre album.",
      fieldErrors: { slug: "Ce slug est déjà utilisé par un autre album." },
    };
  }

  await prisma.album.update({ where: { id }, data: parsed.data });
  await logAudit({ userId: admin.id, action: "UPDATE", entity: "Album", entityId: id });
  revalidatePath("/dashboard/galerie");
  revalidatePath(`/dashboard/galerie/${id}`);
  revalidatePath("/impact");
  revalidatePath(`/galerie/${existing.slug}`);
  if (parsed.data.slug !== existing.slug) {
    revalidatePath(`/galerie/${parsed.data.slug}`);
  }
  return { ok: true };
}

export async function deleteAlbum(id: string): Promise<void> {
  const admin = await requireAdmin();
  const album = await prisma.album.delete({ where: { id } });
  await logAudit({ userId: admin.id, action: "DELETE", entity: "Album", entityId: id });
  revalidatePath("/dashboard/galerie");
  revalidatePath("/impact");
  revalidatePath(`/galerie/${album.slug}`);
  redirect("/dashboard/galerie");
}

export async function moveAlbum(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  const current = await prisma.album.findUnique({ where: { id } });
  if (!current) return;

  const neighbor = await prisma.album.findFirst({
    where: direction === "up" ? { order: { lt: current.order } } : { order: { gt: current.order } },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.album.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.album.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  revalidatePath("/dashboard/galerie");
  revalidatePath("/impact");
}
