"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-b border-line pb-10">
      <h2 className="font-display text-h2 text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-12 md:px-6">
      <header>
        <h1 className="font-display text-h1 text-ink">Composants — page de démonstration</h1>
        <p className="mt-2 text-body text-muted">
          Vérification des états par défaut, survol, focus, désactivé et
          erreur pour chaque composant de <code>components/ui</code>.
        </p>
      </header>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Publier</Button>
          <Button variant="secondary">Enregistrer les modifications</Button>
          <Button variant="primary" disabled>
            Envoi en cours…
          </Button>
        </div>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="neutral">Brouillon</Badge>
          <Badge variant="accent">En vedette</Badge>
          <Badge variant="success">Publié</Badge>
          <Badge variant="error">Erreur</Badge>
        </div>
      </Section>

      <Section title="Card">
        <Card>
          <h3 className="font-display text-h3 text-ink">Titre de la carte</h3>
          <p className="mt-2 text-sm text-muted">
            Contenu court illustrant l&rsquo;usage de la carte comme conteneur.
          </p>
        </Card>
      </Section>

      <Section title="Input">
        <div className="flex flex-col gap-5 md:max-w-sm">
          <Input id="demo-input-default" label="Nom complet" placeholder="Jean Baptiste" />
          <Input
            id="demo-input-helper"
            label="Adresse email"
            placeholder="nom@exemple.com"
            helperText="Utilisée uniquement pour vous répondre."
          />
          <Input
            id="demo-input-error"
            label="Téléphone"
            defaultValue="123"
            error="Ce numéro ne semble pas valide."
          />
          <Input id="demo-input-disabled" label="Identifiant" defaultValue="SARJE-001" disabled />
        </div>
      </Section>

      <Section title="Textarea">
        <div className="md:max-w-sm">
          <Textarea
            id="demo-textarea"
            label="Message"
            placeholder="Votre message pour la fondation"
          />
        </div>
      </Section>

      <Section title="Select">
        <div className="md:max-w-sm">
          <Select
            id="demo-select"
            label="Sujet"
            options={[
              { value: "benevolat", label: "Bénévolat" },
              { value: "partenariat", label: "Partenariat" },
              { value: "don", label: "Don" },
            ]}
          />
        </div>
      </Section>

      <Section title="Modal">
        <Button variant="secondary" onClick={() => setModalOpen(true)}>
          Ouvrir la fenêtre modale
        </Button>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirmer la suppression">
          <p className="text-sm text-muted">
            Cette action est définitive. Voulez-vous vraiment supprimer cet
            élément ?
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Supprimer l&rsquo;article
            </Button>
          </div>
        </Modal>
      </Section>

      <Section title="Toast">
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary" onClick={() => setSuccessToastOpen(true)}>
            Déclencher un toast de succès
          </Button>
          <Button variant="secondary" onClick={() => setErrorToastOpen(true)}>
            Déclencher un toast d&rsquo;erreur
          </Button>
        </div>
        <div className="flex flex-col gap-3 md:max-w-sm">
          {successToastOpen && (
            <Toast
              variant="success"
              message="Article publié avec succès."
              onClose={() => setSuccessToastOpen(false)}
            />
          )}
          {errorToastOpen && (
            <Toast
              variant="error"
              message="Impossible d'enregistrer l'article."
              onClose={() => setErrorToastOpen(false)}
            />
          )}
        </div>
      </Section>
    </div>
  );
}
