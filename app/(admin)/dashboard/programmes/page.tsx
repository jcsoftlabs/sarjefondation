import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { moveProgram } from "@/lib/actions/programs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ReorderButtons } from "@/components/admin/ReorderButtons";

export const metadata: Metadata = { title: "Programmes", robots: { index: false, follow: false } };

export default async function ProgrammesAdminPage() {
  await requireAdmin();
  const programs = await prisma.program.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-h2 text-ink">Programmes</h1>
        <ButtonLink href="/dashboard/programmes/nouveau" variant="primary">
          Nouveau programme
        </ButtonLink>
      </div>

      <div className="mt-6">
        {programs.length === 0 && (
          <Card>
            <p className="text-sm text-muted">
              Aucun programme pour le moment.{" "}
              <Link
                href="/dashboard/programmes/nouveau"
                className="text-accent-deep hover:underline"
              >
                Créer le premier programme
              </Link>
              .
            </p>
          </Card>
        )}

        {programs.length > 0 && (
          <Card className="p-0">
            {programs.map((program, index) => (
              <div
                key={program.id}
                className="flex items-center gap-4 border-b border-line px-5 py-3 last:border-b-0"
              >
                <ReorderButtons
                  id={program.id}
                  isFirst={index === 0}
                  isLast={index === programs.length - 1}
                  move={moveProgram}
                />
                <Link
                  href={`/dashboard/programmes/${program.id}`}
                  className="flex-1 text-sm font-medium text-ink hover:text-accent-deep"
                >
                  {program.title}
                </Link>
                <Badge variant={program.isActive ? "success" : "neutral"}>
                  {program.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
