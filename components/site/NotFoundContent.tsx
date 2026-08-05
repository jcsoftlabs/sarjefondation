import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/site/ButtonLink";

export function NotFoundContent() {
  const t = useTranslations("NotFound");

  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-4 py-24 text-left md:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">{t("title")}</h1>
      <p className="mt-4 text-body text-muted">{t("body")}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <ButtonLink href="/" variant="primary">
          {t("accueil")}
        </ButtonLink>
        <ButtonLink href="/programmes" variant="secondary">
          {t("programmes")}
        </ButtonLink>
      </div>
    </div>
  );
}
