"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function DonationBanner() {
  const t = useTranslations("DonationBanner");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const closed = sessionStorage.getItem("donation-banner-closed");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lu depuis sessionStorage, indisponible au premier rendu serveur
    setIsVisible(!closed);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("donation-banner-closed", "true");
  };

  if (!isVisible) return null;

  const amounts = [50, 100, 250, 500, 1000];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-accent text-white shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-white text-white transition-all hover:bg-white hover:text-accent"
        aria-label={t("fermer")}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-8 px-6 py-8 md:flex-row md:items-start md:px-12 md:py-10">

        {/* Left Column */}
        <div className="flex flex-col items-start gap-6 md:w-1/2">
          <div>
            <h2 className="font-display text-2xl font-extrabold uppercase leading-tight tracking-wide md:text-3xl lg:text-4xl">
              <span className="block text-white">{t("jeSoutiens")}</span>
              <span className="block text-white">{t("nomFondation")}</span>
            </h2>
          </div>
          <Link
            href="/s-impliquer"
            className="inline-block bg-accent-deep px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-accent"
          >
            {t("sImpliquer")}
          </Link>
        </div>

        {/* Right Column */}
        <div className="flex flex-col md:w-1/2 md:max-w-md">
          <h3 className="text-xl font-bold uppercase tracking-wide text-white">
            {t("jeFaisUnDon")}
          </h3>
          <div className="my-4 h-px w-full bg-white/40" />

          <div className="flex flex-wrap gap-3">
            {amounts.map((amount) => (
              <Link
                key={amount}
                href={`/don?amount=${amount}`}
                className="flex flex-1 items-center justify-center border border-white px-4 py-3 text-sm font-bold transition-colors hover:bg-white hover:text-accent sm:flex-none"
              >
                {amount} $
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
