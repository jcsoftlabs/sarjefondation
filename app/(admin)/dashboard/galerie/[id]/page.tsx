import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateAlbum } from "@/lib/actions/albums";
import { AlbumForm } from "@/components/admin/AlbumForm";
import { AlbumPhotosManager } from "@/components/admin/AlbumPhotosManager";

export const metadata: Metadata = { title: "Modifier l'album", robots: { index: false, follow: false } };

export default async function EditAlbumPage(
  props: PageProps<"/dashboard/galerie/[id]">,
) {
  await requireAdmin();
  const { id } = await props.params;

  const album = await prisma.album.findUnique({
    where: { id },
    include: {
      cover: true,
      photos: { orderBy: { order: "asc" }, include: { photo: true } },
    },
  });
  if (!album) notFound();

  return (
    <div>
      <h1 className="font-display text-h2 text-ink">{album.title}</h1>
      <div className="mt-6 max-w-md">
        <AlbumForm
          mode="edit"
          action={updateAlbum.bind(null, id)}
          album={{
            id: album.id,
            title: album.title,
            titleEn: album.titleEn,
            slug: album.slug,
            description: album.description,
            descriptionEn: album.descriptionEn,
            cover: album.cover
              ? { id: album.cover.id, url: album.cover.url, alt: album.cover.alt }
              : null,
          }}
        />
      </div>

      <div className="mt-12 max-w-2xl border-t border-line pt-8">
        <AlbumPhotosManager
          albumId={album.id}
          photos={album.photos.map((p) => ({
            id: p.id,
            caption: p.caption,
            captionEn: p.captionEn,
            photo: { id: p.photo.id, url: p.photo.url, alt: p.photo.alt },
          }))}
        />
      </div>
    </div>
  );
}
