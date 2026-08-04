"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { CoverImagePicker } from "@/components/admin/CoverImagePicker";
import type { TestimonialActionState } from "@/lib/actions/testimonials";
import { deleteTestimonial } from "@/lib/actions/testimonials";

type TestimonialFormProps = {
  mode: "create" | "edit";
  action: (
    state: TestimonialActionState | null,
    formData: FormData,
  ) => Promise<TestimonialActionState>;
  testimonial?: {
    id: string;
    author: string;
    role: string | null;
    quote: string;
    photo: { id: string; url: string; alt: string } | null;
  };
};

export function TestimonialForm({ mode, action, testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dismissedState, setDismissedState] = useState<TestimonialActionState | null>(null);
  const showSuccessToast = state?.ok === true && state !== dismissedState;

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-6">
        <Input
          id="testimonial-author"
          name="author"
          label="Nom"
          required
          defaultValue={testimonial?.author}
        />
        <Input
          id="testimonial-role"
          name="role"
          label="Rôle"
          helperText="Optionnel — ex. « Parent d'un enfant accompagné »."
          defaultValue={testimonial?.role ?? undefined}
        />
        <Textarea
          id="testimonial-quote"
          name="quote"
          label="Témoignage"
          required
          rows={5}
          defaultValue={testimonial?.quote}
        />
        <CoverImagePicker
          initialCover={testimonial?.photo}
          name="photoId"
          label="Photo"
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
                ? "Ajouter le témoignage"
                : "Enregistrer les modifications"}
          </Button>
          {mode === "edit" && testimonial && (
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="text-sm font-medium text-error hover:underline"
            >
              Supprimer ce témoignage
            </button>
          )}
        </div>
      </form>

      {mode === "edit" && testimonial && (
        <Modal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Supprimer ce témoignage"
        >
          <p className="text-sm text-muted">
            Cette action est définitive. Voulez-vous vraiment supprimer le
            témoignage de « {testimonial.author} » ?
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => deleteTestimonial(testimonial.id)}>
              Supprimer ce témoignage
            </Button>
          </div>
        </Modal>
      )}

      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-10">
          <Toast
            variant="success"
            message={mode === "create" ? "Témoignage ajouté." : "Modifications enregistrées."}
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
