"use client";

import { useActionState, useState } from "react";
import type { JSONContent } from "@tiptap/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import { CoverImagePicker } from "@/components/admin/CoverImagePicker";
import { slugify } from "@/lib/slugify";
import type { ProgramActionState } from "@/lib/actions/programs";
import { deleteProgram } from "@/lib/actions/programs";

type ProgramFormProps = {
  mode: "create" | "edit";
  action: (
    state: ProgramActionState | null,
    formData: FormData,
  ) => Promise<ProgramActionState>;
  program?: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: JSONContent;
    isActive: boolean;
    cover: { id: string; url: string; alt: string } | null;
  };
};

export function ProgramForm({ mode, action, program }: ProgramFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  const [title, setTitle] = useState(program?.title ?? "");
  const [slug, setSlug] = useState(program?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [content, setContent] = useState<JSONContent>(
    program?.content ?? { type: "doc", content: [{ type: "paragraph" }] },
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dismissedState, setDismissedState] = useState<ProgramActionState | null>(null);
  const showSuccessToast = state?.ok === true && state !== dismissedState;

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-6">
        <Input
          id="program-title"
          name="title"
          label="Titre"
          required
          value={title}
          onChange={(event) => {
            const value = event.target.value;
            setTitle(value);
            if (!slugEdited) setSlug(slugify(value));
          }}
        />
        <Input
          id="program-slug"
          name="slug"
          label="Slug"
          helperText="Utilisé dans l'adresse du programme. Modifiable."
          required
          value={slug}
          error={state && !state.ok ? state.fieldErrors?.slug : undefined}
          onChange={(event) => {
            setSlugEdited(true);
            setSlug(event.target.value);
          }}
        />
        <Textarea
          id="program-summary"
          name="summary"
          label="Résumé"
          helperText="Affiché dans la liste des programmes."
          required
          rows={3}
          defaultValue={program?.summary}
        />
        <CoverImagePicker initialCover={program?.cover} />
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink">Contenu</span>
          <TiptapEditor initialContent={program?.content ?? null} onChange={setContent} />
          <input type="hidden" name="content" value={JSON.stringify(content)} />
        </div>
        <Select
          id="program-isActive"
          name="isActive"
          label="Statut"
          defaultValue={program?.isActive === false ? "false" : "true"}
          options={[
            { value: "true", label: "Actif" },
            { value: "false", label: "Inactif" },
          ]}
        />

        {state && !state.ok && (
          <p role="alert" className="text-sm text-error">
            {state.error}
          </p>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-3">
            <Button type="submit" variant="primary" disabled={pending}>
              {pending
                ? "Enregistrement…"
                : mode === "create"
                  ? "Créer le programme"
                  : "Enregistrer les modifications"}
            </Button>
            {mode === "edit" && program && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => window.open(`/dashboard/programmes/${program.id}/apercu`, "_blank")}
              >
                Aperçu
              </Button>
            )}
          </div>
          {mode === "edit" && program && (
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="text-sm font-medium text-error hover:underline"
            >
              Supprimer le programme
            </button>
          )}
        </div>
      </form>

      {mode === "edit" && program && (
        <Modal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Supprimer le programme"
        >
          <p className="text-sm text-muted">
            Cette action est définitive. Voulez-vous vraiment supprimer «{" "}
            {program.title} » ?
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => deleteProgram(program.id)}>
              Supprimer le programme
            </Button>
          </div>
        </Modal>
      )}

      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-10">
          <Toast
            variant="success"
            message={mode === "create" ? "Programme créé." : "Programme enregistré."}
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
