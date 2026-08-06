import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDonationEnabled } from "@/lib/square";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Dons", robots: { index: false, follow: false } };

const statusLabels = {
  PENDING: "En attente",
  SUCCEEDED: "Réussi",
  FAILED: "Échoué",
} as const;

export default async function DonsAdminPage() {
  await requireAdmin();
  const donations = await prisma.donation.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  const totalSucceeded = donations
    .filter((d) => d.status === "SUCCEEDED")
    .reduce((sum, d) => sum + d.amountCents, 0);

  return (
    <div>
      <h1 className="font-display text-h2 text-ink">Dons</h1>

      {!isDonationEnabled && (
        <Card className="mt-6 border-dashed">
          <p className="text-sm text-muted">
            Le don en ligne n&rsquo;est pas encore configuré. Renseignez les
            identifiants Square dans les variables d&rsquo;environnement
            pour l&rsquo;activer.
          </p>
        </Card>
      )}

      {donations.length === 0 ? (
        <Card className="mt-6">
          <p className="text-sm text-muted">Aucun don pour le moment.</p>
        </Card>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted">
            Total reçu :{" "}
            <span className="font-semibold text-ink">
              {(totalSucceeded / 100).toLocaleString("fr-FR", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </p>
          <Card className="mt-4 p-0">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    {(donation.amountCents / 100).toLocaleString("fr-FR", {
                      style: "currency",
                      currency: donation.currency.toUpperCase(),
                    })}
                  </p>
                  <p className="text-xs text-muted">
                    {donation.donorName || "Anonyme"}
                    {donation.donorEmail ? ` — ${donation.donorEmail}` : ""}
                  </p>
                  <p className="text-xs text-muted">
                    {donation.createdAt.toLocaleString("fr-FR")}
                  </p>
                </div>
                <Badge
                  variant={
                    donation.status === "SUCCEEDED"
                      ? "success"
                      : donation.status === "FAILED"
                        ? "error"
                        : "neutral"
                  }
                >
                  {statusLabels[donation.status]}
                </Badge>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  );
}
