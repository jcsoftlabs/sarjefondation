"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { searchMedia } from "@/lib/actions/media";

export type UploadedMedia = {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
};

type Tab = "library" | "upload";

export function MediaPicker({
  open,
  onClose,
  onConfirm,
  title = "Choisir une image",
  confirmLabel = "Choisir",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (media: UploadedMedia) => void;
  title?: string;
  confirmLabel?: string;
}) {
  const [tab, setTab] = useState<Tab>("library");

  return (
    <Modal
      open={open}
      onClose={() => {
        setTab("library");
        onClose();
      }}
      title={title}
      size="lg"
    >
      <div className="flex gap-1 border-b border-line pb-3">
        <TabButton active={tab === "library"} onClick={() => setTab("library")}>
          Bibliothèque
        </TabButton>
        <TabButton active={tab === "upload"} onClick={() => setTab("upload")}>
          Envoyer une image
        </TabButton>
      </div>

      <div className="pt-4">
        {tab === "library" ? (
          <LibraryPane
            onSelect={(media) => {
              onConfirm(media);
              setTab("library");
            }}
          />
        ) : (
          <UploadPane
            confirmLabel={confirmLabel}
            onCancel={onClose}
            onUploaded={(media) => {
              onConfirm(media);
              setTab("library");
            }}
          />
        )}
      </div>
    </Modal>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-sm px-3 py-1.5 text-sm font-medium",
        active ? "bg-accent-soft text-accent-deep" : "text-muted hover:bg-line/40",
      )}
    >
      {children}
    </button>
  );
}

function LibraryPane({ onSelect }: { onSelect: (media: UploadedMedia) => void }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<UploadedMedia[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      searchMedia(query || undefined).then((results) => {
        if (!cancelled) setItems(results);
      });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div>
      <Input
        id="media-picker-search"
        label="Rechercher par texte alternatif"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="mt-4 grid max-h-80 grid-cols-4 gap-3 overflow-y-auto">
        {items === null && <p className="text-sm text-muted">Chargement…</p>}
        {items?.length === 0 && (
          <p className="col-span-4 text-sm text-muted">Aucune image trouvée.</p>
        )}
        {items?.map((media) => (
          <button
            type="button"
            key={media.id}
            onClick={() => onSelect(media)}
            className="group overflow-hidden rounded-sm border border-line focus-visible:outline-accent-deep"
            title={media.alt}
          >
            <Image
              src={media.url}
              alt={media.alt}
              width={140}
              height={100}
              className="h-20 w-full object-cover transition-opacity group-hover:opacity-80"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function UploadPane({
  confirmLabel,
  onCancel,
  onUploaded,
}: {
  confirmLabel: string;
  onCancel: () => void;
  onUploaded: (media: UploadedMedia) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!file || !alt.trim()) return;

    setPending(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("alt", alt.trim());
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setError(result.error ?? "Échec de l'envoi de l'image.");
        return;
      }
      onUploaded(result.media as UploadedMedia);
      setFile(null);
      setAlt("");
    } catch {
      setError("Échec de l'envoi de l'image.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="media-picker-file" className="text-sm font-medium text-ink">
          Image (JPEG, PNG ou WEBP, 5 Mo max)
        </label>
        <input
          id="media-picker-file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="cursor-pointer text-sm text-muted file:mr-3 file:cursor-pointer file:rounded-sm file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-accent-deep"
          required
        />
      </div>
      <Input
        id="media-picker-alt"
        label="Texte alternatif"
        helperText="Décrit l'image pour les lecteurs d'écran — obligatoire."
        value={alt}
        onChange={(event) => setAlt(event.target.value)}
        required
      />
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Envoi…" : confirmLabel}
        </Button>
      </div>
    </form>
  );
}
