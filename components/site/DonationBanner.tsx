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
    // Carte flottante décollée des bords (et non barre collée en bas) : le
    // pied de page reste visible autour, le bandeau se lit comme une
    // surcouche temporaire, pas comme un remplacement du footer.
    <div className="fixed bottom-3 left-2 right-2 z-[100] bg-accent px-6 py-4 text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)] lg:bottom-4 lg:left-4 lg:right-4">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border border-white text-white transition-all hover:bg-white hover:text-accent"
        aria-label={t("fermer")}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">

        {/* Left Column */}
        <div className="flex shrink-0 flex-col items-start">
          <span className="font-display text-xl font-bold uppercase leading-none tracking-wide text-white">
            {t("jeSoutiens")}
          </span>
          <span className="mt-1 font-display text-2xl font-bold uppercase leading-tight tracking-wide text-white">
            {t("nomFondation")}
          </span>
        </div>

        {/* Right Column */}
        <div className="flex w-full shrink-0 flex-col md:max-w-xl">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">
            {t("jeFaisUnDon")}
          </h3>
          <div className="mb-3 h-[1px] w-full bg-white/50" />

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/s-impliquer"
              className="bg-accent-deep px-5 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-accent"
            >
              {t("sImpliquer")}
            </Link>
            {amounts.map((amount) => (
              <Link
                key={amount}
                href={`/don?amount=${amount}`}
                className="flex-1 border border-white px-3 py-2 text-center text-sm font-bold transition-colors hover:bg-white hover:text-accent sm:flex-none"
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
