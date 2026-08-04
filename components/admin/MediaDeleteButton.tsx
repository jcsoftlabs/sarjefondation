"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { getMediaUsage, deleteMedia } from "@/lib/actions/media";

type Usage = Awaited<ReturnType<typeof getMediaUsage>>;

export function MediaDeleteButton({ id, alt }: { id: string; alt: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleOpen() {
    setOpen(true);
    setUsage(await getMediaUsage(id));
  }

  async function handleConfirm() {
    setPending(true);
    const result = await deleteMedia(id);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOpen(false);
    router.refresh();
  }

  const usageItems = usage
    ? [
        ...usage.articles.map((a) => `Article « ${a.title} »`),
        ...usage.programs.map((p) => `Programme « ${p.title} »`),
        ...usage.teamMembers.map((m) => `Membre d'équipe « ${m.name} »`),
        ...usage.testimonials.map((t) => `Témoignage de « ${t.author} »`),
      ]
    : [];

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-xs font-medium text-error hover:underline"
      >
        Supprimer
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Supprimer ce média">
        {usage === null ? (
          <p className="text-sm text-muted">Vérification de l&rsquo;utilisation…</p>
        ) : (
          <>
            <p className="text-sm text-muted">
              Cette action est définitive et retirera « {alt} » de la bibliothèque.
            </p>
            {usageItems.length > 0 && (
              <div className="mt-3 rounded-sm border border-error/30 bg-error-bg p-3">
                <p className="text-sm font-medium text-error">
                  Ce média est actuellement utilisé par :
                </p>
                <ul className="mt-1 list-disc pl-5 text-sm text-error">
                  {usageItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-error">
                  La suppression retirera l&rsquo;image de ces éléments.
                </p>
              </div>
            )}
            {error && (
              <p role="alert" className="mt-3 text-sm text-error">
                {error}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleConfirm} disabled={pending}>
                {pending ? "Suppression…" : "Supprimer"}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
