import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "next-intl";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/localize";

export async function generateMetadata(
  props: PageProps<"/[locale]/la-fondation/equipe">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Equipe" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function EquipePage(
  props: PageProps<"/[locale]/la-fondation/equipe">,
) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Equipe");

  const members = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
    include: { photo: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">{t("title")}</h1>

      {members.length === 0 ? (
        <div className="mt-10 rounded-md border border-dashed border-line p-8 text-center">
          <p className="text-body text-muted">{t("empty")}</p>
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
                <p className="text-sm text-accent-deep">
                  {localize(member, "role", locale as Locale)}
                </p>
                {member.bio && (
                  <p className="mt-2 text-sm text-muted">
                    {localize(member, "bio", locale as Locale)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
