"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function DonationBanner() {
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
    <div className="fixed bottom-0 left-0 z-50 w-full bg-accent text-white shadow-[0_-4px_15px_rgba(0,0,0,0.2)]">
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row md:px-6 lg:gap-8">
        
        {/* Left Section */}
        <div className="flex-1 shrink-0 text-center md:text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/90">
            JE SOUTIENS
          </p>
          <p className="font-display text-base font-bold leading-tight sm:text-lg uppercase">
            LA FONDATION SARJE
          </p>
        </div>

        {/* Center / Actions */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/don"
            className="whitespace-nowrap bg-accent-deep px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent"
          >
            FAIRE UN DON
          </Link>
          
          <div className="hidden h-10 w-px bg-white/30 md:block" />

          {/* Right Section */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/90">
              JE FAIS UN DON
            </p>
            <div className="flex flex-wrap justify-center gap-2 border-t border-white/30 pt-2 sm:border-none sm:pt-0">
              {amounts.map((amount) => (
                <Link
                  key={amount}
                  href={`/don?amount=${amount}`}
                  className="border border-white/60 px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white hover:text-accent"
                >
                  {amount} $
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 p-2 text-white/80 transition-transform hover:scale-110 hover:text-white md:static md:p-0"
          aria-label="Fermer le bandeau de don"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
