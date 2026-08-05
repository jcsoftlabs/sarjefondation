"use client";

import { useEffect } from "react";
import Link from "next/link";

// Filet de secours racine (hors segment [locale]) — ne doit pas dépendre du
// contexte next-intl, contrairement au Header/Footer du site public.
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-4 py-24 text-left md:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-error">
        Une erreur est survenue
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">
        Quelque chose s&rsquo;est mal passé
      </h1>
      <p className="mt-4 text-body text-muted">
        Vous pouvez réessayer, ou revenir à l&rsquo;accueil si le problème
        persiste.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-paper"
        >
          Retour à l&rsquo;accueil
        </Link>
      </div>
    </div>
  );
}
