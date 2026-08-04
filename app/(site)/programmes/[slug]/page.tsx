import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProgramBySlug, programs } from "@/lib/content/programs";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata(
  props: PageProps<"/programmes/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const program = getProgramBySlug(slug);
  if (!program) return {};
  return { title: program.title, description: program.summary };
}

export default async function ProgramDetailPage(
  props: PageProps<"/programmes/[slug]">,
) {
  const { slug } = await props.params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <Link
        href="/programmes"
        className="text-sm font-medium text-accent-deep hover:underline"
      >
        ← Tous les programmes
      </Link>
      <h1 className="mt-4 font-display text-h1 text-ink">{program.title}</h1>
      <p className="mt-4 text-body text-muted">{program.summary}</p>
      <div className="mt-8 flex flex-col gap-4">
        {program.body.map((paragraph, index) => (
          <p key={index} className="text-body text-ink">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
