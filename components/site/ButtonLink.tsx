import type { AnchorHTMLAttributes, ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { buttonBaseClasses, buttonVariantClasses, type ButtonVariant } from "@/components/ui/Button";

// Variante locale-consciente de components/ui/ButtonLink, réservée au site
// public (sous [locale]) : préfixe automatiquement les liens avec /fr ou /en.
type SiteButtonLinkProps = ComponentProps<typeof Link> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    variant?: ButtonVariant;
    className?: string;
    children: ReactNode;
  };

export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: SiteButtonLinkProps) {
  return (
    <Link
      className={cn(buttonBaseClasses, buttonVariantClasses[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
