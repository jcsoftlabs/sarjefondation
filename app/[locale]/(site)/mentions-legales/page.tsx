import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(
  props: PageProps<"/[locale]/mentions-legales">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "MentionsLegales" });
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

export default async function MentionsLegalesPage(
  props: PageProps<"/[locale]/mentions-legales">,
) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("MentionsLegales");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-20">
      <h1 className="font-display text-h1 text-ink">{t("title")}</h1>

      <div className="mt-8 flex flex-col gap-6 text-body text-ink">
        <section>
          <h2 className="text-base font-semibold text-ink">{t("editeurTitle")}</h2>
          <p className="mt-2 text-muted">
            {t("editeurBody")}
            <br />
            <span className="text-xs italic">{t("editeurACompleter")}</span>
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">{t("responsableTitle")}</h2>
          <p className="mt-2 text-muted italic">{t("responsableACompleter")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">{t("hebergementTitle")}</h2>
          <p className="mt-2 text-muted">{t("hebergementBody")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">{t("propriétéTitle")}</h2>
          <p className="mt-2 text-muted">{t("propriétéBody")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">{t("contactTitle")}</h2>
          <p className="mt-2 text-muted">
            {t("contactBody")}{" "}
            <Link href="/contact" className="text-accent-deep hover:underline">
              {t("contactLien")}
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
