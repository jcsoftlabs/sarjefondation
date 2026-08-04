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
import type { ArticleActionState } from "@/lib/actions/articles";
import { deleteArticle } from "@/lib/actions/articles";

type ArticleFormProps = {
  mode: "create" | "edit";
  action: (
    state: ArticleActionState | null,
    formData: FormData,
  ) => Promise<ArticleActionState>;
  article?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: JSONContent;
    status: "DRAFT" | "PUBLISHED";
    cover: { id: string; url: string; alt: string } | null;
  };
};

export function ArticleForm({ mode, action, article }: ArticleFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [content, setContent] = useState<JSONContent>(
    article?.content ?? { type: "doc", content: [{ type: "paragraph" }] },
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dismissedState, setDismissedState] = useState<ArticleActionState | null>(null);
  const showSuccessToast = state?.ok === true && state !== dismissedState;

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-6">
        <Input
          id="article-title"
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
          id="article-slug"
          name="slug"
          label="Slug"
          helperText="Utilisé dans l'adresse de l'article. Modifiable."
          required
          value={slug}
          error={state && !state.ok ? state.fieldErrors?.slug : undefined}
          onChange={(event) => {
            setSlugEdited(true);
            setSlug(event.target.value);
          }}
        />
        <Textarea
          id="article-excerpt"
          name="excerpt"
          label="Résumé"
          helperText="Affiché dans la liste des actualités."
          required
          rows={3}
          defaultValue={article?.excerpt}
        />
        <CoverImagePicker initialCover={article?.cover} />
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink">Contenu</span>
          <TiptapEditor
            initialContent={article?.content ?? null}
            onChange={setContent}
          />
          <input type="hidden" name="content" value={JSON.stringify(content)} />
        </div>
        <Select
          id="article-status"
          name="status"
          label="Statut"
          defaultValue={article?.status ?? "DRAFT"}
          options={[
            { value: "DRAFT", label: "Brouillon" },
            { value: "PUBLISHED", label: "Publié" },
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
                  ? "Créer l'article"
                  : "Enregistrer les modifications"}
            </Button>
            {mode === "edit" && article && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => window.open(`/dashboard/articles/${article.id}/apercu`, "_blank")}
              >
                Aperçu
              </Button>
            )}
          </div>
          {mode === "edit" && article && (
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="text-sm font-medium text-error hover:underline"
            >
              Supprimer l&rsquo;article
            </button>
          )}
        </div>
      </form>

      {mode === "edit" && article && (
        <Modal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Supprimer l'article"
        >
          <p className="text-sm text-muted">
            Cette action est définitive. Voulez-vous vraiment supprimer «
            {article.title} » ?
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={() => deleteArticle(article.id)}
            >
              Supprimer l&rsquo;article
            </Button>
          </div>
        </Modal>
      )}

      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-10">
          <Toast
            variant="success"
            message={
              mode === "create" ? "Article créé." : "Article enregistré."
            }
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
