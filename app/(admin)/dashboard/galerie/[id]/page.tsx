import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateGalleryPhoto } from "@/lib/actions/gallery";
import { GalleryPhotoForm } from "@/components/admin/GalleryPhotoForm";

export const metadata: Metadata = { title: "Modifier la photo", robots: { index: false, follow: false } };

export default async function EditGalleryPhotoPage(
  props: PageProps<"/dashboard/galerie/[id]">,
) {
  await requireAdmin();
  const { id } = await props.params;

  const galleryPhoto = await prisma.galleryPhoto.findUnique({
    where: { id },
    include: { photo: true },
  });
  if (!galleryPhoto) notFound();

  return (
    <div>
      <h1 className="font-display text-h2 text-ink">Modifier la photo</h1>
      <div className="mt-6 max-w-md">
        <GalleryPhotoForm
          mode="edit"
          action={updateGalleryPhoto.bind(null, id)}
          galleryPhoto={{
            id: galleryPhoto.id,
            caption: galleryPhoto.caption,
            photo: {
              id: galleryPhoto.photo.id,
              url: galleryPhoto.photo.url,
              alt: galleryPhoto.photo.alt,
            },
          }}
        />
      </div>
    </div>
  );
}
