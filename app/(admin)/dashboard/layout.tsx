import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar userName={user.name ?? user.email ?? "Admin"} />
        <main className="flex-1 bg-paper p-6">{children}</main>
      </div>
    </div>
  );
}
