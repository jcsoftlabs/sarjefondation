import { prisma } from "@/lib/db";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

// Comptage en base plutôt qu'en mémoire : les fonctions serverless de Vercel
// ne partagent pas leur mémoire entre invocations, une limite en mémoire ne
// serait donc pas fiable en production.
export async function isRateLimited(identifier: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  const count = await prisma.loginAttempt.count({
    where: { identifier, createdAt: { gte: since } },
  });
  return count >= MAX_ATTEMPTS;
}

export async function recordAttempt(identifier: string): Promise<void> {
  await prisma.loginAttempt.create({ data: { identifier } });
}
