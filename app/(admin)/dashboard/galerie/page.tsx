import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { moveAlbum } from "@/lib/actions/albums";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ReorderButtons } from "@/components/admin/ReorderButtons";

export const metadata: Metadata = { title: "Galerie", robots: { index: false, follow: false } };

export default async function GalerieAdminPage() {
  await requireAdmin();
  const albums = await prisma.album.findMany({
    orderBy: { order: "asc" },
    include: { cover: true, _count: { select: { photos: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-h2 text-ink">Galerie</h1>
        <ButtonLink href="/dashboard/galerie/nouveau" variant="primary">
          Nouvel album
        </ButtonLink>
      </div>

      <div className="mt-6">
        {albums.length === 0 && (
          <Card>
            <p className="text-sm text-muted">
              Aucun album pour le moment.{" "}
              <Link
                href="/dashboard/galerie/nouveau"
                className="text-accent-deep hover:underline"
              >
                Créer le premier album
              </Link>
              .
            </p>
          </Card>
        )}

        {albums.length > 0 && (
          <Card className="p-0">
            {albums.map((album, index) => (
              <div
                key={album.id}
                className="flex items-center gap-4 border-b border-line px-5 py-3 last:border-b-0"
              >
                <ReorderButtons
                  id={album.id}
                  isFirst={index === 0}
                  isLast={index === albums.length - 1}
                  move={moveAlbum}
                />
                {album.cover ? (
                  <Image
                    src={album.cover.url}
                    alt={album.cover.alt}
                    width={64}
                    height={44}
                    className="h-11 w-16 rounded-sm border border-line object-cover"
                  />
                ) : (
                  <span className="h-11 w-16 rounded-sm border border-line bg-line/30" />
                )}
                <Link href={`/dashboard/galerie/${album.id}`} className="flex-1">
                  <p className="text-sm font-medium text-ink hover:text-accent-deep">
                    {album.title}
                  </p>
                  <p className="text-xs text-muted">
                    {album._count.photos} photo{album._count.photos > 1 ? "s" : ""}
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
