"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { CoverImagePicker } from "@/components/admin/CoverImagePicker";
import type { GalleryPhotoActionState } from "@/lib/actions/gallery";
import { deleteGalleryPhoto } from "@/lib/actions/gallery";

type GalleryPhotoFormProps = {
  mode: "create" | "edit";
  action: (
    state: GalleryPhotoActionState | null,
    formData: FormData,
  ) => Promise<GalleryPhotoActionState>;
  galleryPhoto?: {
    id: string;
    caption: string | null;
    photo: { id: string; url: string; alt: string };
  };
};

export function GalleryPhotoForm({ mode, action, galleryPhoto }: GalleryPhotoFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dismissedState, setDismissedState] = useState<GalleryPhotoActionState | null>(null);
  const showSuccessToast = state?.ok === true && state !== dismissedState;

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-6">
        <CoverImagePicker
          initialCover={galleryPhoto?.photo}
          name="photoId"
          label="Photo"
        />
        <Input
          id="gallery-caption"
          name="caption"
          label="Légende"
          helperText="Optionnel."
          defaultValue={galleryPhoto?.caption ?? undefined}
        />

        {state && !state.ok && (
          <p role="alert" className="text-sm text-error">
            {state.error}
          </p>
        )}

        <div className="flex items-center justify-between gap-4">
          <Button type="submit" variant="primary" disabled={pending}>
            {pending
              ? "Enregistrement…"
              : mode === "create"
                ? "Ajouter la photo"
                : "Enregistrer les modifications"}
          </Button>
          {mode === "edit" && galleryPhoto && (
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="text-sm font-medium text-error hover:underline"
            >
              Retirer cette photo
            </button>
          )}
        </div>
      </form>

      {mode === "edit" && galleryPhoto && (
        <Modal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Retirer cette photo"
        >
          <p className="text-sm text-muted">
            Cette action est définitive. Voulez-vous vraiment retirer cette
            photo de la galerie ?
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => deleteGalleryPhoto(galleryPhoto.id)}>
              Retirer cette photo
            </Button>
          </div>
        </Modal>
      )}

      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-10">
          <Toast
            variant="success"
            message={mode === "create" ? "Photo ajoutée." : "Modifications enregistrées."}
            onClose={() => {
              setDismissedState(state);
              router.refresh();
            }}
          />
        </div>
      )}
    </div>
  );
}
