export function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return (
    <div>
      <h1 className="font-display text-h2 text-ink">{title}</h1>
      <div className="mt-6 rounded-md border border-dashed border-line p-8 text-center">
        <p className="text-body text-muted">
          Ce module arrive en {phase} du projet.
        </p>
      </div>
    </div>
  );
}
