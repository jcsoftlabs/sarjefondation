import { Breadcrumb } from "@/components/admin/Breadcrumb";
import { LogoutButton } from "@/components/admin/LogoutButton";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Topbar({ userName }: { userName: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line bg-paper px-6 py-4">
      <Breadcrumb />
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-deep"
        >
          {initials(userName)}
        </span>
        <span className="hidden text-sm text-ink sm:inline">{userName}</span>
        <LogoutButton />
      </div>
    </div>
  );
}
