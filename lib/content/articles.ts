export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  publishedAt: string; // ISO date
};

// Contenu provisoire — remplacé par le module Articles piloté depuis le
// back-office à partir de la phase 4/7.
export const articles: Article[] = [
  {
    slug: "rentree-scolaire-2026",
    title: "180 enfants supplémentaires accompagnés à la rentrée",
    excerpt:
      "Le programme Éducation s'élargit à trois nouvelles communautés pour cette rentrée scolaire.",
    publishedAt: "2026-09-01",
    body: [
      "Grâce au soutien de nos partenaires, le programme Éducation accompagne cette année 180 enfants supplémentaires dans trois communautés qui n'étaient pas encore couvertes.",
      "Chaque enfant reçoit ses fournitures scolaires avant la rentrée, et les familles sont rencontrées individuellement pour établir un suivi sur l'année.",
      "Cette extension a été rendue possible par la mobilisation de nouveaux bénévoles sur le terrain, formés au cours de l'été.",
    ],
  },
  {
    slug: "clinique-mobile-bilan",
    title: "Bilan de la clinique mobile : un trimestre sur le terrain",
    excerpt:
      "Retour sur trois mois de consultations gratuites dans les zones les moins desservies.",
    publishedAt: "2026-07-15",
    body: [
      "La clinique mobile du programme Santé a sillonné plusieurs communautés isolées ce trimestre, offrant consultations, suivi nutritionnel et vaccination.",
      "L'équipe médicale partenaire a pu identifier et orienter plusieurs cas nécessitant un suivi spécialisé, en lien avec les centres de santé de référence.",
      "La fondation remercie les bénévoles et les professionnels de santé qui ont rendu ces journées possibles.",
    ],
  },
  {
    slug: "atelier-parentalite",
    title: "Premiers ateliers de parentalité dans les centres communautaires",
    excerpt:
      "Un nouveau cycle d'ateliers pour outiller les familles accompagnées par la fondation.",
    publishedAt: "2026-05-20",
    body: [
      "Le programme d'accompagnement communautaire a lancé son premier cycle d'ateliers de parentalité, animés par des intervenants formés.",
      "Ces rencontres mensuelles abordent la communication avec les enfants, la gestion du stress familial et l'orientation vers les ressources disponibles.",
      "Les familles participantes ont exprimé le souhait de poursuivre ces échanges au-delà du cycle initial ; la fondation étudie la mise en place d'un suivi régulier.",
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
