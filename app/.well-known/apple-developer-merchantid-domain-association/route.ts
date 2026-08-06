import { APPLE_PAY_DOMAIN_ASSOCIATION } from "@/lib/apple-pay-domain-association";

// Route dynamique plutôt qu'un fichier statique dans public/ : voir
// lib/apple-pay-domain-association.ts pour le pourquoi (Range/206 rejeté
// par le vérificateur de domaine d'Apple).
export async function GET() {
  const body = new TextEncoder().encode(APPLE_PAY_DOMAIN_ASSOCIATION);
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Length": String(body.byteLength),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
