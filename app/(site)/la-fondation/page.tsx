import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

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
    <div>
      <section className="bg-accent-soft py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-deep">
            La fondation
          </p>
          <h1 className="mt-3 font-display text-h1 text-ink">Notre mission</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/80">
            La Fondation Sarje agit auprès des familles vulnérables en Haïti pour
            que chaque enfant ait accès à l&rsquo;éducation, aux soins et à un
            environnement stable, quelle que soit sa situation de départ. Nous
            croyons qu&rsquo;un accompagnement de proximité, mené dans la durée,
            change durablement une trajectoire de vie.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
          <Image
            src="https://res.cloudinary.com/tdqpx8gd/image/upload/v1785883249/sarje-fondation/foundation_history.jpg"
            alt="Équipe médicale avec un enfant"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
        </div>

        <h2 className="mt-16 text-center font-display text-h2 text-ink">Notre histoire</h2>
        <div className="mx-auto mt-8 max-w-3xl space-y-6 text-body leading-relaxed text-muted">
          <p>
            Née d&rsquo;un constat simple — trop d&rsquo;enfants quittent l&rsquo;école
            ou n&rsquo;accèdent pas aux soins faute de moyens — la fondation a
            d&rsquo;abord soutenu quelques familles avant de structurer ses actions
            autour de programmes dédiés à l&rsquo;éducation, à la santé et à
            l&rsquo;accompagnement communautaire.
          </p>
          <p>
            Elle s&rsquo;appuie aujourd&rsquo;hui
            sur des équipes locales, ancrées dans les communautés qu&rsquo;elles
            servent.
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <h2 className="text-center font-display text-h2 text-ink">Nos valeurs</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <Card key={value.title} className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <h3 className="font-display text-lg text-ink transition-colors group-hover:text-accent-deep">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{value.body}</p>
              </Card>
            ))}
          </div>

          <div className="mx-auto mt-16 relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="https://res.cloudinary.com/tdqpx8gd/image/upload/v1785883256/sarje-fondation/foundation_values.jpg"
              alt="Réunion communautaire"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 800px"
            />
          </div>

          <div className="mt-16 flex justify-center">
            <Link
              href="/la-fondation/equipe"
              className="inline-block rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-ink shadow-sm transition-all hover:scale-105 hover:border-accent hover:text-accent-deep hover:shadow-md"
            >
              Découvrir l&rsquo;équipe et la gouvernance →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
