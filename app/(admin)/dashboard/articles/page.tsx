import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Articles", robots: { index: false, follow: false } };

export default async function ArticlesAdminPage() {
  await requireAdmin();
  return <ComingSoon title="Articles" phase="la phase 4" />;
}
