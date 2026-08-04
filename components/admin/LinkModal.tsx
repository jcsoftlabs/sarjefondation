"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LinkModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (url: string) => void;
}) {
  const [url, setUrl] = useState("");

  return (
    <Modal open={open} onClose={onClose} title="Insérer un lien">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!url.trim()) return;
          onConfirm(url.trim());
          setUrl("");
        }}
      >
        <Input
          id="link-url"
          label="Adresse du lien"
          placeholder="https://"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          autoFocus
          required
        />
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            Insérer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
