import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format-date";
import { localize } from "@/lib/localize";

const PAGE_SIZE = 8;

export async function generateMetadata(
  props: PageProps<"/[locale]/actualites">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Actualites" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ActualitesPage(
  props: PageProps<"/[locale]/actualites">,
) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Actualites");
  const loc = locale as Locale;

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
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">{t("title")}</h1>

      {articles.length === 0 ? (
        <p className="mt-10 text-body text-muted">{t("empty")}</p>
      ) : (
        <div className="mt-10 flex flex-col gap-6">
          {articles.map((article) => (
            <Card key={article.slug} className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <p className="text-xs text-muted">
                {article.publishedAt && formatDate(article.publishedAt.toISOString())}
              </p>
              <h2 className="mt-2 font-display text-h3 text-ink group-hover:text-accent-deep transition-colors">
                {localize(article, "title", loc)}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {localize(article, "excerpt", loc)}
              </p>
              <Link
                href={`/actualites/${article.slug}`}
                className="mt-4 inline-block text-sm font-medium text-accent-deep hover:underline"
              >
                {t("lireArticle")}
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
                : "text-sm font-medium text-accent-deep hover:underline transition-transform hover:scale-105"
            }
          >
            {t("precedent")}
          </Link>
          <span className="text-sm text-muted">
            {t("pageSur", { page, totalPages })}
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
                : "text-sm font-medium text-accent-deep hover:underline transition-transform hover:scale-105"
            }
          >
            {t("suivant")}
          </Link>
        </div>
      )}
    </div>
  );
}
