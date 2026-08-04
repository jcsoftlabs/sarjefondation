"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ResetPasswordForm({ token }: { token: string }) {
  const actionWithToken = resetPasswordAction.bind(null, token);
  const [state, formAction, pending] = useActionState(actionWithToken, null);

  if (state?.ok) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-ink">
          Votre mot de passe a été mis à jour.
        </p>
        <Link
          href="/login"
          className="text-center text-sm font-medium text-accent-deep hover:underline"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Input
        id="reset-password"
        name="password"
        type="password"
        label="Nouveau mot de passe"
        helperText="8 caractères minimum."
        required
        autoFocus
      />
      <Input
        id="reset-confirm-password"
        name="confirmPassword"
        type="password"
        label="Confirmer le mot de passe"
        required
      />
      {state && !state.ok && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Mise à jour…" : "Réinitialiser le mot de passe"}
      </Button>
    </form>
  );
}
