import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empêche Turbopack de remonter jusqu'à un package-lock.json présent
  // dans le dossier utilisateur et de s'y méprendre pour la racine du projet.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
