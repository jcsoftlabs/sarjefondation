type TiptapNode = { type?: string; text?: string; content?: TiptapNode[] };

// Un document Tiptap "vide" (un seul paragraphe sans texte) doit être traité
// comme une absence de traduction, pas comme une traduction vide — sinon le
// repli vers le français ne se déclenche jamais (localize() ne teste que la
// présence de la valeur, pas son contenu).
export function isEmptyTiptapDoc(doc: unknown): boolean {
  if (!doc || typeof doc !== "object") return true;
  const node = doc as TiptapNode;
  const hasText = (n: TiptapNode): boolean => {
    if (n.text && n.text.trim()) return true;
    return (n.content ?? []).some(hasText);
  };
  return !hasText(node);
}
