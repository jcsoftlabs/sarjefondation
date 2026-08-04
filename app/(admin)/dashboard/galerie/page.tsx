import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { moveGalleryPhoto } from "@/lib/actions/gallery";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ReorderButtons } from "@/components/admin/ReorderButtons";

export const metadata: Metadata = { title: "Galerie", robots: { index: false, follow: false } };

export default async function GalerieAdminPage() {
  await requireAdmin();
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: { order: "asc" },
    include: { photo: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-h2 text-ink">Galerie</h1>
        <ButtonLink href="/dashboard/galerie/nouveau" variant="primary">
          Ajouter une photo
        </ButtonLink>
      </div>

      <div className="mt-6">
        {photos.length === 0 && (
          <Card>
            <p className="text-sm text-muted">
              Aucune photo pour le moment.{" "}
              <Link
                href="/dashboard/galerie/nouveau"
                className="text-accent-deep hover:underline"
              >
                Ajouter la première photo
              </Link>
              .
            </p>
          </Card>
        )}

        {photos.length > 0 && (
          <Card className="p-0">
            {photos.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b border-line px-5 py-3 last:border-b-0"
              >
                <ReorderButtons
                  id={item.id}
                  isFirst={index === 0}
                  isLast={index === photos.length - 1}
                  move={moveGalleryPhoto}
                />
                <Image
                  src={item.photo.url}
                  alt={item.photo.alt}
                  width={64}
                  height={44}
                  className="h-11 w-16 rounded-sm border border-line object-cover"
                />
                <Link href={`/dashboard/galerie/${item.id}`} className="flex-1">
                  <p className="text-sm font-medium text-ink hover:text-accent-deep">
                    {item.caption || item.photo.alt}
                  </p>
                </Link>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
