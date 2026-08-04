import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Médias", robots: { index: false, follow: false } };

export default async function MediasAdminPage() {
  await requireAdmin();
  return <ComingSoon title="Médias" phase="la phase 6" />;
}
