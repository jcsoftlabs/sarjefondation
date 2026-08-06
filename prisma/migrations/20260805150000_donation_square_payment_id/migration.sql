-- Renommage (et non recréation) pour préserver les dons déjà enregistrés,
-- même si leur identifiant de paiement fait encore référence à Stripe.
ALTER TABLE "Donation" RENAME COLUMN "stripePaymentIntentId" TO "squarePaymentId";
