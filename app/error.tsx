"use client";

import { useEffect } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";

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
    <>
      <Header />
      <main className="flex-1">
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
            <Button variant="primary" onClick={reset}>
              Réessayer
            </Button>
            <ButtonLink href="/" variant="secondary">
              Retour à l&rsquo;accueil
            </ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
