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

export default async function ProgramPreviewPage(
  props: PageProps<"/dashboard/programmes/[id]/apercu">,
) {
  await requireAdmin();
  const { id } = await props.params;

  const program = await prisma.program.findUnique({ where: { id }, include: { cover: true } });
  if (!program) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/dashboard/programmes/${program.id}`}
          className="text-sm font-medium text-accent-deep hover:underline"
        >
          ← Retour à l&rsquo;édition
        </Link>
        <Badge variant={program.isActive ? "success" : "neutral"}>
          {program.isActive ? "Actif" : "Inactif"}
        </Badge>
      </div>

      {program.cover && (
        <Image
          src={program.cover.url}
          alt={program.cover.alt}
          width={800}
          height={450}
          className="mt-6 w-full rounded-md object-cover"
          style={{ aspectRatio: "16 / 9" }}
        />
      )}
      <h1 className="mt-6 font-display text-h1 text-ink">{program.title}</h1>
      <p className="mt-3 text-body text-muted">{program.summary}</p>
      <div className="mt-8">
        <TiptapRenderer content={program.content as JSONContent} />
      </div>
    </div>
  );
}
