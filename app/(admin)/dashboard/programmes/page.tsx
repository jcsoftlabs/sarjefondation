import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Programmes", robots: { index: false, follow: false } };

export default async function ProgrammesAdminPage() {
  await requireAdmin();
  return <ComingSoon title="Programmes" phase="la phase 5" />;
}
