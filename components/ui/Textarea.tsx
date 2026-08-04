import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
};

export function Textarea({
  label,
  error,
  helperText,
  id,
  className,
  disabled,
  rows = 4,
  ...props
}: TextareaProps) {
  const helperId = `${id}-helper`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error || helperText ? helperId : undefined}
        className={cn(
          "resize-y rounded-sm border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-muted disabled:cursor-not-allowed disabled:bg-line/40 disabled:text-muted",
          error && "border-error",
          className,
        )}
        {...props}
      />
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
