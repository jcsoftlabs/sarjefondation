import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format-date";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Les actualités de la Fondation Sarje.",
};

const PAGE_SIZE = 8;

export default async function ActualitesPage(
  props: PageProps<"/actualites">,
) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams.page) || 1);

  const where = { status: "PUBLISHED" as const };
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.article.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Actualités
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">Actualités</h1>

      {articles.length === 0 ? (
        <p className="mt-10 text-body text-muted">
          Les actualités de la fondation seront publiées ici prochainement.
        </p>
      ) : (
        <div className="mt-10 flex flex-col gap-6">
          {articles.map((article) => (
            <Card key={article.slug}>
              <p className="text-xs text-muted">
                {article.publishedAt && formatDate(article.publishedAt.toISOString())}
              </p>
              <h2 className="mt-2 font-display text-h3 text-ink">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-muted">{article.excerpt}</p>
              <Link
                href={`/actualites/${article.slug}`}
                className="mt-4 inline-block text-sm font-medium text-accent-deep hover:underline"
              >
                Lire l&rsquo;article
              </Link>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href={{ pathname: "/actualites", query: { page: Math.max(1, page - 1) } }}
            aria-disabled={page <= 1}
            className={
              page <= 1
                ? "pointer-events-none text-sm text-muted opacity-40"
                : "text-sm font-medium text-accent-deep hover:underline"
            }
          >
            Précédent
          </Link>
          <span className="text-sm text-muted">
            Page {page} sur {totalPages}
          </span>
          <Link
            href={{
              pathname: "/actualites",
              query: { page: Math.min(totalPages, page + 1) },
            }}
            aria-disabled={page >= totalPages}
            className={
              page >= totalPages
                ? "pointer-events-none text-sm text-muted opacity-40"
                : "text-sm font-medium text-accent-deep hover:underline"
            }
          >
            Suivant
          </Link>
        </div>
      )}
    </div>
  );
}
