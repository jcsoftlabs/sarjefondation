"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/site/ButtonLink";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";

export function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/la-fondation", label: t("laFondation") },
    { href: "/programmes", label: t("programmes") },
    { href: "/impact", label: t("impact") },
    { href: "/actualites", label: t("actualites") },
    { href: "/s-impliquer", label: t("sImpliquer") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <Image
            src="/logo-fondation.png"
            alt="Fondation Sarje"
            width={84}
            height={84}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink hover:text-accent-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher pathname={pathname} className="hidden md:flex" />

          <ButtonLink
            href="/don"
            variant="primary"
            className="px-4 py-2 text-sm"
          >
            {t("faireUnDon")}
          </ButtonLink>

          <button
            type="button"
            className="flex items-center justify-center rounded-sm border border-line p-2 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t("fermerMenu") : t("ouvrirMenu")}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="sr-only">{menuOpen ? t("fermerMenu") : t("ouvrirMenu")}</span>
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              aria-hidden="true"
              className="text-ink"
            >
              {menuOpen ? (
                <path
                  d="M4 4l14 14M18 4L4 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h16M3 11h16M3 16h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Navigation mobile"
        className={cn(
          "border-t border-line px-4 py-3 md:hidden",
          menuOpen ? "flex flex-col gap-3" : "hidden",
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="py-1.5 text-sm font-medium text-ink hover:text-accent-deep"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <LanguageSwitcher pathname={pathname} className="mt-2 border-t border-line pt-3" />
      </nav>
    </header>
  );
}
