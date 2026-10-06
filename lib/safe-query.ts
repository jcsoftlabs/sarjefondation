// Exécute une requête en base et renvoie `fallback` si la base est
// injoignable : les pages publiques restent affichables (textes fixes,
// boutons de don) avec leurs sections dynamiques masquées, au lieu de
// basculer entièrement sur la page d'erreur.
export async function safeQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error("Base de données injoignable, contenu de repli utilisé", error);
    return fallback;
  }
}
