import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DonationForm } from "@/components/site/DonationForm";

export async function generateMetadata(
  props: PageProps<"/[locale]/don">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Don" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function DonPage(props: PageProps<"/[locale]/don">) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("Don");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">{t("title")}</h1>
      <p className="mt-5 text-body text-muted">{t("intro")}</p>

      <div className="mt-10">
        <DonationForm />
      </div>
    </div>
  );
}
