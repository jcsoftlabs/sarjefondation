import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Équipe", robots: { index: false, follow: false } };

export default async function EquipeAdminPage() {
  await requireAdmin();
  return <ComingSoon title="Équipe" phase="la phase 5" />;
}
