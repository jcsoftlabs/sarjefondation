import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { JSONContent } from "@tiptap/react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { TiptapRenderer } from "@/components/TiptapRenderer";

export const metadata: Metadata = { title: "Aperçu", robots: { index: false, follow: false } };

export default async function ArticlePreviewPage(
  props: PageProps<"/dashboard/articles/[id]/apercu">,
) {
  await requireAdmin();
  const { id } = await props.params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: { cover: true },
  });
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/dashboard/articles/${article.id}`}
          className="text-sm font-medium text-accent-deep hover:underline"
        >
          ← Retour à l&rsquo;édition
        </Link>
        <Badge variant={article.status === "PUBLISHED" ? "success" : "neutral"}>
          {article.status === "PUBLISHED" ? "Publié" : "Aperçu du brouillon"}
        </Badge>
      </div>

      {article.cover && (
        <Image
          src={article.cover.url}
          alt={article.cover.alt}
          width={800}
          height={450}
          className="mt-6 w-full rounded-md object-cover"
          style={{ aspectRatio: "16 / 9" }}
        />
      )}
      <h1 className="mt-6 font-display text-h1 text-ink">{article.title}</h1>
      <p className="mt-3 text-body text-muted">{article.excerpt}</p>
      <div className="mt-8">
        <TiptapRenderer content={article.content as JSONContent} />
      </div>
    </div>
  );
}
