"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { CoverImagePicker } from "@/components/admin/CoverImagePicker";
import { slugify } from "@/lib/slugify";
import type { AlbumActionState } from "@/lib/actions/albums";
import { deleteAlbum } from "@/lib/actions/albums";

type AlbumFormProps = {
  mode: "create" | "edit";
  action: (
    state: AlbumActionState | null,
    formData: FormData,
  ) => Promise<AlbumActionState>;
  album?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    cover: { id: string; url: string; alt: string } | null;
  };
};

export function AlbumForm({ mode, action, album }: AlbumFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  const [title, setTitle] = useState(album?.title ?? "");
  const [slug, setSlug] = useState(album?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dismissedState, setDismissedState] = useState<AlbumActionState | null>(null);
  const showSuccessToast = state?.ok === true && state !== dismissedState;

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-6">
        <Input
          id="album-title"
          name="title"
          label="Titre de l'album"
          required
          value={title}
          onChange={(event) => {
            const value = event.target.value;
            setTitle(value);
            if (!slugEdited) setSlug(slugify(value));
          }}
        />
        <Input
          id="album-slug"
          name="slug"
          label="Slug"
          helperText="Utilisé dans l'adresse de l'album. Modifiable."
          required
          value={slug}
          error={state && !state.ok ? state.fieldErrors?.slug : undefined}
          onChange={(event) => {
            setSlugEdited(true);
            setSlug(event.target.value);
          }}
        />
        <Textarea
          id="album-description"
          name="description"
          label="Description"
          helperText="Optionnel."
          rows={3}
          defaultValue={album?.description ?? undefined}
        />
        <CoverImagePicker initialCover={album?.cover} name="coverId" label="Couverture" />

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
                ? "Créer l'album"
                : "Enregistrer les modifications"}
          </Button>
          {mode === "edit" && album && (
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="text-sm font-medium text-error hover:underline"
            >
              Supprimer l&rsquo;album
            </button>
          )}
        </div>
      </form>

      {mode === "edit" && album && (
        <Modal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Supprimer l'album"
        >
          <p className="text-sm text-muted">
            Cette action est définitive et supprime aussi toutes les photos de
            l&rsquo;album « {album.title} ». Voulez-vous continuer ?
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => deleteAlbum(album.id)}>
              Supprimer l&rsquo;album
            </Button>
          </div>
        </Modal>
      )}

      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-10">
          <Toast
            variant="success"
            message={mode === "create" ? "Album créé." : "Album enregistré."}
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
