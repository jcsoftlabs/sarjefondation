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

type TokenizeResult = { status: string; token?: string; errors?: { message: string }[] };

// Interface commune à card() et googlePay() : un bouton monté dans le DOM,
// tokenisé sur clic.
type AttachableMethod = {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<TokenizeResult>;
  destroy: () => Promise<void>;
};

// Apple Pay ne fournit pas de attach() : le bouton est un élément HTML
// standard stylé selon les règles Apple, tokenisé sur clic.
type ApplePayMethod = {
  tokenize: () => Promise<TokenizeResult>;
};

// Cash App Pay tokenise de façon événementielle (QR code ou redirection),
// pas sur un simple clic synchrone.
type CashAppPayMethod = {
  attach: (selector: string, options?: Record<string, string>) => Promise<void>;
  addEventListener: (
    event: "ontokenization",
    handler: (event: { detail: { tokenResult: TokenizeResult } }) => void,
  ) => void;
  destroy: () => Promise<void>;
};

type PaymentRequest = unknown;

// Chargé dynamiquement par le script Square Web Payments SDK.
declare global {
  interface Window {
    Square?: {
      payments: (
        appId: string,
        locationId: string,
      ) => {
        paymentRequest: (options: {
          countryCode: string;
          currencyCode: string;
          total: { amount: string; label: string };
        }) => PaymentRequest;
        card: () => Promise<AttachableMethod>;
        googlePay: (paymentRequest: PaymentRequest) => Promise<AttachableMethod>;
        applePay: (paymentRequest: PaymentRequest) => Promise<ApplePayMethod>;
        cashAppPay: (
          paymentRequest: PaymentRequest,
          options: { redirectURL: string; referenceId?: string },
        ) => Promise<CashAppPayMethod>;
      };
    };
    ApplePaySession?: unknown;
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
  const cardRef = useRef<AttachableMethod | null>(null);
  const googlePayRef = useRef<AttachableMethod | null>(null);
  const applePayRef = useRef<ApplePayMethod | null>(null);
  const cashAppPayRef = useRef<CashAppPayMethod | null>(null);

  const [cardReady, setCardReady] = useState(false);
  const [googlePayVisible, setGooglePayVisible] = useState(false);
  const [applePayVisible, setApplePayVisible] = useState(false);
  const [cashAppPayVisible, setCashAppPayVisible] = useState(false);
  const [pending, setPending] = useState(false);

  async function submitSourceId(sourceId: string) {
    setPending(true);
    const response = await createDonationPayment({
      amountCents,
      donorName: donorName || undefined,
      donorEmail: donorEmail || undefined,
      sourceId,
    });
    setPending(false);

    if (!response.ok) {
      onError(response.error);
      return;
    }
    onSuccess();
  }

  useEffect(() => {
    let cancelled = false;
    const destroyers: (() => Promise<void>)[] = [];

    async function mountMethods() {
      if (!window.Square || !applicationId || !locationId) return;
      const payments = window.Square.payments(applicationId, locationId);
      const paymentRequest = payments.paymentRequest({
        countryCode: "US",
        currencyCode: "USD",
        total: { amount: (amountCents / 100).toFixed(2), label: "Don — Fondation Sarje" },
      });

      // Carte bancaire — toujours disponible.
      const card = await payments.card();
      await card.attach("#square-card-container");
      if (cancelled) {
        await card.destroy();
        return;
      }
      cardRef.current = card;
      destroyers.push(() => card.destroy());
      setCardReady(true);

      // Google Pay — se déclare non disponible sur les navigateurs/appareils
      // qui ne le supportent pas plutôt que de faire échouer le formulaire.
      try {
        const googlePay = await payments.googlePay(paymentRequest);
        await googlePay.attach("#google-pay-button");
        if (cancelled) {
          await googlePay.destroy();
        } else {
          googlePayRef.current = googlePay;
          destroyers.push(() => googlePay.destroy());
          setGooglePayVisible(true);
        }
      } catch {
        // Non disponible sur ce navigateur — bouton simplement masqué.
      }

      // Apple Pay — uniquement Safari sur un appareil Apple.
      if (window.ApplePaySession) {
        try {
          const applePay = await payments.applePay(paymentRequest);
          if (!cancelled) {
            applePayRef.current = applePay;
            setApplePayVisible(true);
          }
        } catch {
          // Non disponible (pas de carte enregistrée dans Wallet, etc.).
        }
      }

      // Cash App Pay — tokenise via un événement, pas un clic direct.
      try {
        const cashAppPay = await payments.cashAppPay(paymentRequest, {
          redirectURL: window.location.href,
          referenceId: `don-${Date.now()}`,
        });
        await cashAppPay.attach("#cash-app-pay-button", { shape: "semiround", width: "full" });
        if (cancelled) {
          await cashAppPay.destroy();
        } else {
          cashAppPay.addEventListener("ontokenization", (event) => {
            const { tokenResult } = event.detail;
            if (tokenResult.status === "OK" && tokenResult.token) {
              submitSourceId(tokenResult.token);
            } else {
              onError(tokenResult.errors?.[0]?.message ?? t("paiementEchoue"));
            }
          });
          cashAppPayRef.current = cashAppPay;
          destroyers.push(() => cashAppPay.destroy());
          setCashAppPayVisible(true);
        }
      } catch {
        // Non disponible sur ce navigateur.
      }
    }

    mountMethods();
    return () => {
      cancelled = true;
      destroyers.forEach((destroy) => destroy());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- amountCents est figé pour la durée de vie de cette étape
  }, []);

  async function handleCardSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!cardRef.current) return;
    const result = await cardRef.current.tokenize();
    if (result.status !== "OK" || !result.token) {
      onError(result.errors?.[0]?.message ?? t("paiementEchoue"));
      return;
    }
    await submitSourceId(result.token);
  }

  async function handleGooglePayClick() {
    if (!googlePayRef.current) return;
    const result = await googlePayRef.current.tokenize();
    if (result.status !== "OK" || !result.token) {
      onError(result.errors?.[0]?.message ?? t("paiementEchoue"));
      return;
    }
    await submitSourceId(result.token);
  }

  async function handleApplePayClick() {
    if (!applePayRef.current) return;
    const result = await applePayRef.current.tokenize();
    if (result.status !== "OK" || !result.token) {
      onError(result.errors?.[0]?.message ?? t("paiementEchoue"));
      return;
    }
    await submitSourceId(result.token);
  }

  return (
    <Card>
      <div className="flex flex-col gap-5">
        {(applePayVisible || googlePayVisible || cashAppPayVisible) && (
          <div className="flex flex-col gap-3">
            {applePayVisible && (
              <button
                type="button"
                onClick={handleApplePayClick}
                disabled={pending}
                className="apple-pay-button h-11 w-full rounded-sm bg-black text-sm font-semibold text-white"
                style={{ WebkitAppearance: "-apple-pay-button" } as React.CSSProperties}
              >
                {t("faireLeDon")}
              </button>
            )}
            <div
              id="google-pay-button"
              onClick={handleGooglePayClick}
              className={cn("h-11", !googlePayVisible && "hidden")}
            />
            <div id="cash-app-pay-button" className={cn(!cashAppPayVisible && "hidden")} />
            <div className="flex items-center gap-3 text-xs text-muted">
              <div className="h-px flex-1 bg-line" />
              {t("ouParCarte")}
              <div className="h-px flex-1 bg-line" />
            </div>
          </div>
        )}

        <form onSubmit={handleCardSubmit} className="flex flex-col gap-5">
          <div id="square-card-container" />
          <div>
            <Button type="submit" variant="primary" disabled={!cardReady || pending}>
              {pending ? t("traitement") : t("faireLeDon")}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
