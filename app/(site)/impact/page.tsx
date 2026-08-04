import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact",
  description: "Les chiffres d'impact de la Fondation Sarje.",
};

// Chiffres provisoires — à remplacer par les chiffres réels de la fondation
// (plan §10.5) avant la mise en ligne.
const impactStats = [
  { value: "1 240", label: "enfants accompagnés depuis la création de la fondation" },
  { value: "4", label: "programmes actifs sur l'ensemble du territoire" },
  { value: "96%", label: "des fonds directement affectés au terrain" },
];

export default function ImpactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Impact
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">Notre impact</h1>
      <p className="mt-5 max-w-xl text-body text-muted">
        Quelques chiffres qui donnent la mesure de l&rsquo;action de la
        fondation sur le terrain.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {impactStats.map((stat) => (
          <div key={stat.label}>
            <p className="font-display text-h1 text-ink">{stat.value}</p>
            <div className="mt-3 mb-3 h-[3px] w-9 rounded-full bg-accent" />
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-md border border-dashed border-line p-8 text-center">
        <p className="text-body text-muted">
          Témoignages et galerie de terrain à venir, une fois les photos et
          autorisations transmises par la fondation.
        </p>
      </div>
    </div>
  );
}
