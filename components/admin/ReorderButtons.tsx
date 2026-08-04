"use client";

import { useRouter } from "next/navigation";

export function ReorderButtons({
  id,
  isFirst,
  isLast,
  move,
}: {
  id: string;
  isFirst: boolean;
  isLast: boolean;
  move: (id: string, direction: "up" | "down") => Promise<void>;
}) {
  const router = useRouter();

  async function handleMove(direction: "up" | "down") {
    await move(id, direction);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        aria-label="Déplacer vers le haut"
        disabled={isFirst}
        onClick={() => handleMove("up")}
        className="rounded-sm px-1.5 text-xs text-muted hover:bg-line/40 hover:text-accent-deep disabled:opacity-30"
      >
        ▲
      </button>
      <button
        type="button"
        aria-label="Déplacer vers le bas"
        disabled={isLast}
        onClick={() => handleMove("down")}
        className="rounded-sm px-1.5 text-xs text-muted hover:bg-line/40 hover:text-accent-deep disabled:opacity-30"
      >
        ▼
      </button>
    </div>
  );
}
