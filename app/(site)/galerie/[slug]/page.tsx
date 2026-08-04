import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

export async function generateStaticParams() {
  const albums = await prisma.album.findMany({ select: { slug: true } });
  return albums.map((album) => ({ slug: album.slug }));
}

export async function generateMetadata(
  props: PageProps<"/galerie/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const album = await prisma.album.findUnique({ where: { slug } });
  if (!album) return {};
  return { title: album.title, description: album.description ?? undefined };
}

export default async function AlbumDetailPage(
  props: PageProps<"/galerie/[slug]">,
) {
  const { slug } = await props.params;
  const album = await prisma.album.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: "asc" }, include: { photo: true } } },
  });
  if (!album) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
      <Link
        href="/impact"
        className="text-sm font-medium text-accent-deep hover:underline"
      >
        ← Retour à l&rsquo;impact
      </Link>
      <h1 className="mt-4 font-display text-h1 text-ink">{album.title}</h1>
      {album.description && (
        <p className="mt-4 max-w-xl text-body text-muted">{album.description}</p>
      )}

      {album.photos.length === 0 ? (
        <p className="mt-10 text-body text-muted">
          Cet album ne contient pas encore de photo.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {album.photos.map((item) => (
            <figure key={item.id}>
              <Image
                src={item.photo.url}
                alt={item.photo.alt}
                width={400}
                height={300}
                className="aspect-4/3 w-full rounded-md object-cover"
              />
              {item.caption && (
                <figcaption className="mt-1.5 text-xs text-muted">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
