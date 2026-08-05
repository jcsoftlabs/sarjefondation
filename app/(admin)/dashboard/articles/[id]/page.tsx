import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateArticle } from "@/lib/actions/articles";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const metadata: Metadata = { title: "Modifier l'article", robots: { index: false, follow: false } };

export default async function EditArticlePage(
  props: PageProps<"/dashboard/articles/[id]">,
) {
  await requireAdmin();
  const { id } = await props.params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: { cover: true },
  });
  if (!article) notFound();

  return (
    <div>
      <h1 className="font-display text-h2 text-ink">{article.title}</h1>
      <div className="mt-6 max-w-2xl">
        <ArticleForm
          mode="edit"
          action={updateArticle.bind(null, id)}
          article={{
            id: article.id,
            title: article.title,
            titleEn: article.titleEn,
            slug: article.slug,
            excerpt: article.excerpt,
            excerptEn: article.excerptEn,
            content: article.content as JSONContent,
            contentEn: article.contentEn as JSONContent | null,
            status: article.status,
            cover: article.cover
              ? { id: article.cover.id, url: article.cover.url, alt: article.cover.alt }
              : null,
          }}
        />
      </div>
    </div>
  );
}
