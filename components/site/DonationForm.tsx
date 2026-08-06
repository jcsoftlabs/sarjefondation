"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { createDonationPayment } from "@/lib/actions/donation";
import { presetAmountsUsd } from "@/lib/validators/donation";

const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
const squareSdkUrl =
  process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production"
    ? "https://web.squarecdn.com/v1/square.js"
    : "https://sandbox.web.squarecdn.com/v1/square.js";
const isSquareConfigured = Boolean(applicationId && locationId);

type SquareCard = {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: { message: string }[] }>;
  destroy: () => Promise<void>;
};

// Chargé dynamiquement par le script Square Web Payments SDK.
declare global {
  interface Window {
    Square?: {
      payments: (
        appId: string,
        locationId: string,
      ) => { card: () => Promise<SquareCard> };
    };
  }
}

type Step =
  | { name: "amount" }
  | { name: "payment"; amountCents: number; donorName: string; donorEmail: string }
  | { name: "success" }
  | { name: "error"; message: string };

export function DonationForm() {
  const t = useTranslations("Don");
  const [step, setStep] = useState<Step>({ name: "amount" });
  const [sdkReady, setSdkReady] = useState(false);

  if (!isSquareConfigured) {
    return (
      <Card>
        <p className="text-sm text-muted">{t("indisponible")}</p>
      </Card>
    );
  }

  return (
    <>
      <Script src={squareSdkUrl} onReady={() => setSdkReady(true)} />

      {step.name === "success" ? (
        <Card>
          <p className="text-body text-ink">{t("merci")}</p>
        </Card>
      ) : step.name === "payment" ? (
        sdkReady ? (
          <PaymentStep
            amountCents={step.amountCents}
            donorName={step.donorName}
            donorEmail={step.donorEmail}
            onSuccess={() => setStep({ name: "success" })}
            onError={(message) => setStep({ name: "error", message })}
          />
        ) : (
          <Card>
            <p className="text-sm text-muted">{t("chargement")}</p>
          </Card>
        )
      ) : (
        <Suspense fallback={
          <Card>
            <p className="text-sm text-muted">{t("chargement")}</p>
          </Card>
        }>
          <AmountStep
            errorMessage={step.name === "error" ? step.message : undefined}
            onReady={(amountCents, donorName, donorEmail) =>
              setStep({ name: "payment", amountCents, donorName, donorEmail })
            }
          />
        </Suspense>
      )}
    </>
  );
}

function AmountStep({
  onReady,
  errorMessage,
}: {
  onReady: (amountCents: number, donorName: string, donorEmail: string) => void;
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
  const [error, setError] = useState<string | null>(errorMessage ?? null);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  function handleSubmit() {
    if (!effectiveAmount || effectiveAmount <= 0) {
      setError(t("choisirMontant"));
      return;
    }
    setError(null);
    onReady(Math.round(effectiveAmount * 100), name, email);
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
          <Button type="button" variant="primary" onClick={handleSubmit}>
            {t("continuer")}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function PaymentStep({
  amountCents,
  donorName,
  donorEmail,
  onSuccess,
  onError,
}: {
  amountCents: number;
  donorName: string;
  donorEmail: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}) {
  const t = useTranslations("Don");
  const cardRef = useRef<SquareCard | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function mountCard() {
      if (!window.Square || !applicationId || !locationId) return;
      const payments = window.Square.payments(applicationId, locationId);
      const card = await payments.card();
      await card.attach("#square-card-container");
      if (cancelled) {
        await card.destroy();
        return;
      }
      cardRef.current = card;
      setCardReady(true);
    }
    mountCard();
    return () => {
      cancelled = true;
      cardRef.current?.destroy();
    };
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!cardRef.current) return;

    setPending(true);
    const result = await cardRef.current.tokenize();
    if (result.status !== "OK" || !result.token) {
      setPending(false);
      onError(result.errors?.[0]?.message ?? t("paiementEchoue"));
      return;
    }

    const response = await createDonationPayment({
      amountCents,
      donorName: donorName || undefined,
      donorEmail: donorEmail || undefined,
      sourceId: result.token,
    });
    setPending(false);

    if (!response.ok) {
      onError(response.error);
      return;
    }
    onSuccess();
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div id="square-card-container" />
        <div>
          <Button type="submit" variant="primary" disabled={!cardReady || pending}>
            {pending ? t("traitement") : t("faireLeDon")}
          </Button>
        </div>
      </form>
    </Card>
  );
}
