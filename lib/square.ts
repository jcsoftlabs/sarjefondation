import { SquareClient, SquareEnvironment } from "square";

// L'ID de lieu et l'environnement (sandbox/production) ne sont pas des
// secrets — ils sont de toute façon visibles côté navigateur pour le Web
// Payments SDK — donc une seule variable NEXT_PUBLIC_ suffit, lue ici aussi
// côté serveur, plutôt que de dupliquer la même valeur sous deux noms.
export const squareLocationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

// null tant que SQUARE_ACCESS_TOKEN n'est pas renseignée (voir .env.example)
// — le formulaire de don reste désactivé plutôt que de faire planter
// l'application en développement ou avant la création du compte Square.
export const square = process.env.SQUARE_ACCESS_TOKEN
  ? new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment:
        process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production"
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
    })
  : null;

export const isDonationEnabled = Boolean(
  process.env.SQUARE_ACCESS_TOKEN &&
    squareLocationId &&
    process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
);
