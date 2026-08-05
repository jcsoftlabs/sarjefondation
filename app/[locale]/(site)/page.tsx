import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format-date";
import { localize } from "@/lib/localize";

export async function generateMetadata(
  props: PageProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Home" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  const values = [
    { title: t("valueProximiteTitle"), body: t("valueProximiteBody") },
    { title: t("valueTransparenceTitle"), body: t("valueTransparenceBody") },
    { title: t("valueDureeTitle"), body: t("valueDureeBody") },
  ];
  const valueIcons = [
    <svg key="proximite" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>,
    <svg key="transparence" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>,
    <svg key="duree" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>,
  ];

  const [impactStats, featuredPrograms, latestArticle] = await Promise.all([
    prisma.impactStat.findMany({ orderBy: { order: "asc" } }),
    prisma.program.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    prisma.article.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  return (
    <div>
      {/* Premium Hero Section - Full Viewport */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/tdqpx8gd/image/upload/v1785882930/sarje-fondation/hero_haiti_education.jpg"
            alt="Enfants haïtiens souriants en classe"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/50 mix-blend-multiply"></div>
          {/* Optional gradient for extra readability at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl px-4 text-center md:px-6">
          <p className="mb-6 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            {t("heroEyebrow")}
          </p>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg font-medium text-white/90 md:text-xl">
            {t("heroBody")}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/don"
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-white hover:text-accent-deep"
            >
              {t("heroCtaDon")}
            </Link>
            <Link
              href="/programmes"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/80 bg-transparent px-8 py-4 text-base font-bold text-white transition-all hover:border-white hover:bg-white hover:text-ink"
            >
              {t("heroCtaProgrammes")}
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Section - Premium Full Width Accent */}
      {impactStats.length > 0 && (
        <section className="bg-accent-deep py-20 text-white md:py-32">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mb-16 text-center">
              <h2 className="font-display text-3xl font-bold md:text-5xl">{t("impactTitle")}</h2>
              <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-accent"></div>
            </div>
            <div className="grid gap-12 sm:grid-cols-3 md:gap-8">
              {impactStats.map((stat) => (
                <div key={stat.id} className="text-center">
                  <p className="font-display text-6xl font-bold md:text-7xl">{stat.value}</p>
                  <p className="mt-4 text-base font-medium uppercase tracking-wider text-white/80 md:text-lg">
                    {localize(stat, "label", locale as Locale)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values Section - Premium Cards */}
      <section className="bg-paper py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-16 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">{t("valuesEyebrow")}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-5xl">{t("valuesTitle")}</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {values.map((value, index) => (
              <div key={value.title} className="group flex flex-col items-center rounded-2xl bg-white p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-soft transition-transform group-hover:scale-110">
                  {valueIcons[index]}
                </div>
                <h3 className="font-display text-2xl font-bold text-ink transition-colors group-hover:text-accent-deep">{value.title}</h3>
                <p className="mt-4 leading-relaxed text-muted">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      {featuredPrograms.length > 0 && (
        <section className="border-t border-line bg-white py-20 md:py-32">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-accent">{t("programmesEyebrow")}</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-5xl">{t("programmesTitle")}</h2>
              </div>
              <Link
                href="/programmes"
                className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent-deep transition-colors hover:text-accent"
              >
                {t("programmesToutVoir")}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {featuredPrograms.map((program) => (
                <Card key={program.slug} className="group flex flex-col rounded-2xl border border-line bg-paper p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl">
                  <h3 className="font-display text-2xl font-bold text-ink transition-colors group-hover:text-accent-deep">
                    {localize(program, "title", locale as Locale)}
                  </h3>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-muted">
                    {localize(program, "summary", locale as Locale)}
                  </p>
                  <Link
                    href={`/programmes/${program.slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-accent-deep"
                  >
                    {t("programmesEnSavoirPlus")}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Actualités Section */}
      {latestArticle && (
        <section className="bg-paper py-20 md:py-32">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-accent">{t("actualitesEyebrow")}</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-5xl">{t("actualitesTitle")}</h2>
            </div>
            <Link href={`/actualites/${latestArticle.slug}`} className="group mx-auto mt-12 block max-w-3xl rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl md:p-12">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                {latestArticle.publishedAt &&
                  formatDate(latestArticle.publishedAt.toISOString())}
              </p>
              <h3 className="mt-4 font-display text-2xl font-bold text-ink transition-colors group-hover:text-accent-deep md:text-4xl">
                {localize(latestArticle, "title", locale as Locale)}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
                {localize(latestArticle, "excerpt", locale as Locale)}
              </p>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-accent-deep">
                {t("actualitesLireArticle")}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
            <div className="mt-12 text-center">
              <Link
                href="/actualites"
                className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent-deep transition-colors hover:text-accent"
              >
                {t("actualitesToutesVoir")}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Implication Section */}
      <section className="relative overflow-hidden bg-accent-soft py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-bold text-ink md:text-5xl">
            {t("implicationTitle")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/80 md:text-xl">
            {t("implicationBody")}
          </p>
          <div className="mt-12 flex justify-center">
            <Link
              href="/s-impliquer"
              className="inline-flex items-center justify-center rounded-full bg-accent-deep px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-accent hover:shadow-xl"
            >
              {t("implicationCta")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
