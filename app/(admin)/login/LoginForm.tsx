"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Input id="login-email" name="email" type="email" label="Email" required autoFocus />
      <Input
        id="login-password"
        name="password"
        type="password"
        label="Mot de passe"
        required
      />
      {state && !state.ok && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
      <Link
        href="/mot-de-passe-oublie"
        className="text-center text-sm font-medium text-accent-deep hover:underline"
      >
        Mot de passe oublié ?
      </Link>
    </form>
  );
}
