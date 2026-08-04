"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import type { ImpactStatActionState } from "@/lib/actions/impact";
import { deleteImpactStat } from "@/lib/actions/impact";

type ImpactStatFormProps = {
  mode: "create" | "edit";
  action: (
    state: ImpactStatActionState | null,
    formData: FormData,
  ) => Promise<ImpactStatActionState>;
  stat?: { id: string; label: string; value: string };
};

export function ImpactStatForm({ mode, action, stat }: ImpactStatFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dismissedState, setDismissedState] = useState<ImpactStatActionState | null>(null);
  const showSuccessToast = state?.ok === true && state !== dismissedState;

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-6">
        <Input
          id="stat-value"
          name="value"
          label="Valeur"
          helperText="Ex. « 1 240 » ou « 96% »."
          required
          defaultValue={stat?.value}
        />
        <Input
          id="stat-label"
          name="label"
          label="Libellé"
          helperText="Ex. « enfants accompagnés depuis la création de la fondation »."
          required
          defaultValue={stat?.label}
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
                ? "Ajouter le chiffre"
                : "Enregistrer les modifications"}
          </Button>
          {mode === "edit" && stat && (
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="text-sm font-medium text-error hover:underline"
            >
              Supprimer ce chiffre
            </button>
          )}
        </div>
      </form>

      {mode === "edit" && stat && (
        <Modal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Supprimer ce chiffre"
        >
          <p className="text-sm text-muted">
            Cette action est définitive. Voulez-vous vraiment supprimer «{" "}
            {stat.value} {stat.label} » ?
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => deleteImpactStat(stat.id)}>
              Supprimer ce chiffre
            </Button>
          </div>
        </Modal>
      )}

      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-10">
          <Toast
            variant="success"
            message={mode === "create" ? "Chiffre ajouté." : "Modifications enregistrées."}
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
