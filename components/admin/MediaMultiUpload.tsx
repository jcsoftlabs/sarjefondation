"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type PendingFile = {
  file: File;
  alt: string;
  status: "idle" | "uploading" | "done" | "error";
  error?: string;
};

export function MediaMultiUpload() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const additions = Array.from(fileList).map((file) => ({
      file,
      alt: "",
      status: "idle" as const,
    }));
    setFiles((current) => [...current, ...additions]);
  }

  function reset() {
    setFiles([]);
    setSubmitting(false);
  }

  const allAltFilled = files.length > 0 && files.every((f) => f.alt.trim().length > 0);

  async function handleUploadAll() {
    setSubmitting(true);
    const updated = [...files];
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === "done") continue;
      updated[i] = { ...updated[i], status: "uploading" };
      setFiles([...updated]);

      try {
        const formData = new FormData();
        formData.set("file", updated[i].file);
        formData.set("alt", updated[i].alt.trim());
        const response = await fetch("/api/upload", { method: "POST", body: formData });
        const result = await response.json();
        if (!response.ok || !result.ok) {
          updated[i] = { ...updated[i], status: "error", error: result.error };
        } else {
          updated[i] = { ...updated[i], status: "done" };
        }
      } catch {
        updated[i] = { ...updated[i], status: "error", error: "Échec de l'envoi." };
      }
      setFiles([...updated]);
    }
    setSubmitting(false);

    if (updated.every((f) => f.status === "done")) {
      setOpen(false);
      reset();
      router.refresh();
    }
  }

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Ajouter des images
      </Button>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        title="Ajouter des images"
        size="lg"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="multi-upload-file" className="text-sm font-medium text-ink">
              Images (JPEG, PNG ou WEBP, 5 Mo max chacune)
            </label>
            <input
              id="multi-upload-file"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => addFiles(event.target.files)}
              className="cursor-pointer text-sm text-muted file:mr-3 file:cursor-pointer file:rounded-sm file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-accent-deep"
            />
          </div>

          {files.length > 0 && (
            <div className="flex max-h-72 flex-col gap-3 overflow-y-auto">
              {files.map((item, index) => (
                <div
                  key={`${item.file.name}-${index}`}
                  className="flex items-center gap-3 rounded-sm border border-line p-3"
                >
                  <span className="flex-1 truncate text-sm text-ink">{item.file.name}</span>
                  <div className="w-48">
                    <Input
                      id={`multi-upload-alt-${index}`}
                      label="Texte alternatif"
                      value={item.alt}
                      disabled={item.status === "uploading" || item.status === "done"}
                      onChange={(event) => {
                        const value = event.target.value;
                        setFiles((current) =>
                          current.map((f, i) => (i === index ? { ...f, alt: value } : f)),
                        );
                      }}
                    />
                  </div>
                  <span className="w-20 text-xs text-muted">
                    {item.status === "uploading" && "Envoi…"}
                    {item.status === "done" && "Envoyé"}
                    {item.status === "error" && (
                      <span className="text-error">{item.error ?? "Erreur"}</span>
                    )}
                  </span>
                  {item.status === "idle" && (
                    <button
                      type="button"
                      aria-label="Retirer"
                      onClick={() =>
                        setFiles((current) => current.filter((_, i) => i !== index))
                      }
                      className="text-xs text-muted hover:text-error"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={!allAltFilled || submitting}
              onClick={handleUploadAll}
            >
              {submitting ? "Envoi…" : "Envoyer"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
