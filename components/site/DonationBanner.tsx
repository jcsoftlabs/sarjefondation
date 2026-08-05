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
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-accent text-white shadow-[0_-6px_24px_rgba(0,0,0,0.25)]">
      {/* Close button — top-right corner always */}
      <button
        onClick={handleClose}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/40 text-white/80 transition-all hover:border-white hover:text-white"
        aria-label="Fermer le bandeau de don"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Desktop layout — single row */}
      <div className="hidden md:flex items-center justify-between gap-6 px-8 py-4 pr-14">
        {/* Left */}
        <div className="shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">JE SOUTIENS</p>
          <p className="font-display text-base font-extrabold uppercase leading-tight tracking-wide">
            LA FONDATION SARJE
          </p>
        </div>

        {/* Divider */}
        <div className="h-10 w-px shrink-0 bg-white/30" />

        {/* CTA */}
        <Link
          href="/don"
          className="shrink-0 bg-accent-deep px-5 py-2 text-xs font-extrabold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-accent"
        >
          FAIRE UN DON
        </Link>

        {/* Divider */}
        <div className="h-10 w-px shrink-0 bg-white/30" />

        {/* Right */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/80">JE FAIS UN DON</p>
          <div className="flex flex-wrap gap-2">
            {amounts.map((amount) => (
              <Link
                key={amount}
                href={`/don?amount=${amount}`}
                className="border border-white/50 px-4 py-1.5 text-sm font-bold transition-colors hover:bg-white hover:text-accent"
              >
                {amount} $
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile layout — stacked */}
      <div className="flex flex-col gap-3 px-4 py-4 pr-12 md:hidden">
        {/* Top row: label + CTA */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/80">JE SOUTIENS</p>
            <p className="font-display text-sm font-extrabold uppercase leading-tight">
              LA FONDATION SARJE
            </p>
          </div>
          <Link
            href="/don"
            className="shrink-0 bg-accent-deep px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-accent"
          >
            FAIRE UN DON
          </Link>
        </div>

        {/* Bottom row: amounts */}
        <div>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-white/80">JE FAIS UN DON</p>
          <div className="flex flex-wrap gap-2">
            {amounts.map((amount) => (
              <Link
                key={amount}
                href={`/don?amount=${amount}`}
                className="border border-white/50 px-3 py-1 text-sm font-bold transition-colors hover:bg-white hover:text-accent"
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

