import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createTeamMember } from "@/lib/actions/team";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export const metadata: Metadata = { title: "Ajouter un membre", robots: { index: false, follow: false } };

export default async function NewTeamMemberPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="font-display text-h2 text-ink">Ajouter un membre</h1>
      <div className="mt-6 max-w-2xl">
        <TeamMemberForm mode="create" action={createTeamMember} />
      </div>
    </div>
  );
}
