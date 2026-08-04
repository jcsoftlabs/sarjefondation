import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles, getArticleBySlug } from "@/lib/content/articles";
import { formatDate } from "@/lib/format-date";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(
  props: PageProps<"/actualites/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function ArticleDetailPage(
  props: PageProps<"/actualites/[slug]">,
) {
  const { slug } = await props.params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <Link
        href="/actualites"
        className="text-sm font-medium text-accent-deep hover:underline"
      >
        ← Toutes les actualités
      </Link>
      <p className="mt-4 text-xs text-muted">{formatDate(article.publishedAt)}</p>
      <h1 className="mt-2 font-display text-h1 text-ink">{article.title}</h1>
      <div className="mt-8 flex flex-col gap-4">
        {article.body.map((paragraph, index) => (
          <p key={index} className="text-body text-ink">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
