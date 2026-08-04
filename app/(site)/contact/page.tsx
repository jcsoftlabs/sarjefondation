import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez la Fondation Sarje.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Contact
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">
        Écrivez-nous
      </h1>
      <p className="mt-5 text-body text-muted">
        Un projet de partenariat, une envie de bénévolat, une question sur nos
        programmes : ce formulaire nous parvient directement, nous répondons
        personnellement à chaque message.
      </p>

      <ContactForm />
    </div>
  );
}
