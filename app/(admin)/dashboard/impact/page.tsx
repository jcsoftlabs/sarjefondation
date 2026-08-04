import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { moveImpactStat } from "@/lib/actions/impact";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ReorderButtons } from "@/components/admin/ReorderButtons";

export const metadata: Metadata = { title: "Chiffres d'impact", robots: { index: false, follow: false } };

export default async function ImpactAdminPage() {
  await requireAdmin();
  const stats = await prisma.impactStat.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-h2 text-ink">Chiffres d&rsquo;impact</h1>
        <ButtonLink href="/dashboard/impact/nouveau" variant="primary">
          Ajouter un chiffre
        </ButtonLink>
      </div>

      <div className="mt-6">
        {stats.length === 0 && (
          <Card>
            <p className="text-sm text-muted">
              Aucun chiffre pour le moment.{" "}
              <Link
                href="/dashboard/impact/nouveau"
                className="text-accent-deep hover:underline"
              >
                Ajouter le premier chiffre
              </Link>
              .
            </p>
          </Card>
        )}

        {stats.length > 0 && (
          <Card className="p-0">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className="flex items-center gap-4 border-b border-line px-5 py-3 last:border-b-0"
              >
                <ReorderButtons
                  id={stat.id}
                  isFirst={index === 0}
                  isLast={index === stats.length - 1}
                  move={moveImpactStat}
                />
                <Link href={`/dashboard/impact/${stat.id}`} className="flex-1">
                  <span className="font-display text-base text-ink hover:text-accent-deep">
                    {stat.value}
                  </span>
                  <span className="ml-2 text-xs text-muted">{stat.label}</span>
                </Link>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
