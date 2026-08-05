"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { CoverImagePicker } from "@/components/admin/CoverImagePicker";
import type { TeamMemberActionState } from "@/lib/actions/team";
import { deleteTeamMember } from "@/lib/actions/team";

type TeamMemberFormProps = {
  mode: "create" | "edit";
  action: (
    state: TeamMemberActionState | null,
    formData: FormData,
  ) => Promise<TeamMemberActionState>;
  member?: {
    id: string;
    name: string;
    role: string;
    roleEn: string | null;
    bio: string | null;
    bioEn: string | null;
    photo: { id: string; url: string; alt: string } | null;
  };
};

export function TeamMemberForm({ mode, action, member }: TeamMemberFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dismissedState, setDismissedState] = useState<TeamMemberActionState | null>(null);
  const showSuccessToast = state?.ok === true && state !== dismissedState;

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-6">
        <Input id="member-name" name="name" label="Nom" required defaultValue={member?.name} />
        <Input id="member-role" name="role" label="Rôle" required defaultValue={member?.role} />
        <Textarea
          id="member-bio"
          name="bio"
          label="Biographie"
          helperText="Optionnel."
          rows={4}
          defaultValue={member?.bio ?? undefined}
        />
        <CoverImagePicker
          initialCover={member?.photo}
          name="photoId"
          label="Photo"
        />

        <div className="flex flex-col gap-6 rounded-md border border-line bg-paper p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Version anglaise (optionnelle)
          </p>
          <Input
            id="member-role-en"
            name="roleEn"
            label="Rôle (EN)"
            defaultValue={member?.roleEn ?? undefined}
          />
          <Textarea
            id="member-bio-en"
            name="bioEn"
            label="Biographie (EN)"
            rows={4}
            defaultValue={member?.bioEn ?? undefined}
          />
        </div>

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
                ? "Ajouter le membre"
                : "Enregistrer les modifications"}
          </Button>
          {mode === "edit" && member && (
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="text-sm font-medium text-error hover:underline"
            >
              Retirer ce membre
            </button>
          )}
        </div>
      </form>

      {mode === "edit" && member && (
        <Modal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Retirer ce membre"
        >
          <p className="text-sm text-muted">
            Cette action est définitive. Voulez-vous vraiment retirer «{" "}
            {member.name} » de l&rsquo;équipe ?
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => deleteTeamMember(member.id)}>
              Retirer ce membre
            </Button>
          </div>
        </Modal>
      )}

      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-10">
          <Toast
            variant="success"
            message={mode === "create" ? "Membre ajouté." : "Modifications enregistrées."}
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
