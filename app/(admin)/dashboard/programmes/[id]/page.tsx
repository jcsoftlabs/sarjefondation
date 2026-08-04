import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateProgram } from "@/lib/actions/programs";
import { ProgramForm } from "@/components/admin/ProgramForm";

export const metadata: Metadata = { title: "Modifier le programme", robots: { index: false, follow: false } };

export default async function EditProgramPage(
  props: PageProps<"/dashboard/programmes/[id]">,
) {
  await requireAdmin();
  const { id } = await props.params;

  const program = await prisma.program.findUnique({ where: { id }, include: { cover: true } });
  if (!program) notFound();

  return (
    <div>
      <h1 className="font-display text-h2 text-ink">{program.title}</h1>
      <div className="mt-6 max-w-2xl">
        <ProgramForm
          mode="edit"
          action={updateProgram.bind(null, id)}
          program={{
            id: program.id,
            title: program.title,
            slug: program.slug,
            summary: program.summary,
            content: program.content as JSONContent,
            isActive: program.isActive,
            cover: program.cover
              ? { id: program.cover.id, url: program.cover.url, alt: program.cover.alt }
              : null,
          }}
        />
      </div>
    </div>
  );
}
