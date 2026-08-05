"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { loadStripe, type Stripe as StripeClient } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { createDonationPaymentIntent } from "@/lib/actions/donation";
import { presetAmountsUsd } from "@/lib/validators/donation";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise: Promise<StripeClient | null> | null = publishableKey
  ? loadStripe(publishableKey)
  : null;

type Step =
  | { name: "amount" }
  | { name: "payment"; clientSecret: string }
  | { name: "success" }
  | { name: "error"; message: string };

export function DonationForm() {
  const t = useTranslations("Don");
  const [step, setStep] = useState<Step>({ name: "amount" });

  useEffect(() => {
    // Lecture de l'URL au retour d'une redirection Stripe (certains moyens
    // de paiement redirigent hors du site avant de revenir) : window n'existe
    // pas côté serveur, cette synchronisation ne peut se faire qu'ici.
    const params = new URLSearchParams(window.location.search);
    if (params.get("redirect_status") === "succeeded") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep({ name: "success" });
    }
  }, []);

  if (!stripePromise) {
    return (
      <Card>
        <p className="text-sm text-muted">{t("indisponible")}</p>
      </Card>
    );
  }

  if (step.name === "success") {
    return (
      <Card>
        <p className="text-body text-ink">{t("merci")}</p>
      </Card>
    );
  }

  if (step.name === "payment") {
    return (
      <Elements
        stripe={stripePromise}
        options={{ clientSecret: step.clientSecret }}
      >
        <PaymentStep onError={(message) => setStep({ name: "error", message })} />
      </Elements>
    );
  }

  return (
    <Suspense fallback={
      <Card>
        <p className="text-sm text-muted">{t("chargement")}</p>
      </Card>
    }>
      <AmountStep
        errorMessage={step.name === "error" ? step.message : undefined}
        onReady={(clientSecret) => setStep({ name: "payment", clientSecret })}
      />
    </Suspense>
  );
}

function AmountStep({
  onReady,
  errorMessage,
}: {
  onReady: (clientSecret: string) => void;
  errorMessage?: string;
}) {
  const t = useTranslations("Don");
  const searchParams = useSearchParams();
  const urlAmount = searchParams.get("amount");

  const initialAmount = urlAmount && !isNaN(Number(urlAmount))
    ? Number(urlAmount)
    : presetAmountsUsd[1];

  const [amount, setAmount] = useState<number | null>(presetAmountsUsd.includes(initialAmount) ? initialAmount : null);
  const [customAmount, setCustomAmount] = useState(presetAmountsUsd.includes(initialAmount) ? "" : String(initialAmount));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(errorMessage ?? null);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  async function handleSubmit() {
    if (!effectiveAmount || effectiveAmount <= 0) {
      setError(t("choisirMontant"));
      return;
    }
    setPending(true);
    setError(null);
    const result = await createDonationPaymentIntent({
      amountCents: Math.round(effectiveAmount * 100),
      donorName: name || undefined,
      donorEmail: email || undefined,
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onReady(result.clientSecret);
  }

  return (
    <Card>
      <div className="flex flex-col gap-5">
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink">
            {t("montantLabel")}
          </span>
          <div className="flex flex-wrap gap-2">
            {presetAmountsUsd.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAmount(preset);
                  setCustomAmount("");
                }}
                className={cn(
                  "rounded-sm border px-4 py-2 text-sm font-medium",
                  amount === preset && !customAmount
                    ? "border-accent bg-accent-soft text-accent-deep"
                    : "border-line text-ink hover:border-accent",
                )}
              >
                {preset} $
              </button>
            ))}
          </div>
          <div className="mt-3 max-w-[10rem]">
            <Input
              id="donation-custom-amount"
              label={t("autreMontant")}
              type="number"
              min={2}
              step={1}
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="donation-name"
            label={t("nom")}
            helperText={t("nomHelper")}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            id="donation-email"
            label={t("email")}
            type="email"
            helperText={t("emailHelper")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}

        <div>
          <Button type="button" variant="primary" onClick={handleSubmit} disabled={pending}>
            {pending ? t("preparation") : t("continuer")}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function PaymentStep({ onError }: { onError: (message: string) => void }) {
  const t = useTranslations("Don");
  const stripe = useStripe();
  const elements = useElements();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;

    setPending(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${window.location.pathname}`,
      },
    });
    setPending(false);

    if (error) {
      onError(error.message ?? t("paiementEchoue"));
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <PaymentElement />
        <div>
          <Button type="submit" variant="primary" disabled={!stripe || pending}>
            {pending ? t("traitement") : t("faireLeDon")}
          </Button>
        </div>
      </form>
    </Card>
  );
}
