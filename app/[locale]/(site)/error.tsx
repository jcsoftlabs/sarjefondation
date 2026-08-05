"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/site/ButtonLink";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("SiteError");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-4 py-24 text-left md:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-error">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">{t("title")}</h1>
      <p className="mt-4 text-body text-muted">{t("body")}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button variant="primary" onClick={reset}>
          {t("reessayer")}
        </Button>
        <ButtonLink href="/" variant="secondary">
          {t("accueil")}
        </ButtonLink>
      </div>
    </div>
  );
}
