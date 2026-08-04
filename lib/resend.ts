import { Resend } from "resend";

// null tant que RESEND_API_KEY n'est pas renseignée (voir .env.example) —
// les emails sont alors simplement ignorés plutôt que de faire planter
// l'application en développement.
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
