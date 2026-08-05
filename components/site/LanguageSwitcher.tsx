"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const LABELS: Record<(typeof routing.locales)[number], string> = {
  fr: "FR",
  en: "EN",
};

export function LanguageSwitcher({
  pathname,
  className,
}: {
  pathname: string;
  className?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Nav");

  return (
    <div className={cn("flex items-center gap-1 text-sm", className)} aria-label={t("langue")}>
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-1">
          {index > 0 && <span className="text-line" aria-hidden="true">/</span>}
          <Link
            href={pathname}
            locale={loc}
            className={cn(
              "font-medium",
              loc === locale ? "text-accent-deep" : "text-muted hover:text-ink",
            )}
            aria-current={loc === locale ? "true" : undefined}
          >
            {LABELS[loc]}
          </Link>
        </span>
      ))}
    </div>
  );
}
