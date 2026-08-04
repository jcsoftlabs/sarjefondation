import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { buttonBaseClasses, buttonVariantClasses, type ButtonVariant } from "@/components/ui/Button";

type ButtonLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    variant?: ButtonVariant;
    className?: string;
    children: ReactNode;
  };

export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonBaseClasses, buttonVariantClasses[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
