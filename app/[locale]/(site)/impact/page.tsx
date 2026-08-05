import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/localize";

export async function generateMetadata(
  props: PageProps<"/[locale]/impact">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Impact" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ImpactPage(props: PageProps<"/[locale]/impact">) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Impact");
  const loc = locale as Locale;

  const [impactStats, testimonials, albums] = await Promise.all([
    prisma.impactStat.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" }, include: { photo: true } }),
    prisma.album.findMany({
      orderBy: { order: "asc" },
      include: { cover: true, _count: { select: { photos: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">{t("title")}</h1>
      <p className="mt-5 max-w-xl text-body text-muted">{t("intro")}</p>

      {impactStats.length === 0 ? (
        <p className="mt-12 text-body text-muted">{t("statsEmpty")}</p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {impactStats.map((stat) => (
            <div key={stat.id} className="rounded-xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <p className="font-display text-h1 text-accent-deep">{stat.value}</p>
              <div className="mt-4 mb-3 h-[3px] w-12 rounded-full bg-accent" />
              <p className="text-sm font-medium text-muted">{localize(stat, "label", loc)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16">
        <h2 className="font-display text-h2 text-ink">{t("terrainTitle")}</h2>
        {albums.length === 0 ? (
          <div className="mt-6 rounded-md border border-dashed border-line p-8 text-center">
            <p className="text-body text-muted">{t("terrainEmpty")}</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/galerie/${album.slug}`}
                className="group block overflow-hidden rounded-md border border-line transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {album.cover ? (
                  <Image
                    src={album.cover.url}
                    alt={album.cover.alt}
                    width={360}
                    height={270}
                    className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="aspect-4/3 w-full bg-line/30" />
                )}
                <div className="p-3">
                  <p className="text-sm font-semibold text-ink group-hover:text-accent-deep">
                    {localize(album, "title", loc)}
                  </p>
                  <p className="text-xs text-muted">
                    {album._count.photos} {album._count.photos > 1 ? t("photos") : t("photo")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16">
        <h2 className="font-display text-h2 text-ink">{t("temoignagesTitle")}</h2>
        {testimonials.length === 0 ? (
          <div className="mt-6 rounded-md border border-dashed border-line p-8 text-center">
            <p className="text-body text-muted">{t("temoignagesEmpty")}</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.id}
                className="relative rounded-xl border border-line bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="absolute top-6 right-6 text-accent/10">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.714 4.103-9.609 9.983-9.609v3.391c-2.83 0-5.467 1.258-6.177 4.609h6.177v9h-9.983zm-14.017 0v-7.391c0-5.714 4.103-9.609 9.983-9.609v3.391c-2.83 0-5.467 1.258-6.177 4.609h6.177v9h-9.983z"/></svg>
                </div>
                <p className="relative z-10 text-body text-ink">
                  &ldquo;{localize(testimonial, "quote", loc)}&rdquo;
                </p>
                <footer className="relative z-10 mt-6 flex items-center gap-3 border-t border-line/50 pt-4">
                  {testimonial.photo ? (
                    <Image
                      src={testimonial.photo.url}
                      alt={testimonial.photo.alt}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full border border-line object-cover"
                    />
                  ) : (
                    <span className="h-10 w-10 rounded-full border border-line bg-line/30" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {testimonial.author}
                    </p>
                    {testimonial.role && (
                      <p className="text-xs text-muted">
                        {localize(testimonial, "role", loc)}
                      </p>
                    )}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
