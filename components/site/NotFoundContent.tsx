import { ButtonLink } from "@/components/ui/ButtonLink";

export function NotFoundContent() {
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
        Vous pouvez retourner à l&rsquo;accueil ou consulter nos programmes.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <ButtonLink href="/" variant="primary">
          Retour à l&rsquo;accueil
        </ButtonLink>
        <ButtonLink href="/programmes" variant="secondary">
          Voir les programmes
        </ButtonLink>
      </div>
    </div>
  );
}
