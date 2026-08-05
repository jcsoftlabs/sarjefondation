import type { Locale } from "next-intl";

// Retourne la valeur anglaise d'un champ traduisible si la locale est "en"
// et qu'une traduction existe, sinon replie sur la valeur française —
// le français reste toujours la source de vérité du contenu.
export function localize<T extends Record<string, unknown>, K extends string>(
  record: T,
  field: K,
  locale: Locale,
): T[K] {
  const enField = `${field}En` as keyof T;
  if (locale === "en") {
    const enValue = record[enField];
    if (enValue) return enValue as T[K];
  }
  return record[field as unknown as keyof T] as T[K];
}
