"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { MediaPicker, type UploadedMedia } from "@/components/admin/MediaPicker";

export function CoverImagePicker({
  initialCover,
  name = "coverId",
  label = "Image de couverture",
}: {
  initialCover?: { id: string; url: string; alt: string } | null;
  name?: string;
  label?: string;
}) {
  const [cover, setCover] = useState<UploadedMedia | null>(
    initialCover
      ? { ...initialCover, width: 0, height: 0 }
      : null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input type="hidden" name={name} value={cover?.id ?? ""} />

      {cover ? (
        <div className="flex items-center gap-4">
          <Image
            src={cover.url}
            alt={cover.alt}
            width={96}
            height={64}
            className="h-16 w-24 rounded-sm border border-line object-cover"
          />
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(true)}>
              Changer l&rsquo;image
            </Button>
            <button
              type="button"
              onClick={() => setCover(null)}
              className="text-sm font-medium text-error hover:underline"
            >
              Retirer
            </button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="secondary" onClick={() => setModalOpen(true)}>
          Choisir une image
        </Button>
      )}

      <MediaPicker
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={label}
        confirmLabel="Choisir"
        onConfirm={(media) => {
          setCover(media);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
