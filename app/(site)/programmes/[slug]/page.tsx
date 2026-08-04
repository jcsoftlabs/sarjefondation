import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { JSONContent } from "@tiptap/react";
import { prisma } from "@/lib/db";
import { TiptapRenderer } from "@/components/TiptapRenderer";

export async function generateStaticParams() {
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata(
  props: PageProps<"/programmes/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const program = await prisma.program.findUnique({ where: { slug } });
  if (!program || !program.isActive) return {};
  return { title: program.title, description: program.summary };
}

export default async function ProgramDetailPage(
  props: PageProps<"/programmes/[slug]">,
) {
  const { slug } = await props.params;
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
        ← Tous les programmes
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
      <h1 className="mt-6 font-display text-h1 text-ink">{program.title}</h1>
      <p className="mt-4 text-body text-muted">{program.summary}</p>
      <div className="mt-8">
        <TiptapRenderer content={program.content as JSONContent} />
      </div>
    </div>
  );
}
