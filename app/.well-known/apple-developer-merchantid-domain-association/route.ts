import { APPLE_PAY_DOMAIN_ASSOCIATION } from "@/lib/apple-pay-domain-association";

// Route dynamique plutôt qu'un fichier statique dans public/ : voir
// lib/apple-pay-domain-association.ts pour le pourquoi (Range/206 rejeté
// par le vérificateur de domaine d'Apple). Content-Type
// application/octet-stream plutôt que text/plain : Vercel compresse
// automatiquement les réponses texte quand le client accepte gzip, et
// retire alors l'en-tête Content-Length — exactement ce que le
// vérificateur Apple/Square rejette ("partial response"). Les types
// opaques/binaires ne sont pas recompressés à la volée.
export async function GET() {
  const body = new TextEncoder().encode(APPLE_PAY_DOMAIN_ASSOCIATION);
  return new Response(body, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(body.byteLength),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
