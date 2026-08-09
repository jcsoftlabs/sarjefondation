import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSettings } from "@/lib/actions/settings";

const socialIcons = {
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  twitter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
} as const;

export async function Footer() {
  const t = await getTranslations("Footer");
  const settings = await getSettings();

  const socials = [
    { key: "facebook", url: settings.socialFacebook, label: "Facebook" },
    { key: "instagram", url: settings.socialInstagram, label: "Instagram" },
    { key: "twitter", url: settings.socialTwitter, label: "X (Twitter)" },
    { key: "linkedin", url: settings.socialLinkedin, label: "LinkedIn" },
  ].filter((s): s is typeof s & { url: string } => Boolean(s.url));

  const discoverLinks = [
    { href: "/la-fondation", label: t("laFondation") },
    { href: "/programmes", label: t("programmes") },
    { href: "/impact", label: t("impact") },
    { href: "/actualites", label: t("actualites") },
  ] as const;

  const actLinks = [
    { href: "/don", label: t("faireUnDon") },
    { href: "/s-impliquer", label: t("sImpliquer") },
    { href: "/contact", label: t("nousEcrire") },
  ] as const;

  const hasContactInfo = Boolean(
    settings.contactEmail || settings.contactPhone || settings.contactAddress,
  );

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {/* Identité */}
        <div>
          <Link href="/" className="inline-block">
            <Image
              src="/logo-fondation.png"
              alt="Fondation Sarje"
              width={64}
              height={64}
              className="rounded-sm bg-white/90 p-1"
            />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{t("tagline")}</p>
          {socials.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
                {t("suivezNous")}
              </p>
              <div className="mt-2 flex gap-3">
                {socials.map((social) => (
                  <a
                    key={social.key}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-accent hover:text-accent"
                  >
                    {socialIcons[social.key as keyof typeof socialIcons]}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Découvrir */}
        <nav aria-label={t("decouvrirTitle")}>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
            {t("decouvrirTitle")}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {discoverLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Agir */}
        <nav aria-label={t("agirTitle")}>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
            {t("agirTitle")}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {actLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        {hasContactInfo && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
              {t("contactTitle")}
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
              {settings.contactEmail && (
                <li>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="transition-colors hover:text-accent"
                  >
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings.contactPhone && (
                <li>
                  <a
                    href={`tel:${settings.contactPhone.replace(/[^+\d]/g, "")}`}
                    className="transition-colors hover:text-accent"
                  >
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings.contactAddress && (
                <li className="whitespace-pre-line text-white/70">{settings.contactAddress}</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Ligne légale */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-5 text-sm text-white/50 md:flex-row md:items-center md:justify-between md:px-6">
          <p>
            © {new Date().getFullYear()} Fondation Sarje. {t("droitsReserves")}
          </p>
          <nav aria-label="Liens légaux" className="flex gap-5">
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-accent"
            >
              {t("mentionsLegales")}
            </Link>
            <Link
              href="/politique-confidentialite"
              className="transition-colors hover:text-accent"
            >
              {t("politiqueConfidentialite")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
