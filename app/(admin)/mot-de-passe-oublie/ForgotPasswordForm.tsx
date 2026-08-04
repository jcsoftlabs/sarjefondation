"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, null);

  if (state?.ok) {
    return (
      <p className="text-sm text-ink">
        Si un compte existe pour cette adresse, un email de réinitialisation
        vient d&rsquo;être envoyé. Le lien est valable une heure.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Input id="forgot-email" name="email" type="email" label="Email" required autoFocus />
      {state && !state.ok && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Envoi…" : "Envoyer le lien de réinitialisation"}
      </Button>
    </form>
  );
}
