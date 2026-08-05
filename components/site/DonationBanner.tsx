"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function DonationBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const closed = sessionStorage.getItem("donation-banner-closed");
    setIsVisible(!closed);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("donation-banner-closed", "true");
  };

  if (!isVisible) return null;

  const amounts = [50, 100, 250, 500, 1000];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-accent text-white shadow-[0_-10px_30px_rgba(0,0,0,0.3)] px-6 py-4">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border border-white text-white transition-all hover:bg-white hover:text-accent"
        aria-label="Fermer le bandeau"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        
        {/* Left Column */}
        <div className="flex flex-col items-start shrink-0">
          <span className="font-display text-xl font-bold uppercase leading-none tracking-wide text-white">JE SOUTIENS</span>
          <span className="font-display text-2xl font-bold uppercase leading-tight tracking-wide text-white mt-1">LA FONDATION SARJE</span>
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-full md:max-w-xl shrink-0">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-2">
            JE FAIS UN DON
          </h3>
          <div className="h-[1px] w-full bg-white/50 mb-3" />
          
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/s-impliquer"
              className="bg-accent-deep px-5 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-accent"
            >
              S'IMPLIQUER
            </Link>
            {amounts.map((amount) => (
              <Link
                key={amount}
                href={`/don?amount=${amount}`}
                className="flex-1 text-center border border-white px-3 py-2 text-sm font-bold transition-colors hover:bg-white hover:text-accent sm:flex-none"
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
