"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { donationSchema } from "@/lib/validators/donation";

export type CreateDonationResult =
  | { ok: true; clientSecret: string }
  | { ok: false; error: string };

export async function createDonationPaymentIntent(
  input: unknown,
): Promise<CreateDonationResult> {
  if (!stripe) {
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

  const paymentIntent = await stripe.paymentIntents.create({
    amount: parsed.data.amountCents,
    currency: "usd",
    receipt_email: parsed.data.donorEmail || undefined,
    metadata: {
      donorName: parsed.data.donorName ?? "",
    },
  });

  if (!paymentIntent.client_secret) {
    return { ok: false, error: "Une erreur est survenue. Réessayez plus tard." };
  }

  await prisma.donation.create({
    data: {
      amountCents: parsed.data.amountCents,
      currency: "usd",
      donorName: parsed.data.donorName || null,
      donorEmail: parsed.data.donorEmail || null,
      stripePaymentIntentId: paymentIntent.id,
      status: "PENDING",
    },
  });

  return { ok: true, clientSecret: paymentIntent.client_secret };
}
