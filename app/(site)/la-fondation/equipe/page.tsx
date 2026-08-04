import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Équipe et gouvernance",
  description: "L'équipe et la gouvernance de la Fondation Sarje.",
};

export default function EquipePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        La fondation
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">
        Équipe et gouvernance
      </h1>
      <div className="mt-10 rounded-md border border-dashed border-line p-8 text-center">
        <p className="text-body text-muted">
          Cette page présentera prochainement les membres de l&rsquo;équipe et
          les instances de gouvernance de la fondation.
        </p>
      </div>
    </div>
  );
}
