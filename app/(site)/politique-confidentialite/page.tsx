import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: true },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-20">
      <h1 className="font-display text-h1 text-ink">
        Politique de confidentialité
      </h1>

      <div className="mt-8 flex flex-col gap-6 text-body text-ink">
        <section>
          <h2 className="text-base font-semibold text-ink">
            Données collectées
          </h2>
          <p className="mt-2 text-muted">
            Le formulaire de contact collecte le nom, l&rsquo;adresse email, le
            sujet et le message que vous saisissez. Ces informations sont
            utilisées uniquement pour vous répondre et ne sont partagées avec
            aucun tiers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Conservation</h2>
          <p className="mt-2 text-muted">
            Les messages reçus via le formulaire de contact sont conservés le
            temps nécessaire au traitement de votre demande.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Cookies</h2>
          <p className="mt-2 text-muted">
            Ce site n&rsquo;utilise pas de cookies de suivi publicitaire. Un
            outil de mesure d&rsquo;audience respectueux de la vie privée
            pourra être mis en place ultérieurement ; cette politique sera
            alors mise à jour en conséquence.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Vos droits</h2>
          <p className="mt-2 text-muted">
            Vous pouvez demander l&rsquo;accès, la rectification ou la
            suppression des données vous concernant en écrivant via la page{" "}
            <a href="/contact" className="text-accent-deep hover:underline">
              Contact
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
