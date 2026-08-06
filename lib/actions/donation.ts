"use server";

import { randomUUID } from "node:crypto";
import { square } from "@/lib/square";
import { prisma } from "@/lib/db";
import { donationSchema } from "@/lib/validators/donation";
import type { DonationStatus } from "@/app/generated/prisma/client";

export type CreateDonationResult =
  | { ok: true; status: DonationStatus }
  | { ok: false; error: string };

// Contrairement à Stripe (PaymentIntent créé puis confirmé côté client),
// l'API Square traite la carte en un seul appel synchrone : le Web
// Payments SDK tokenise la carte côté client (sourceId), puis ce Server
// Action encaisse directement via payments.create et connaît le résultat
// final immédiatement — pas d'étape de confirmation séparée.
export async function createDonationPayment(input: unknown): Promise<CreateDonationResult> {
  if (!square || !process.env.SQUARE_LOCATION_ID) {
    return {
      ok: false,
      error: "Le don en ligne n'est pas encore disponible.",
    };
  }

  const parsed = donationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Montant invalide.",
    };
  }
  const { amountCents, donorName, donorEmail, sourceId } = parsed.data;

  let payment;
  try {
    const response = await square.payments.create({
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(amountCents),
        currency: "USD",
      },
      locationId: process.env.SQUARE_LOCATION_ID,
      buyerEmailAddress: donorEmail || undefined,
      note: donorName ? `Don de ${donorName}` : undefined,
    });
    payment = response.payment;
  } catch (error) {
    console.error("Paiement Square refusé", error);
    return { ok: false, error: "Le paiement a été refusé. Vérifiez vos informations et réessayez." };
  }

  if (!payment?.id) {
    return { ok: false, error: "Une erreur est survenue. Réessayez plus tard." };
  }

  const status: DonationStatus = payment.status === "COMPLETED" ? "SUCCEEDED" : payment.status === "FAILED" || payment.status === "CANCELED" ? "FAILED" : "PENDING";

  await prisma.donation.create({
    data: {
      amountCents,
      currency: "usd",
      donorName: donorName || null,
      donorEmail: donorEmail || null,
      squarePaymentId: payment.id,
      status,
    },
  });

  if (status === "FAILED") {
    return { ok: false, error: "Le paiement a échoué. Réessayez." };
  }

  return { ok: true, status };
}
