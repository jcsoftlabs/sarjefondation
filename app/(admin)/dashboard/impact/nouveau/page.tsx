import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createImpactStat } from "@/lib/actions/impact";
import { ImpactStatForm } from "@/components/admin/ImpactStatForm";

export const metadata: Metadata = { title: "Ajouter un chiffre", robots: { index: false, follow: false } };

export default async function NewImpactStatPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="font-display text-h2 text-ink">Ajouter un chiffre d&rsquo;impact</h1>
      <div className="mt-6 max-w-md">
        <ImpactStatForm mode="create" action={createImpactStat} />
      </div>
    </div>
  );
}
