import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";

export async function generateMetadata(
  props: PageProps<"/[locale]/la-fondation">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "LaFondation" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function LaFondationPage(
  props: PageProps<"/[locale]/la-fondation">,
) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("LaFondation");

  const values = [
    { title: t("valeurProximiteTitle"), body: t("valeurProximiteBody") },
    { title: t("valeurTransparenceTitle"), body: t("valeurTransparenceBody") },
    { title: t("valeurDureeTitle"), body: t("valeurDureeBody") },
    { title: t("valeurDigniteTitle"), body: t("valeurDigniteBody") },
  ];

  return (
    <div>
      <section className="bg-accent-soft py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-deep">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 font-display text-h1 text-ink">{t("missionTitle")}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/80">{t("missionBody")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
          <Image
            src="https://res.cloudinary.com/tdqpx8gd/image/upload/v1785883249/sarje-fondation/foundation_history.jpg"
            alt="Équipe médicale avec un enfant"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
        </div>

        <h2 className="mt-16 text-center font-display text-h2 text-ink">{t("histoireTitle")}</h2>
        <div className="mx-auto mt-8 max-w-3xl space-y-6 text-body leading-relaxed text-muted">
          <p>{t("histoireBody1")}</p>
          <p>{t("histoireBody2")}</p>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <h2 className="text-center font-display text-h2 text-ink">{t("valeursTitle")}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <Card key={value.title} className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <h3 className="font-display text-lg text-ink transition-colors group-hover:text-accent-deep">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{value.body}</p>
              </Card>
            ))}
          </div>

          <div className="mx-auto mt-16 relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="https://res.cloudinary.com/tdqpx8gd/image/upload/v1785883256/sarje-fondation/foundation_values.jpg"
              alt="Réunion communautaire"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 800px"
            />
          </div>

          <div className="mt-16 flex justify-center">
            <Link
              href="/la-fondation/equipe"
              className="inline-block rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-ink shadow-sm transition-all hover:scale-105 hover:border-accent hover:text-accent-deep hover:shadow-md"
            >
              {t("equipeCta")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
