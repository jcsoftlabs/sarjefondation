import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format-date";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "La Fondation Sarje agit auprès des familles vulnérables en Haïti à travers des programmes d'éducation, de santé et d'accompagnement communautaire.",
};

const values = [
  {
    title: "Proximité",
    body: "Nos équipes vivent et travaillent dans les communautés qu'elles accompagnent, pas à distance.",
  },
  {
    title: "Transparence",
    body: "Chaque don est tracé et rendu compte, aux familles comme aux partenaires.",
  },
  {
    title: "Durée",
    body: "Nous accompagnons les enfants dans la durée, pas au coup par coup.",
  },
];

export default async function HomePage() {
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
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Fondation Sarje
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-h1 text-ink">
            Chaque enfant accompagné aujourd&rsquo;hui construit l&rsquo;Haïti
            de demain.
          </h1>
          <p className="mt-5 max-w-xl text-body text-muted">
            La Fondation Sarje agit auprès des familles vulnérables à travers
            des programmes d&rsquo;éducation, de santé et d&rsquo;accompagnement
            communautaire, portés par des équipes présentes sur le terrain.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/s-impliquer" variant="primary">
              Faire un don
            </ButtonLink>
            <ButtonLink href="/programmes" variant="secondary">
              Découvrir les programmes
            </ButtonLink>
          </div>
        </div>
      </section>

      {impactStats.length > 0 && (
        <section className="border-b border-line">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:grid-cols-3 md:px-6">
            {impactStats.map((stat) => (
              <div key={stat.id}>
                <p className="font-display text-h1 text-ink">{stat.value}</p>
                <div className="mt-3 mb-3 h-[3px] w-9 rounded-full bg-accent" />
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {featuredPrograms.length > 0 && (
        <section className="border-b border-line">
          <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-h2 text-ink">Nos programmes</h2>
              <Link
                href="/programmes"
                className="text-sm font-medium text-accent-deep hover:underline"
              >
                Tous les programmes
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {featuredPrograms.map((program) => (
                <Card key={program.slug} className="flex flex-col">
                  <h3 className="font-display text-h3 text-ink">{program.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted">{program.summary}</p>
                  <Link
                    href={`/programmes/${program.slug}`}
                    className="mt-4 text-sm font-medium text-accent-deep hover:underline"
                  >
                    En savoir plus
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
          <h2 className="font-display text-h2 text-ink">Nos valeurs</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title}>
                <h3 className="text-base font-semibold text-ink">{value.title}</h3>
                <p className="mt-2 text-sm text-muted">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {latestArticle && (
        <section className="border-b border-line">
          <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-h2 text-ink">Actualités</h2>
              <Link
                href="/actualites"
                className="text-sm font-medium text-accent-deep hover:underline"
              >
                Toutes les actualités
              </Link>
            </div>
            <Card className="mt-8">
              <p className="text-xs text-muted">
                {latestArticle.publishedAt &&
                  formatDate(latestArticle.publishedAt.toISOString())}
              </p>
              <h3 className="mt-2 font-display text-h3 text-ink">
                {latestArticle.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{latestArticle.excerpt}</p>
              <Link
                href={`/actualites/${latestArticle.slug}`}
                className="mt-4 inline-block text-sm font-medium text-accent-deep hover:underline"
              >
                Lire l&rsquo;article
              </Link>
            </Card>
          </div>
        </section>
      )}

      <section>
        <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-6">
          <h2 className="font-display text-h2 text-ink">
            Votre engagement change des vies concrètes
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-body text-muted">
            Bénévolat, partenariat ou don : il existe une façon de s&rsquo;impliquer
            adaptée à chacun.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/s-impliquer" variant="primary">
              S&rsquo;impliquer
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
