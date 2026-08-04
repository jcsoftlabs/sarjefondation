import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createGalleryPhoto } from "@/lib/actions/gallery";
import { GalleryPhotoForm } from "@/components/admin/GalleryPhotoForm";

export const metadata: Metadata = { title: "Ajouter une photo", robots: { index: false, follow: false } };

export default async function NewGalleryPhotoPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="font-display text-h2 text-ink">Ajouter une photo</h1>
      <div className="mt-6 max-w-md">
        <GalleryPhotoForm mode="create" action={createGalleryPhoto} />
      </div>
    </div>
  );
}
