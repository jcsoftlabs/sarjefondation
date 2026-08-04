"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { adminNav } from "@/lib/admin-nav";
import { cn } from "@/lib/cn";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-line bg-paper md:block">
      <div className="flex items-center gap-2 border-b border-line px-5 py-5">
        <Image src="/logo-fondation.png" alt="Fondation Sarje" width={32} height={32} />
        <span className="font-display text-base text-ink">Sarje</span>
      </div>
      <nav className="flex flex-col gap-1 p-3" aria-label="Navigation du back-office">
        {adminNav.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-sm px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-accent-soft text-accent-deep"
                  : "text-ink hover:bg-line/40",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
