import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(
  props: PageProps<"/[locale]/politique-confidentialite">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "PolitiqueConfidentialite" });
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

export default async function PolitiqueConfidentialitePage(
  props: PageProps<"/[locale]/politique-confidentialite">,
) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("PolitiqueConfidentialite");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-20">
      <h1 className="font-display text-h1 text-ink">{t("title")}</h1>

      <div className="mt-8 flex flex-col gap-6 text-body text-ink">
        <section>
          <h2 className="text-base font-semibold text-ink">{t("donneesTitle")}</h2>
          <p className="mt-2 text-muted">{t("donneesBody")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">{t("conservationTitle")}</h2>
          <p className="mt-2 text-muted">{t("conservationBody")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">{t("cookiesTitle")}</h2>
          <p className="mt-2 text-muted">{t("cookiesBody")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">{t("droitsTitle")}</h2>
          <p className="mt-2 text-muted">
            {t("droitsBody")}{" "}
            <Link href="/contact" className="text-accent-deep hover:underline">
              {t("droitsLien")}
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
