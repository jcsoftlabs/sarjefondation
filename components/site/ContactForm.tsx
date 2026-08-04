"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { submitContactForm } from "@/lib/actions/contact";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, null);

  if (state?.ok) {
    return (
      <p className="mt-10 text-body text-ink">
        Merci, votre message a bien été envoyé. Nous vous répondrons dès que
        possible.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-10 flex flex-col gap-5">
      {/* Honeypot anti-spam : invisible pour un visiteur humain. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-website">Laissez ce champ vide</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

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
      <Textarea id="contact-message" name="message" label="Message" required rows={6} />

      {state && !state.ok && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}

      <div>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Envoi…" : "Envoyer le message"}
        </Button>
      </div>
    </form>
  );
}
