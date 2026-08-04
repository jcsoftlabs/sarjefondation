import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { articles } from "@/lib/content/articles";
import { formatDate } from "@/lib/format-date";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Les actualités de la Fondation Sarje.",
};

export default function ActualitesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Actualités
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">Actualités</h1>

      <div className="mt-10 flex flex-col gap-6">
        {articles.map((article) => (
          <Card key={article.slug}>
            <p className="text-xs text-muted">{formatDate(article.publishedAt)}</p>
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
    </div>
  );
}
