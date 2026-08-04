# Fondation Sarje — sarjefondation.com

Site institutionnel et CMS sur mesure de la Fondation Sarje. Voir
[PLAN-IMPLEMENTATION-sarjefondation.md](./PLAN-IMPLEMENTATION-sarjefondation.md)
pour le contexte, la stack, le modèle de données et les phases d'exécution —
à lire avant toute contribution.

## Stack

Next.js 16 (App Router, TypeScript strict), Tailwind CSS, PostgreSQL (Railway)
via Prisma 7, Cloudinary pour les médias, Zod pour la validation.

## Démarrage

1. Copier `.env.example` en `.env` et renseigner les valeurs (base de données,
   Cloudinary, etc.).
2. Installer les dépendances :

   ```bash
   npm install
   ```

3. Générer le client Prisma et appliquer les migrations :

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Lancer le serveur de développement :

   ```bash
   npm run dev
   ```

   Le site est disponible sur [http://localhost:3000](http://localhost:3000).

## Commandes utiles

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Sert le build de production |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (écrit les fichiers) |
| `npm run typecheck` | Vérification TypeScript sans émission |
| `npm run prisma:migrate` | Nouvelle migration Prisma en développement |
| `npm run prisma:studio` | Interface Prisma Studio |
| `npm run create-admin` | Crée un compte admin (mot de passe temporaire affiché en console) |

## Notes

- Le client Prisma est généré dans `app/generated/prisma` (non versionné,
  régénéré par `npx prisma generate`, exécuté automatiquement après
  `npm install`).
- Aucune page d'inscription publique : les comptes admin se créent uniquement
  via `scripts/create-admin.ts`.
