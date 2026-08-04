import type { Metadata } from "next";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

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

      <form className="mt-10 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input id="contact-name" name="name" label="Nom complet" required />
          <Input
            id="contact-email"
            name="email"
            type="email"
            label="Adresse email"
            required
          />
        </div>
        <Select
          id="contact-subject"
          name="subject"
          label="Sujet"
          options={[
            { value: "benevolat", label: "Bénévolat" },
            { value: "partenariat", label: "Partenariat" },
            { value: "don", label: "Don" },
            { value: "autre", label: "Autre" },
          ]}
        />
        <Textarea
          id="contact-message"
          name="message"
          label="Message"
          required
          rows={6}
        />
        <div>
          <Button type="submit" variant="primary">
            Envoyer le message
          </Button>
        </div>
      </form>
    </div>
  );
}
