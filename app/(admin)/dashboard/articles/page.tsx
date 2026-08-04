import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Status } from "@/app/generated/prisma/enums";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Articles", robots: { index: false, follow: false } };

const PAGE_SIZE = 10;

export default async function ArticlesAdminPage(
  props: PageProps<"/dashboard/articles">,
) {
  await requireAdmin();
  const searchParams = await props.searchParams;

  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status: Status | undefined =
    searchParams.status === "PUBLISHED" || searchParams.status === "DRAFT"
      ? searchParams.status
      : undefined;
  const sort = searchParams.sort === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(searchParams.page) || 1);

  const where = {
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
    ...(status ? { status } : {}),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { createdAt: sort },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-h2 text-ink">Articles</h1>
        <ButtonLink href="/dashboard/articles/nouveau" variant="primary">
          Nouvel article
        </ButtonLink>
      </div>

      <form method="get" className="mt-6 flex flex-wrap items-end gap-4">
        <div className="w-56">
          <Input id="filter-q" name="q" label="Recherche par titre" defaultValue={q} />
        </div>
        <div className="w-44">
          <Select
            id="filter-status"
            name="status"
            label="Statut"
            defaultValue={status ?? ""}
            options={[
              { value: "", label: "Tous les statuts" },
              { value: "DRAFT", label: "Brouillon" },
              { value: "PUBLISHED", label: "Publié" },
            ]}
          />
        </div>
        <input type="hidden" name="sort" value={sort} />
        <Button type="submit" variant="secondary">
          Filtrer
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-3">
        {articles.length === 0 && (
          <Card>
            <p className="text-sm text-muted">
              Aucun article ne correspond à ces critères.{" "}
              <Link href="/dashboard/articles/nouveau" className="text-accent-deep hover:underline">
                Créer le premier article
              </Link>
              .
            </p>
          </Card>
        )}

        {articles.length > 0 && (
          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-line px-5 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Titre
              </span>
              <Link
                href={{
                  pathname: "/dashboard/articles",
                  query: { q, status: status ?? "", sort: sort === "asc" ? "desc" : "asc" },
                }}
                className="text-xs font-semibold uppercase tracking-wide text-muted hover:text-accent-deep"
              >
                Date {sort === "asc" ? "↑" : "↓"}
              </Link>
            </div>
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/dashboard/articles/${article.id}`}
                className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 last:border-b-0 hover:bg-line/20"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{article.title}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {article.createdAt.toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <Badge variant={article.status === "PUBLISHED" ? "success" : "neutral"}>
                  {article.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                </Badge>
              </Link>
            ))}
          </Card>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            href={{
              pathname: "/dashboard/articles",
              query: { q, status: status ?? "", sort, page: Math.max(1, page - 1) },
            }}
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
              pathname: "/dashboard/articles",
              query: { q, status: status ?? "", sort, page: Math.min(totalPages, page + 1) },
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
