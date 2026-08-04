import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Protège /dashboard sans dépendre de Prisma : redirige vers /login en
// l'absence de session, avant même que la page ne commence à s'exécuter.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/dashboard/:path*"],
};
