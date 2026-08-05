import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ButtonLink } from "@/components/site/ButtonLink";
import { Card } from "@/components/ui/Card";

export async function generateMetadata(
  props: PageProps<"/[locale]/s-impliquer">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "SImpliquer" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function SImpliquerPage(
  props: PageProps<"/[locale]/s-impliquer">,
) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("SImpliquer");

  const ways = [
    { title: t("donTitle"), body: t("donBody"), href: "/don" as const, cta: t("donCta") },
    {
      title: t("benevolatTitle"),
      body: t("benevolatBody"),
      href: "/contact" as const,
      cta: t("benevolatCta"),
    },
    {
      title: t("partenariatTitle"),
      body: t("partenariatBody"),
      href: "/contact" as const,
      cta: t("partenariatCta"),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">{t("title")}</h1>
      <p className="mt-5 max-w-xl text-body text-muted">{t("intro")}</p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {ways.map((way) => (
          <Card key={way.title} className="flex flex-col">
            <h2 className="font-display text-h3 text-ink">{way.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted">{way.body}</p>
            <ButtonLink href={way.href} variant="secondary" className="mt-4">
              {way.cta}
            </ButtonLink>
          </Card>
        ))}
      </div>
    </div>
  );
}
