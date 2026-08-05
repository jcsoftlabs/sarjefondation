import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { JSONContent } from "@tiptap/react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { TiptapRenderer } from "@/components/TiptapRenderer";
import { localize } from "@/lib/localize";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return routing.locales.flatMap((locale) =>
    programs.map((program) => ({ locale, slug: program.slug })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/programmes/[slug]">,
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const program = await prisma.program.findUnique({ where: { slug } });
  if (!program || !program.isActive) return {};
  return {
    title: localize(program, "title", locale as Locale),
    description: localize(program, "summary", locale as Locale),
  };
}

export default async function ProgramDetailPage(
  props: PageProps<"/[locale]/programmes/[slug]">,
) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Programmes");

  const program = await prisma.program.findUnique({
    where: { slug },
    include: { cover: true },
  });
  if (!program || !program.isActive) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <Link
        href="/programmes"
        className="text-sm font-medium text-accent-deep hover:underline"
      >
        {t("retour")}
      </Link>
      {program.cover && (
        <Image
          src={program.cover.url}
          alt={program.cover.alt}
          width={800}
          height={450}
          className="mt-6 w-full rounded-md object-cover"
          style={{ aspectRatio: "16 / 9" }}
          priority
        />
      )}
      <h1 className="mt-6 font-display text-h1 text-ink">
        {localize(program, "title", locale as Locale)}
      </h1>
      <p className="mt-4 text-body text-muted">
        {localize(program, "summary", locale as Locale)}
      </p>
      <div className="mt-8">
        <TiptapRenderer
          content={localize(program, "content", locale as Locale) as JSONContent}
        />
      </div>
    </div>
  );
}
