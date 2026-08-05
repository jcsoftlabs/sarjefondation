import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("Footer");

  const legalLinks = [
    { href: "/mentions-legales", label: t("mentionsLegales") },
    { href: "/politique-confidentialite", label: t("politiqueConfidentialite") },
  ] as const;

  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Fondation Sarje. {t("droitsReserves")}
        </p>
        <nav aria-label="Liens légaux" className="flex gap-5">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-accent-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
