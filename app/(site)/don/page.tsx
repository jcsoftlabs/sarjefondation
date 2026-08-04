import type { Metadata } from "next";
import { DonationForm } from "@/components/site/DonationForm";

export const metadata: Metadata = {
  title: "Faire un don",
  description:
    "Soutenez la Fondation Sarje par un don, ponctuel ou récurrent, qui finance directement nos programmes d'éducation, de santé et d'accompagnement communautaire.",
};

export default function DonPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Faire un don
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">
        Votre don change des vies concrètes
      </h1>
      <p className="mt-5 text-body text-muted">
        Chaque don finance directement les programmes d&rsquo;éducation, de
        santé et d&rsquo;accompagnement communautaire de la fondation.
        Paiement sécurisé par carte bancaire, traité par Stripe — la
        fondation ne stocke jamais vos coordonnées bancaires.
      </p>

      <div className="mt-10">
        <DonationForm />
      </div>
    </div>
  );
}
