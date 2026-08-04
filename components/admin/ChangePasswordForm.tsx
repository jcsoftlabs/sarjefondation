"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { changePassword } from "@/lib/actions/account";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <Card>
      <h2 className="font-display text-h3 text-ink">Changer de mot de passe</h2>
      <form ref={formRef} action={formAction} className="mt-5 flex flex-col gap-5">
        <Input
          id="password-current"
          name="currentPassword"
          type="password"
          label="Mot de passe actuel"
          required
        />
        <Input
          id="password-new"
          name="newPassword"
          type="password"
          label="Nouveau mot de passe"
          helperText="8 caractères minimum."
          required
        />
        <Input
          id="password-confirm"
          name="confirmPassword"
          type="password"
          label="Confirmer le nouveau mot de passe"
          required
        />

        {state && !state.ok && (
          <p role="alert" className="text-sm text-error">
            {state.error}
          </p>
        )}
        {state?.ok && <p className="text-sm text-success">Mot de passe mis à jour.</p>}

        <div>
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? "Mise à jour…" : "Changer le mot de passe"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
