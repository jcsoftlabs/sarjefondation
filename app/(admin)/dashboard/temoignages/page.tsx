import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Témoignages", robots: { index: false, follow: false } };

export default async function TemoignagesAdminPage() {
  await requireAdmin();
  return <ComingSoon title="Témoignages" phase="la phase 5" />;
}
