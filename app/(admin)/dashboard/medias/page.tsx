import type { Metadata } from "next";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MediaMultiUpload } from "@/components/admin/MediaMultiUpload";
import { MediaDeleteButton } from "@/components/admin/MediaDeleteButton";

export const metadata: Metadata = { title: "Médias", robots: { index: false, follow: false } };

export default async function MediasAdminPage(
  props: PageProps<"/dashboard/medias">,
) {
  await requireAdmin();
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";

  const media = await prisma.media.findMany({
    where: q ? { alt: { contains: q, mode: "insensitive" } } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-h2 text-ink">Médias</h1>
        <MediaMultiUpload />
      </div>

      <form method="get" className="mt-6 flex items-end gap-4">
        <div className="w-64">
          <Input id="media-search" name="q" label="Rechercher par texte alternatif" defaultValue={q} />
        </div>
        <Button type="submit" variant="secondary">
          Rechercher
        </Button>
      </form>

      <div className="mt-6">
        {media.length === 0 && (
          <Card>
            <p className="text-sm text-muted">
              {q
                ? "Aucune image ne correspond à cette recherche."
                : "Aucune image envoyée pour le moment."}
            </p>
          </Card>
        )}

        {media.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {media.map((item) => (
              <Card key={item.id} className="flex flex-col gap-2 p-3">
                <Image
                  src={item.url}
                  alt={item.alt}
                  width={220}
                  height={140}
                  className="h-28 w-full rounded-sm object-cover"
                />
                <p className="line-clamp-2 text-xs text-muted">{item.alt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">
                    {(item.sizeBytes / 1024).toFixed(0)} Ko
                  </span>
                  <MediaDeleteButton id={item.id} alt={item.alt} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
