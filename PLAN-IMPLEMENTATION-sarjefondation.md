# Plan d'implémentation — sarjefondation.com

> Document de référence pour Claude Code. À lire en entier avant d'écrire du code.
> Toute décision non couverte ici doit être posée en question à l'utilisateur, pas devinée.

---

## 1. Contexte

Site institutionnel de la **Fondation Sarje**, avec un **CMS développé sur mesure** (aucun CMS tiers : ni WordPress, ni Strapi, ni Sanity, ni Payload).

- Domaine de production : `sarjefondation.com`
- Hébergement : Vercel
- Langue du site : français (architecture prête pour l'ajout de l'anglais plus tard, mais **ne pas** implémenter l'i18n maintenant)
- Administration : **un seul rôle, `admin`**. Plusieurs comptes possibles, mais pas de hiérarchie de permissions.

### Objectifs du site
1. Crédibilité institutionnelle auprès des bailleurs et partenaires
2. Présentation des programmes et de l'impact
3. Publication d'actualités par la fondation, sans intervention du développeur
4. Point de contact et appel à l'engagement (bénévolat, partenariat, don)

### Contraintes non négociables
- **Performance sur connexion faible** : le public cible est majoritairement en Haïti, souvent en 3G sur mobile. Budget : LCP < 2,5 s en 3G simulée, JS initial < 150 ko gzip sur les pages publiques.
- **Accessibilité** : contraste AA minimum, navigation clavier complète, `alt` sur toutes les images, focus visible.
- **Le client n'est pas technique.** Le back-office doit être utilisable sans formation longue.

---

## 2. Stack

| Couche | Choix | Notes |
|---|---|---|
| Framework | Next.js 15, App Router, TypeScript strict | Server Components par défaut |
| Style | Tailwind CSS | Tokens définis en CSS variables, pas de valeurs en dur |
| Base de données | PostgreSQL | Neon ou Supabase, tier gratuit |
| ORM | Prisma | migrations versionnées dans le repo |
| Auth | Auth.js (NextAuth v5), provider Credentials | session JWT, cookie `httpOnly` |
| Hash mot de passe | bcrypt, coût 12 | |
| Éditeur riche | Tiptap | contenu stocké en **JSON**, jamais en HTML brut |
| Upload | UploadThing ou Cloudinary | pas de stockage sur le système de fichiers |
| Validation | Zod | côté serveur systématiquement, y compris quand le client valide déjà |
| Emails | Resend | formulaire de contact + réinitialisation de mot de passe |
| Mutations | Server Actions | pas de routes API sauf webhooks et upload |

**Interdits explicites :** pas de state management global (Redux, Zustand) ; pas de `useEffect` pour du fetch de données ; pas de bibliothèque de composants lourde (Material UI, Chakra) ; pas de dépendance ajoutée sans la justifier dans le commit.

---

## 3. Direction visuelle

À cadrer avant la phase 2, en s'appuyant sur la charte de la fondation si elle existe. **Demander le logo et les couleurs officielles avant de coder l'UI publique.** En leur absence, proposer une direction et la faire valider — ne pas partir sur des valeurs arbitraires.

Règles de fond :
- La sobriété est un argument de crédibilité pour une fondation. La générosité visuelle se concentre sur **les photos de terrain et les chiffres d'impact**, pas sur des dégradés ou des effets.
- Un seul élément signature mémorable (par exemple la manière dont les chiffres d'impact sont composés en page d'accueil). Le reste reste discipliné.
- Typographie : deux familles maximum, une pour les titres avec du caractère, une pour le texte courant, très lisible en petit corps sur mobile.
- Animations : réveil au scroll léger sur les sections, rien de plus. Respecter `prefers-reduced-motion`.
- Éviter les partis pris devenus génériques : fond crème avec serif contrasté et accent terracotta, fond quasi noir avec accent vert acide, mise en page « journal » avec filets d'un pixel. Si l'un de ces choix est retenu, il doit l'être parce que la charte de la fondation l'impose.

Tous les tokens (couleurs, échelle typographique, espacements, rayons) sont définis une seule fois dans `app/globals.css` sous forme de variables CSS et consommés via Tailwind.

---

## 4. Arborescence du site

```
/                        Accueil
/la-fondation            Mission, valeurs, histoire
/la-fondation/equipe     Équipe et gouvernance
/programmes              Liste des programmes
/programmes/[slug]       Détail d'un programme
/impact                  Chiffres, témoignages, galerie
/actualites              Liste des articles (paginée)
/actualites/[slug]       Article
/s-impliquer             Bénévolat, partenariat, don
/contact                 Formulaire + coordonnées
/mentions-legales
/politique-confidentialite

/login                   Connexion admin
/mot-de-passe-oublie
/reinitialiser/[token]
/dashboard               Back-office (protégé)
```

---

## 5. Modèle de données

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  lastLoginAt  DateTime?
  createdAt    DateTime @default(now())
  resetTokens  PasswordResetToken[]
  auditLogs    AuditLog[]
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  tokenHash String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  usedAt    DateTime?
}

