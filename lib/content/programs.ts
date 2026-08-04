export type Program = {
  slug: string;
  title: string;
  summary: string;
  body: string[];
};

// Contenu provisoire — à remplacer par les descriptifs réels fournis par la
// fondation (plan §10.3), puis par le CRUD Programmes en phase 5/7.
export const programs: Program[] = [
  {
    slug: "education",
    title: "Éducation",
    summary:
      "Frais de scolarité, fournitures et accompagnement pédagogique pour des enfants qui, sans ce soutien, n'auraient pas accès à l'école.",
    body: [
      "Le programme Éducation prend en charge la scolarité d'enfants issus de familles vulnérables, de la maternelle au secondaire : frais d'inscription, uniformes, livres et fournitures.",
      "Au-delà du financement, la fondation organise un suivi pédagogique régulier avec les enseignants et les familles, pour repérer tôt les difficultés et éviter le décrochage.",
      "Des séances de soutien scolaire sont proposées les mercredis et samedis dans les centres communautaires partenaires.",
    ],
  },
  {
    slug: "sante",
    title: "Santé",
    summary:
      "Consultations médicales, vaccination et suivi nutritionnel pour les enfants et leurs familles dans les zones les moins desservies.",
    body: [
      "Le programme Santé organise des cliniques mobiles dans les communautés éloignées des centres de soins, avec des consultations gratuites pour les enfants et les femmes enceintes.",
      "Un volet nutrition dépiste et prend en charge les cas de malnutrition infantile, en lien avec les centres de santé locaux.",
      "La fondation finance également les campagnes de vaccination et la sensibilisation à l'hygiène dans les écoles partenaires.",
    ],
  },
  {
    slug: "accompagnement-communautaire",
    title: "Accompagnement communautaire",
    summary:
      "Formation des parents, activités psychosociales et appui aux familles pour construire un environnement stable autour de chaque enfant.",
    body: [
      "L'accompagnement communautaire s'adresse aux familles elles-mêmes : ateliers de parentalité, alphabétisation des adultes et appui à la génération de revenus.",
      "Des activités psychosociales sont organisées pour les enfants ayant vécu des situations difficiles, en partenariat avec des intervenants formés.",
      "La fondation travaille avec les leaders communautaires pour identifier les familles les plus vulnérables et adapter l'accompagnement à chaque contexte.",
    ],
  },
  {
    slug: "aide-urgence",
    title: "Aide d'urgence",
    summary:
      "Distribution alimentaire et appui matériel de première nécessité lors des crises et catastrophes naturelles.",
    body: [
      "Face aux catastrophes naturelles fréquentes en Haïti, la fondation maintient une réserve d'urgence : denrées alimentaires, eau potable, kits d'hygiène.",
      "Les distributions ciblent en priorité les familles déjà suivies par les autres programmes, puis s'élargissent selon l'ampleur de la crise.",
      "Ce programme fonctionne aussi comme un pont vers les autres actions de la fondation, une fois la situation d'urgence stabilisée.",
    ],
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}
