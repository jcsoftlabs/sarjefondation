import Stripe from "stripe";

// null tant que STRIPE_SECRET_KEY n'est pas renseignée (voir .env.example) —
// le formulaire de don reste désactivé plutôt que de faire planter
// l'application en développement ou avant la création du compte Stripe.
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const isDonationEnabled = Boolean(
  process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);
