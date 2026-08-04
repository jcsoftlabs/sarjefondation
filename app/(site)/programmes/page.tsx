import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Les programmes de la Fondation Sarje : éducation, santé, accompagnement communautaire et engagement sur le terrain.",
};

export default async function ProgrammesPage() {
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Programmes
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">Nos programmes</h1>
      <p className="mt-5 max-w-xl text-body text-muted">
        Des axes d&rsquo;action pensés pour se compléter et accompagner chaque
        enfant dans la durée.
      </p>

      {programs.length === 0 ? (
        <p className="mt-10 text-body text-muted">
          Les programmes de la fondation seront présentés ici prochainement.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {programs.map((program) => (
            <Card key={program.slug} className="flex flex-col">
              <h2 className="font-display text-h3 text-ink">{program.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted">{program.summary}</p>
              <Link
                href={`/programmes/${program.slug}`}
                className="mt-4 text-sm font-medium text-accent-deep hover:underline"
              >
                En savoir plus
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
