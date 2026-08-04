"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/lib/admin-nav";

export function Breadcrumb() {
  const pathname = usePathname();
  const current = [...adminNav]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname.startsWith(item.href));

  return (
    <nav aria-label="Fil d'ariane" className="text-sm text-muted">
      <Link href="/dashboard" className="hover:text-accent-deep">
        Back-office
      </Link>
      {current && current.href !== "/dashboard" && (
        <>
          <span className="mx-2">/</span>
          <span className="text-ink">{current.label}</span>
        </>
      )}
    </nav>
  );
}
