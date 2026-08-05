import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { JSONContent } from "@tiptap/react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format-date";
import { TiptapRenderer } from "@/components/TiptapRenderer";
import { localize } from "@/lib/localize";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return routing.locales.flatMap((locale) =>
    articles.map((article) => ({ locale, slug: article.slug })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/actualites/[slug]">,
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || article.status !== "PUBLISHED") return {};
  const loc = locale as Locale;
  return {
    title: localize(article, "title", loc),
    description: localize(article, "excerpt", loc),
  };
}

export default async function ArticleDetailPage(
  props: PageProps<"/[locale]/actualites/[slug]">,
) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Actualites");
  const loc = locale as Locale;

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
        {t("retour")}
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
      <h1 className="mt-2 font-display text-h1 text-ink">
        {localize(article, "title", loc)}
      </h1>
      <div className="mt-8">
        <TiptapRenderer
          content={localize(article, "content", loc) as JSONContent}
        />
      </div>
    </div>
  );
}
