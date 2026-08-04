"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export type UploadedMedia = {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
};

export function ImageModal({
  open,
  onClose,
  onConfirm,
  title = "Insérer une image",
  confirmLabel = "Insérer",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (media: UploadedMedia) => void;
  title?: string;
  confirmLabel?: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setFile(null);
    setAlt("");
    setError(null);
  }

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
      onConfirm(result.media as UploadedMedia);
      reset();
    } catch {
      setError("Échec de l'envoi de l'image.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title={title}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="image-file" className="text-sm font-medium text-ink">
            Image (JPEG, PNG ou WEBP, 5 Mo max)
          </label>
          <input
            id="image-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="text-sm text-ink"
            required
          />
        </div>
        <Input
          id="image-alt"
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
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? "Envoi…" : confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
