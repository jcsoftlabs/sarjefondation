import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validators/auth";
import { logAudit } from "@/lib/audit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user) return null;

        const passwordMatches = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!passwordMatches) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        await logAudit({ userId: user.id, action: "LOGIN", entity: "User", entityId: user.id });

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
});

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}
