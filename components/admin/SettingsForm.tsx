"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { updateSettings } from "@/lib/actions/settings";
import type { SettingsInput } from "@/lib/validators/settings";

export function SettingsForm({ settings }: { settings: SettingsInput }) {
  const [state, formAction, pending] = useActionState(updateSettings, null);

  return (
    <Card>
      <h2 className="font-display text-h3 text-ink">Coordonnées et contenu du site</h2>
      <form action={formAction} className="mt-5 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id="settings-contactEmail"
            name="contactEmail"
            type="email"
            label="Email affiché publiquement"
            defaultValue={settings.contactEmail}
          />
          <Input
            id="settings-contactPhone"
            name="contactPhone"
            label="Téléphone"
            defaultValue={settings.contactPhone}
          />
        </div>
        <Input
          id="settings-contactAddress"
          name="contactAddress"
          label="Adresse"
          defaultValue={settings.contactAddress}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id="settings-socialFacebook"
            name="socialFacebook"
            label="Facebook"
            placeholder="https://facebook.com/..."
            defaultValue={settings.socialFacebook}
          />
          <Input
            id="settings-socialInstagram"
            name="socialInstagram"
            label="Instagram"
            placeholder="https://instagram.com/..."
            defaultValue={settings.socialInstagram}
          />
          <Input
            id="settings-socialTwitter"
            name="socialTwitter"
            label="X (Twitter)"
            placeholder="https://x.com/..."
            defaultValue={settings.socialTwitter}
          />
          <Input
            id="settings-socialLinkedin"
            name="socialLinkedin"
            label="LinkedIn"
            placeholder="https://linkedin.com/..."
            defaultValue={settings.socialLinkedin}
          />
        </div>

        <Textarea
          id="settings-homeIntroText"
          name="homeIntroText"
          label="Texte d'accroche de l'accueil"
          rows={3}
          defaultValue={settings.homeIntroText}
        />

        <Input
          id="settings-contactFormReceiverEmail"
          name="contactFormReceiverEmail"
          type="email"
          label="Email de réception du formulaire de contact"
          helperText="Les messages envoyés depuis la page Contact arrivent à cette adresse."
          defaultValue={settings.contactFormReceiverEmail}
        />

        {state && !state.ok && (
          <p role="alert" className="text-sm text-error">
            {state.error}
          </p>
        )}
        {state?.ok && <p className="text-sm text-success">Paramètres enregistrés.</p>}

        <div>
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? "Enregistrement…" : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
