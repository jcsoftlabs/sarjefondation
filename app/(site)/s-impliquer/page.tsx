import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { DonationForm } from "@/components/site/DonationForm";

export const metadata: Metadata = {
  title: "S'impliquer",
  description:
    "Bénévolat, partenariat ou don : les façons de s'impliquer auprès de la Fondation Sarje.",
};

const ways = [
  {
    title: "Devenir bénévole",
    body: "Sur le terrain ou à distance, selon vos compétences et votre disponibilité : soutien scolaire, santé, logistique, communication.",
    cta: "Proposer mon aide",
  },
  {
    title: "Devenir partenaire",
    body: "Entreprises, associations et institutions : construisons ensemble un partenariat adapté à vos objectifs et aux besoins du terrain.",
    cta: "Discuter d'un partenariat",
  },
];

export default function SImpliquerPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        S&rsquo;impliquer
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">
        Votre engagement change des vies concrètes
      </h1>
      <p className="mt-5 max-w-xl text-body text-muted">
        Il existe une façon de s&rsquo;impliquer adaptée à chacun.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Card className="flex flex-col">
          <h2 className="font-display text-h3 text-ink">Faire un don</h2>
          <p className="mt-2 flex-1 text-sm text-muted">
            Chaque don, ponctuel ou régulier, finance directement les
            programmes d&rsquo;éducation, de santé et d&rsquo;accompagnement
            communautaire.
          </p>
          <Link
            href="#don"
            className="mt-4 inline-flex items-center justify-center rounded-sm border border-line px-5 py-3 text-sm font-semibold text-ink hover:border-accent hover:text-accent-deep"
          >
            Faire un don
          </Link>
        </Card>
        {ways.map((way) => (
          <Card key={way.title} className="flex flex-col">
            <h2 className="font-display text-h3 text-ink">{way.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted">{way.body}</p>
            <ButtonLink href="/contact" variant="secondary" className="mt-4">
              {way.cta}
            </ButtonLink>
          </Card>
        ))}
      </div>

      <div id="don" className="mt-16 max-w-lg scroll-mt-20">
        <h2 className="font-display text-h2 text-ink">Faire un don</h2>
        <p className="mt-3 text-sm text-muted">
          Paiement sécurisé par carte bancaire, traité par Stripe. La
          fondation ne stocke jamais vos coordonnées bancaires.
        </p>
        <div className="mt-6">
          <DonationForm />
        </div>
      </div>
    </div>
  );
}
