import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateTeamMember } from "@/lib/actions/team";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export const metadata: Metadata = { title: "Modifier le membre", robots: { index: false, follow: false } };

export default async function EditTeamMemberPage(
  props: PageProps<"/dashboard/equipe/[id]">,
) {
  await requireAdmin();
  const { id } = await props.params;

  const member = await prisma.teamMember.findUnique({ where: { id }, include: { photo: true } });
  if (!member) notFound();

  return (
    <div>
      <h1 className="font-display text-h2 text-ink">{member.name}</h1>
      <div className="mt-6 max-w-2xl">
        <TeamMemberForm
          mode="edit"
          action={updateTeamMember.bind(null, id)}
          member={{
            id: member.id,
            name: member.name,
            role: member.role,
            bio: member.bio,
            photo: member.photo
              ? { id: member.photo.id, url: member.photo.url, alt: member.photo.alt }
              : null,
          }}
        />
      </div>
    </div>
  );
}
