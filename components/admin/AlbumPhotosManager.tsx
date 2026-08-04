"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { MediaPicker, type UploadedMedia } from "@/components/admin/MediaPicker";
import { ReorderButtons } from "@/components/admin/ReorderButtons";
import {
  addGalleryPhoto,
  updateGalleryPhotoCaption,
  deleteGalleryPhoto,
  moveGalleryPhoto,
} from "@/lib/actions/gallery";

type GalleryPhoto = {
  id: string;
  caption: string | null;
  photo: { id: string; url: string; alt: string };
};

export function AlbumPhotosManager({
  albumId,
  photos,
}: {
  albumId: string;
  photos: GalleryPhoto[];
}) {
  const router = useRouter();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleAdd(media: UploadedMedia) {
    setPickerOpen(false);
    setPending(true);
    await addGalleryPhoto(albumId, media.id, "");
    setPending(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-h3 text-ink">Photos de l&rsquo;album</h2>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setPickerOpen(true)}
          disabled={pending}
        >
          Ajouter une photo
        </Button>
      </div>

      {photos.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Aucune photo dans cet album pour le moment.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {photos.map((item, index) => (
            <PhotoRow
              key={item.id}
              photo={item}
              isFirst={index === 0}
              isLast={index === photos.length - 1}
            />
          ))}
        </div>
      )}

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Ajouter une photo à l'album"
        confirmLabel="Ajouter"
        onConfirm={handleAdd}
      />
    </div>
  );
}

function PhotoRow({
  photo,
  isFirst,
  isLast,
}: {
  photo: GalleryPhoto;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [caption, setCaption] = useState(photo.caption ?? "");
  const [savingCaption, setSavingCaption] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  async function handleCaptionBlur() {
    if (caption === (photo.caption ?? "")) return;
    setSavingCaption(true);
    await updateGalleryPhotoCaption(photo.id, caption);
    setSavingCaption(false);
    router.refresh();
  }

  async function handleDelete() {
    await deleteGalleryPhoto(photo.id);
    setDeleteModalOpen(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4 rounded-sm border border-line p-3">
      <ReorderButtons id={photo.id} isFirst={isFirst} isLast={isLast} move={moveGalleryPhoto} />
      <Image
        src={photo.photo.url}
        alt={photo.photo.alt}
        width={72}
        height={54}
        className="h-14 w-18 rounded-sm border border-line object-cover"
      />
      <div className="flex-1">
        <Input
          id={`photo-caption-${photo.id}`}
          label="Légende"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          onBlur={handleCaptionBlur}
          disabled={savingCaption}
        />
      </div>
      <button
        type="button"
        onClick={() => setDeleteModalOpen(true)}
        className="text-xs font-medium text-error hover:underline"
      >
        Retirer
      </button>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Retirer cette photo"
      >
        <p className="text-sm text-muted">
          Cette action est définitive. Voulez-vous vraiment retirer cette
          photo de l&rsquo;album ?
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Retirer cette photo
          </Button>
        </div>
      </Modal>
    </div>
  );
}
