"use client";

import { useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
};

export function Input({
  label,
  error,
  helperText,
  id,
  className,
  disabled,
  type,
  ...props
}: InputProps) {
  const helperId = `${id}-helper`;
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && revealed ? "text" : type}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error || helperText ? helperId : undefined}
          className={cn(
            "w-full rounded-sm border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-muted disabled:cursor-not-allowed disabled:bg-line/40 disabled:text-muted",
            isPassword && "pr-16",
            error && "border-error",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            disabled={disabled}
            className="absolute inset-y-0 right-0 px-3.5 text-xs font-medium text-muted hover:text-accent-deep disabled:cursor-not-allowed"
          >
            {revealed ? "Masquer" : "Afficher"}
          </button>
        )}
      </div>
      {(error || helperText) && (
        <p
          id={helperId}
          className={cn("text-xs", error ? "text-error" : "text-muted")}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}
