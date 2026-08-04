import type { NextAuthConfig } from "next-auth";

// Config sans accès base de données, utilisée par le proxy (proxy.ts) pour
// protéger /dashboard sans dépendre du reste de la config Auth.js.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      if (isDashboard) return isLoggedIn;
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
