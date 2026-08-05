"use client";

import { useEffect } from "react";

// Le <html lang> racine est statique ("fr") pour ne pas forcer tout le site
// en rendu dynamique — on le corrige côté client après hydratation pour les
// lecteurs d'écran et les outils d'accessibilité.
export function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
