import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "La fondation",
  description:
    "Mission, valeurs et histoire de la Fondation Sarje, active auprès des familles vulnérables en Haïti.",
};

const values = [
  {
    title: "Proximité",
    body: "Nos équipes vivent et travaillent dans les communautés qu'elles accompagnent, pas à distance depuis un bureau.",
  },
  {
    title: "Transparence",
    body: "Chaque don est tracé et rendu compte, aux familles accompagnées comme aux partenaires qui nous font confiance.",
  },
  {
    title: "Durée",
    body: "Un enfant accompagné l'est sur plusieurs années, pas au coup par coup au gré des financements ponctuels.",
  },
  {
    title: "Dignité",
    body: "L'aide se construit avec les familles, jamais à leur place. Elles restent actrices de leurs choix.",
  },
];

export default function LaFondationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        La fondation
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">Notre mission</h1>
      <p className="mt-5 text-body text-muted">
        La Fondation Sarje agit auprès des familles vulnérables en Haïti pour
        que chaque enfant ait accès à l&rsquo;éducation, aux soins et à un
        environnement stable, quelle que soit sa situation de départ. Nous
        croyons qu&rsquo;un accompagnement de proximité, mené dans la durée,
        change durablement une trajectoire de vie.
      </p>

      <h2 className="mt-14 font-display text-h2 text-ink">Notre histoire</h2>
      <p className="mt-4 text-body text-muted">
        Née d&rsquo;un constat simple — trop d&rsquo;enfants quittent l&rsquo;école
        ou n&rsquo;accèdent pas aux soins faute de moyens — la fondation a
        d&rsquo;abord soutenu quelques familles avant de structurer ses actions
        autour de programmes dédiés à l&rsquo;éducation, à la santé et à
        l&rsquo;accompagnement communautaire. Elle s&rsquo;appuie aujourd&rsquo;hui
        sur des équipes locales, ancrées dans les communautés qu&rsquo;elles
        servent.
      </p>

      <h2 className="mt-14 font-display text-h2 text-ink">Nos valeurs</h2>
      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        {values.map((value) => (
          <div key={value.title}>
            <h3 className="text-base font-semibold text-ink">{value.title}</h3>
            <p className="mt-2 text-sm text-muted">{value.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 border-t border-line pt-8">
        <Link
          href="/la-fondation/equipe"
          className="text-sm font-medium text-accent-deep hover:underline"
        >
          Découvrir l&rsquo;équipe et la gouvernance →
        </Link>
      </div>
    </div>
  );
}
