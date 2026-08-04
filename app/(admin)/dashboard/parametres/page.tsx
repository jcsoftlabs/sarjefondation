import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Paramètres", robots: { index: false, follow: false } };

export default async function ParametresAdminPage() {
  await requireAdmin();
  return <ComingSoon title="Paramètres" phase="la phase 6" />;
}
