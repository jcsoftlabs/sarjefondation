import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateImpactStat } from "@/lib/actions/impact";
import { ImpactStatForm } from "@/components/admin/ImpactStatForm";

export const metadata: Metadata = { title: "Modifier le chiffre", robots: { index: false, follow: false } };

export default async function EditImpactStatPage(
  props: PageProps<"/dashboard/impact/[id]">,
) {
  await requireAdmin();
  const { id } = await props.params;

  const stat = await prisma.impactStat.findUnique({ where: { id } });
  if (!stat) notFound();

  return (
    <div>
      <h1 className="font-display text-h2 text-ink">Modifier le chiffre</h1>
      <div className="mt-6 max-w-md">
        <ImpactStatForm
          mode="edit"
          action={updateImpactStat.bind(null, id)}
          stat={{ id: stat.id, label: stat.label, labelEn: stat.labelEn, value: stat.value }}
        />
      </div>
    </div>
  );
}
