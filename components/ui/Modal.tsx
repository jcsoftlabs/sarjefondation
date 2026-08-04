"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  size?: "md" | "lg";
};

const sizeClasses = {
  md: "max-w-md",
  lg: "max-w-2xl",
};

export function Modal({ open, onClose, title, children, className, size = "md" }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Le portail ne peut rendre qu'après le montage côté client : le rendu
  // serveur n'a pas de document.body, un rendu conditionnel sur
  // typeof document produirait un écart d'hydratation.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Pattern standard de détection de montage client pour un portail :
    // ce setState ne peut pas être évité, il n'y a pas d'autre signal que
    // "l'effet a tourné" pour distinguer le premier rendu client du rendu
    // serveur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!mounted) return null;

  // Porté sur document.body : un <dialog> imbriqué dans un <form> (comme
  // dans l'éditeur d'article) produirait sinon un <form> invalide dans un
  // <form>.
  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      className={cn(
        "w-full rounded-md border border-line bg-paper p-6 text-ink backdrop:bg-ink/40",
        sizeClasses[size],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-h3">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="text-muted hover:text-accent-deep"
        >
          ✕
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </dialog>,
    document.body,
  );
}