model Article {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  excerpt     String
  content     Json                 // document Tiptap
  coverId     String?
  cover       Media?   @relation(fields: [coverId], references: [id])
  status      Status   @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Program {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  summary   String
  content   Json
  coverId   String?
  cover     Media?   @relation(fields: [coverId], references: [id])
  order     Int      @default(0)
  isActive  Boolean  @default(true)
}

model TeamMember {
  id      String  @id @default(cuid())
  name    String
  role    String
  bio     String?
  photoId String?
  photo   Media?  @relation(fields: [photoId], references: [id])
  order   Int     @default(0)
}

model Testimonial {
  id       String  @id @default(cuid())
  author   String
  role     String?
  quote    String
  photoId  String?
  photo    Media?  @relation(fields: [photoId], references: [id])
  order    Int     @default(0)
}

model ImpactStat {
  id     String @id @default(cuid())
  label  String
  value  String
  order  Int    @default(0)
}

model Media {
  id         String   @id @default(cuid())
  url        String
  alt        String              // obligatoire
  width      Int
  height     Int
  mimeType   String
  sizeBytes  Int
  createdAt  DateTime @default(now())
}

model Setting {
  key   String @id
  value Json
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  action    String              // CREATE | UPDATE | DELETE | PUBLISH | LOGIN
  entity    String
  entityId  String?
  createdAt DateTime @default(now())
}

enum Status { DRAFT PUBLISHED }
```

`Setting` couvre : coordonnées, réseaux sociaux, texte d'accroche de l'accueil, adresse email de réception du formulaire de contact.

---

## 6. Structure des dossiers

```
app/
  (site)/               pages publiques, layout public
  (admin)/
    login/
    mot-de-passe-oublie/
    dashboard/
      articles/
      programmes/
      equipe/
      temoignages/
      impact/
      medias/
      parametres/
  api/
    auth/[...nextauth]/
    upload/
lib/
  db.ts                 client Prisma singleton
  auth.ts               config Auth.js + requireAdmin()
  actions/              Server Actions par entité
  validators/           schémas Zod
  audit.ts
components/
  site/
  admin/
  ui/
prisma/
  schema.prisma
  seed.ts
scripts/
  create-admin.ts
```

---

## 7. Règles de sécurité

À appliquer sans exception :

1. **Aucune page d'inscription publique.** Les comptes admin se créent uniquement via `scripts/create-admin.ts`, qui affiche un mot de passe temporaire en console.
2. Chaque Server Action et chaque page sous `/dashboard` commence par `await requireAdmin()`. La vérification côté serveur ne dépend jamais de l'UI.
3. Middleware sur `/dashboard/:path*` qui redirige vers `/login` sans session.
4. Rate limiting sur `/login` et sur `mot-de-passe-oublie` : 5 tentatives par IP et par tranche de 15 minutes.
5. Toute entrée passe par un schéma Zod avant écriture en base.
6. Upload : liste blanche `image/jpeg`, `image/png`, `image/webp` ; 5 Mo max ; nom de fichier régénéré ; champ `alt` requis avant validation.
7. Rendu du contenu Tiptap via un renderer de nœuds contrôlé. Jamais de `dangerouslySetInnerHTML` sur du contenu venant de la base.
8. Cookies de session : `httpOnly`, `secure`, `sameSite: lax`.
9. Tokens de réinitialisation : hachés en base, valides 1 heure, usage unique.
10. Aucun secret dans le repo. Fournir un `.env.example` documenté.
11. Journalisation dans `AuditLog` sur connexion, création, modification, suppression, publication.

---

## 8. Phases d'exécution

Une phase = une branche = un commit propre. **Ne pas commencer une phase avant validation de la précédente.**

### Phase 0 — Initialisation
- `create-next-app` TypeScript + Tailwind, ESLint, Prettier
- Prisma installé, connexion à la base vérifiée
- `.env.example`, README avec les commandes de démarrage
- **Validation :** `npm run dev` démarre, `npx prisma migrate dev` passe.

### Phase 1 — Socle visuel
- Tokens CSS dans `globals.css`, config Tailwind qui les consomme
- Composants `ui/` : Button, Input, Textarea, Select, Card, Badge, Modal, Toast
- Layout public : header responsive avec menu mobile, footer
- **Validation :** une page de démonstration montre tous les composants dans leurs états (défaut, survol, focus, désactivé, erreur).

### Phase 2 — Pages publiques statiques
- Toutes les pages de l'arborescence, avec du contenu réel fourni par le client (pas de faux texte)
- Responsive mobile-first, testé à 360 px
- Page 404 et page d'erreur
- **Validation :** Lighthouse mobile ≥ 90 en Performance et en Accessibilité sur l'accueil.

### Phase 3 — Auth et coquille admin
- Schéma Prisma complet migré
- `scripts/create-admin.ts` fonctionnel
- Login, logout, middleware, `requireAdmin()`
- Mot de passe oublié, de bout en bout avec envoi d'email
- Layout admin : sidebar, fil d'ariane, avatar et déconnexion
- **Validation :** impossible d'atteindre `/dashboard` sans session, y compris en appelant directement une Server Action.

### Phase 4 — CRUD Articles (module de référence)
Construire ce module de bout en bout et le faire valider **avant** de dupliquer le motif.
- Liste : pagination, recherche par titre, filtre par statut, tri par date
- Création et édition avec Tiptap (gras, italique, titres h2/h3, listes, liens, image, citation)
- Brouillon / publié, aperçu du brouillon
- Suppression avec confirmation explicite
- Génération automatique du slug, éditable, unicité vérifiée
- Sauvegarde : état de chargement, toast de succès, message d'erreur exploitable
- **Validation :** un utilisateur non technique publie un article sans aide.

### Phase 5 — Modules restants
Programmes, Équipe, Témoignages, Chiffres d'impact — même motif, avec réordonnancement par glisser-déposer ou par champ `order`.

### Phase 6 — Médias et paramètres
- Bibliothèque : grille, upload multiple, `alt` obligatoire, recherche, suppression avec avertissement si le média est utilisé
- Composant `MediaPicker` réutilisable
- Page Paramètres : coordonnées, réseaux, textes d'accueil, email de contact
- Changement de mot de passe
- **Validation :** aucune image ne peut être enregistrée sans texte alternatif.

### Phase 7 — Connexion public / admin
- Les pages publiques lisent depuis la base
- ISR avec `revalidatePath()` déclenché à chaque publication ou modification
- Formulaire de contact opérationnel avec protection anti-spam (honeypot + rate limit)
- **Validation :** un article publié apparaît sur le site en moins de 60 secondes.

### Phase 8 — Finitions et mise en ligne
- Métadonnées par page, Open Graph, `sitemap.xml`, `robots.txt`
- Données structurées JSON-LD `NGO` sur l'accueil, `Article` sur les articles
- Mentions légales et politique de confidentialité
- Domaine `sarjefondation.com` branché sur Vercel, HTTPS, redirection `www` vers apex
- Google Search Console, analytics respectueux de la vie privée
- Sauvegarde de base vérifiée
- Guide utilisateur PDF avec captures d'écran
- **Validation :** recette complète passée avec le client sur son propre téléphone.

---

## 9. Conventions de code

- TypeScript strict, aucun `any`
- Server Components par défaut ; `"use client"` uniquement quand l'interactivité l'exige, au niveau le plus bas possible
- Un fichier de Server Actions par entité dans `lib/actions/`
- Les Server Actions retournent `{ ok: true, data }` ou `{ ok: false, error }`, jamais une exception non gérée remontée à l'UI
- Nommage : composants en PascalCase, fichiers utilitaires en kebab-case
- Textes d'interface en français, en phrase, sans majuscules décoratives
- Les libellés de boutons décrivent l'action : « Publier », « Enregistrer les modifications », « Supprimer l'article » — jamais « Soumettre » ni « OK »
- Un message d'erreur dit ce qui s'est passé et quoi faire ensuite
- Les écrans vides invitent à agir, ils ne se contentent pas de constater le vide

---

## 10. Ce qu'il faut demander avant de commencer

Ne pas inventer de réponse à ces questions :

1. Logo et couleurs officielles de la fondation
2. Textes de la page d'accueil et de la page Mission
3. Liste des programmes avec descriptif
4. Photos de terrain en haute résolution, avec autorisations pour les personnes identifiables
5. Chiffres d'impact à mettre en avant
6. Coordonnées exactes et réseaux sociaux
7. Adresse email de réception du formulaire de contact
8. Faut-il un module de don en ligne dès la version 1, et avec quel prestataire (MonCash, Stripe, PayPal) ?

Le point 8 conditionne le périmètre. En l'absence de réponse, la page « S'impliquer » se limite à un appel au contact.
