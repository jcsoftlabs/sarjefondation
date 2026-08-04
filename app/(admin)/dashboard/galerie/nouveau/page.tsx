import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createAlbum } from "@/lib/actions/albums";
import { AlbumForm } from "@/components/admin/AlbumForm";

export const metadata: Metadata = { title: "Nouvel album", robots: { index: false, follow: false } };

export default async function NewAlbumPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="font-display text-h2 text-ink">Nouvel album</h1>
      <p className="mt-2 text-sm text-muted">
        Créez l&rsquo;album d&rsquo;abord, vous pourrez y ajouter des photos
        juste après.
      </p>
      <div className="mt-6 max-w-md">
        <AlbumForm mode="create" action={createAlbum} />
      </div>
    </div>
  );
}
