import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable",
};

// Filet de secours pour les chemins qui ne correspondent à aucune route, y
// compris hors du segment [locale] (ex. fichiers, chemins mal formés) — ne
// doit donc pas dépendre du contexte next-intl (Header/Footer en dépendent).
export default function RootNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-4 py-24 text-left md:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Erreur 404
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">
        Cette page n&rsquo;existe pas
      </h1>
      <p className="mt-4 text-body text-muted">
        Le lien suivi est peut-être incorrect, ou la page a été déplacée.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep"
        >
          Retour à l&rsquo;accueil
        </Link>
      </div>
    </div>
  );
}
