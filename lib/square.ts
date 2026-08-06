import { SquareClient, SquareEnvironment } from "square";

// null tant que SQUARE_ACCESS_TOKEN n'est pas renseignée (voir .env.example)
// — le formulaire de don reste désactivé plutôt que de faire planter
// l'application en développement ou avant la création du compte Square.
export const square = process.env.SQUARE_ACCESS_TOKEN
  ? new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment:
        process.env.SQUARE_ENVIRONMENT === "production"
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
    })
  : null;

export const isDonationEnabled = Boolean(
  process.env.SQUARE_ACCESS_TOKEN &&
    process.env.SQUARE_LOCATION_ID &&
    process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
);
