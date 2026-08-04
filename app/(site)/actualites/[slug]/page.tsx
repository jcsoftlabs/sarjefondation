import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { JSONContent } from "@tiptap/react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format-date";
import { TiptapRenderer } from "@/components/TiptapRenderer";

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(
  props: PageProps<"/actualites/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || article.status !== "PUBLISHED") return {};
  return { title: article.title, description: article.excerpt };
}

export default async function ArticleDetailPage(
  props: PageProps<"/actualites/[slug]">,
) {
  const { slug } = await props.params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { cover: true },
  });
  if (!article || article.status !== "PUBLISHED") notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <Link
        href="/actualites"
        className="text-sm font-medium text-accent-deep hover:underline"
      >
        ← Toutes les actualités
      </Link>
      {article.cover && (
        <Image
          src={article.cover.url}
          alt={article.cover.alt}
          width={800}
          height={450}
          className="mt-6 w-full rounded-md object-cover"
          style={{ aspectRatio: "16 / 9" }}
          priority
        />
      )}
      <p className="mt-4 text-xs text-muted">
        {article.publishedAt && formatDate(article.publishedAt.toISOString())}
      </p>
      <h1 className="mt-2 font-display text-h1 text-ink">{article.title}</h1>
      <div className="mt-8">
        <TiptapRenderer content={article.content as JSONContent} />
      </div>
    </div>
  );
}
