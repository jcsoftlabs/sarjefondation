import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Chiffres d'impact", robots: { index: false, follow: false } };

export default async function ImpactAdminPage() {
  await requireAdmin();
  return <ComingSoon title="Chiffres d'impact" phase="la phase 5" />;
}
