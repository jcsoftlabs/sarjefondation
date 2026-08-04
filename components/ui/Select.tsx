import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
};

export function Select({
  label,
  options,
  error,
  helperText,
  id,
  className,
  disabled,
  ...props
}: SelectProps) {
  const helperId = `${id}-helper`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error || helperText ? helperId : undefined}
        className={cn(
          "rounded-sm border border-line bg-paper px-3.5 py-2.5 text-sm text-ink disabled:cursor-not-allowed disabled:bg-line/40 disabled:text-muted",
          error && "border-error",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
