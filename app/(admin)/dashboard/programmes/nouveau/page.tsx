import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createProgram } from "@/lib/actions/programs";
import { ProgramForm } from "@/components/admin/ProgramForm";

export const metadata: Metadata = { title: "Nouveau programme", robots: { index: false, follow: false } };

export default async function NewProgramPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="font-display text-h2 text-ink">Nouveau programme</h1>
      <div className="mt-6 max-w-2xl">
        <ProgramForm mode="create" action={createProgram} />
      </div>
    </div>
  );
}
