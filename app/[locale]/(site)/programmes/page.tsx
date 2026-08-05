import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/localize";

export async function generateMetadata(
  props: PageProps<"/[locale]/programmes">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Programmes" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ProgrammesPage(
  props: PageProps<"/[locale]/programmes">,
) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Programmes");

  const programs = await prisma.program.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">{t("title")}</h1>
      <p className="mt-5 max-w-xl text-body text-muted">{t("intro")}</p>

      {programs.length === 0 ? (
        <p className="mt-10 text-body text-muted">{t("empty")}</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {programs.map((program) => (
            <Card key={program.slug} className="group flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <h2 className="font-display text-h3 text-ink group-hover:text-accent-deep transition-colors">
                {localize(program, "title", locale as Locale)}
              </h2>
              <p className="mt-2 flex-1 text-sm text-muted">
                {localize(program, "summary", locale as Locale)}
              </p>
              <Link
                href={`/programmes/${program.slug}`}
                className="mt-4 text-sm font-medium text-accent-deep hover:underline"
              >
                {t("enSavoirPlus")}
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
