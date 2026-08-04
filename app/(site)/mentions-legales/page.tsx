import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-20">
      <h1 className="font-display text-h1 text-ink">Mentions légales</h1>

      <div className="mt-8 flex flex-col gap-6 text-body text-ink">
        <section>
          <h2 className="text-base font-semibold text-ink">Éditeur du site</h2>
          <p className="mt-2 text-muted">
            Le site sarjefondation.com est édité par la Fondation Sarje.
            <br />
            <span className="text-xs italic">
              [À compléter : dénomination légale exacte, forme juridique,
              adresse du siège et, le cas échéant, numéro d&rsquo;enregistrement
              auprès des autorités haïtiennes.]
            </span>
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">
            Responsable de la publication
          </h2>
          <p className="mt-2 text-muted italic">
            [À compléter : nom et fonction du responsable de publication.]
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Hébergement</h2>
          <p className="mt-2 text-muted">
            Le site est hébergé par Vercel Inc. Les données sont stockées sur
            une base de données PostgreSQL hébergée par Railway. Les médias
            (images) sont hébergés par Cloudinary.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">
            Propriété intellectuelle
          </h2>
          <p className="mt-2 text-muted">
            L&rsquo;ensemble des contenus présents sur ce site (textes, images,
            logo) est la propriété de la Fondation Sarje, sauf mention
            contraire, et ne peut être reproduit sans autorisation.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Contact</h2>
          <p className="mt-2 text-muted">
            Pour toute question relative à ces mentions légales, veuillez
            utiliser le formulaire de la page{" "}
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
