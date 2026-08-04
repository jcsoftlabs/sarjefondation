import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { adminNav } from "@/lib/admin-nav";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Back-office",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await requireAdmin();
  const modules = adminNav.filter((item) => item.href !== "/dashboard");

  return (
    <div>
      <h1 className="font-display text-h2 text-ink">
        Bonjour {user.name ?? user.email}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Choisissez un module à gauche pour commencer.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:border-accent">
              <p className="font-medium text-ink">{item.label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
