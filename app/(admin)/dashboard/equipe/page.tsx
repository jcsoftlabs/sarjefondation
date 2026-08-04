import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { moveTeamMember } from "@/lib/actions/team";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ReorderButtons } from "@/components/admin/ReorderButtons";

export const metadata: Metadata = { title: "Équipe", robots: { index: false, follow: false } };

export default async function EquipeAdminPage() {
  await requireAdmin();
  const members = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
    include: { photo: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-h2 text-ink">Équipe</h1>
        <ButtonLink href="/dashboard/equipe/nouveau" variant="primary">
          Ajouter un membre
        </ButtonLink>
      </div>

      <div className="mt-6">
        {members.length === 0 && (
          <Card>
            <p className="text-sm text-muted">
              Personne n&rsquo;a encore été ajouté.{" "}
              <Link
                href="/dashboard/equipe/nouveau"
                className="text-accent-deep hover:underline"
              >
                Ajouter le premier membre
              </Link>
              .
            </p>
          </Card>
        )}

        {members.length > 0 && (
          <Card className="p-0">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="flex items-center gap-4 border-b border-line px-5 py-3 last:border-b-0"
              >
                <ReorderButtons
                  id={member.id}
                  isFirst={index === 0}
                  isLast={index === members.length - 1}
                  move={moveTeamMember}
                />
                {member.photo ? (
                  <Image
                    src={member.photo.url}
                    alt={member.photo.alt}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border border-line object-cover"
                  />
                ) : (
                  <span className="h-10 w-10 rounded-full border border-line bg-line/30" />
                )}
                <Link
                  href={`/dashboard/equipe/${member.id}`}
                  className="flex-1"
                >
                  <p className="text-sm font-medium text-ink hover:text-accent-deep">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted">{member.role}</p>
                </Link>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
