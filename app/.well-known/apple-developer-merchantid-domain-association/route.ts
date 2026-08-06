import { APPLE_PAY_DOMAIN_ASSOCIATION } from "@/lib/apple-pay-domain-association";

// Route dynamique plutôt qu'un fichier statique dans public/ : voir
// lib/apple-pay-domain-association.ts pour le pourquoi (Range/206 rejeté
// par le vérificateur de domaine d'Apple).
export async function GET() {
  return new Response(APPLE_PAY_DOMAIN_ASSOCIATION, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
