import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/localize";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const albums = await prisma.album.findMany({ select: { slug: true } });
  return routing.locales.flatMap((locale) =>
    albums.map((album) => ({ locale, slug: album.slug })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/galerie/[slug]">,
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const album = await prisma.album.findUnique({ where: { slug } });
  if (!album) return {};
  const loc = locale as Locale;
  return {
    title: localize(album, "title", loc),
    description: localize(album, "description", loc) ?? undefined,
  };
}

export default async function AlbumDetailPage(
  props: PageProps<"/[locale]/galerie/[slug]">,
) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Galerie");
  const loc = locale as Locale;

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
        {t("retour")}
      </Link>
      <h1 className="mt-4 font-display text-h1 text-ink">
        {localize(album, "title", loc)}
      </h1>
      {album.description && (
        <p className="mt-4 max-w-xl text-body text-muted">
          {localize(album, "description", loc)}
        </p>
      )}

      {album.photos.length === 0 ? (
        <p className="mt-10 text-body text-muted">{t("empty")}</p>
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
                  {localize(item, "caption", loc)}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
