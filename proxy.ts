import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Protège /dashboard sans dépendre de Prisma : redirige vers /login en
// l'absence de session, avant même que la page ne commence à s'exécuter
// (via authConfig.callbacks.authorized). Pour les autres chemins (site
// public), on délègue au middleware next-intl qui gère le préfixe de
// langue (/fr, /en) et sa détection.
const { auth } = NextAuth(authConfig);
const intlMiddleware = createMiddleware(routing);

const ADMIN_PREFIXES = ["/dashboard", "/login", "/mot-de-passe-oublie", "/reinitialiser"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return;
  }
  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|design-system|.*\\..*).*)"],
};
