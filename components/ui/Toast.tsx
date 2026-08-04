"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";

type ToastVariant = "success" | "error";

type ToastProps = {
  variant: ToastVariant;
  message: string;
  onClose: () => void;
  autoCloseMs?: number;
};

const variantClasses: Record<ToastVariant, string> = {
  success: "border-success bg-success-bg text-success",
  error: "border-error bg-error-bg text-error",
};

export function Toast({ variant, message, onClose, autoCloseMs = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(timer);
  }, [onClose, autoCloseMs]);

  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-3 rounded-sm border px-4 py-3 text-sm font-medium shadow-sm",
        variantClasses[variant],
      )}
    >
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer la notification"
        className="text-current opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
