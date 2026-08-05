"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { submitContactForm } from "@/lib/actions/contact";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [state, formAction, pending] = useActionState(submitContactForm, null);

  if (state?.ok) {
    return <p className="mt-10 text-body text-ink">{t("success")}</p>;
  }

  return (
    <form action={formAction} className="mt-10 flex flex-col gap-5">
      {/* Honeypot anti-spam : invisible pour un visiteur humain. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-website">{t("champVide")}</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="contact-name" name="name" label={t("nomComplet")} required />
        <Input
          id="contact-email"
          name="email"
          type="email"
          label={t("adresseEmail")}
          required
        />
      </div>
      <Select
        id="contact-subject"
        name="subject"
        label={t("sujet")}
        options={[
          { value: "benevolat", label: t("sujetBenevolat") },
          { value: "partenariat", label: t("sujetPartenariat") },
          { value: "don", label: t("sujetDon") },
          { value: "autre", label: t("sujetAutre") },
        ]}
      />
      <Textarea id="contact-message" name="message" label={t("message")} required rows={6} />

      {state && !state.ok && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}

      <div>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? t("envoi") : t("envoyer")}
        </Button>
      </div>
    </form>
  );
}
