import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Équipe et gouvernance",
  description: "L'équipe et la gouvernance de la Fondation Sarje.",
};

export default async function EquipePage() {
  const members = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
    include: { photo: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        La fondation
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">
        Équipe et gouvernance
      </h1>

      {members.length === 0 ? (
        <div className="mt-10 rounded-md border border-dashed border-line p-8 text-center">
          <p className="text-body text-muted">
            Cette page présentera prochainement les membres de l&rsquo;équipe et
            les instances de gouvernance de la fondation.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {members.map((member) => (
            <div key={member.id} className="flex gap-4">
              {member.photo ? (
                <Image
                  src={member.photo.url}
                  alt={member.photo.alt}
                  width={72}
                  height={72}
                  className="h-18 w-18 shrink-0 rounded-full border border-line object-cover"
                />
              ) : (
                <span className="h-18 w-18 shrink-0 rounded-full border border-line bg-line/30" />
              )}
              <div>
                <p className="text-base font-semibold text-ink">{member.name}</p>
                <p className="text-sm text-accent-deep">{member.role}</p>
                {member.bio && (
                  <p className="mt-2 text-sm text-muted">{member.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
