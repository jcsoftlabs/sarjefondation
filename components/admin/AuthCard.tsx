import Image from "next/image";
import type { ReactNode } from "react";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Image src="/logo-fondation.png" alt="Fondation Sarje" width={96} height={96} />
        </div>
        <h1 className="mt-6 text-center font-display text-h2 text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-center text-sm text-muted">{description}</p>
        )}
        <div className="mt-8 rounded-md border border-line bg-paper p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
