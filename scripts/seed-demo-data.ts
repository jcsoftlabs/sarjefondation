import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { cloudinary } from "../lib/cloudinary";
import { prisma } from "../lib/db";

// Insère du contenu de démonstration pour une présentation. Écrit un
// manifeste (.demo-data-manifest.json) listant tout ce qui a été créé, pour
// pouvoir tout retirer proprement avec `npm run clear-demo-data`.
// N'écrase jamais de contenu existant — à lancer uniquement sur une base
// vide de ces entités.

const IMAGE_DIR =
  "/private/tmp/claude-501/-Users-christopherjerome-Jedco/d51fd610-c00d-44eb-984b-18d71b7b2721/scratchpad/demo-images";
const MANIFEST_PATH = path.join(__dirname, ".demo-data-manifest.json");

// Le dossier scratchpad (temporaire, propre à une session) peut avoir été
// vidé entre deux exécutions. Dans ce cas, on réutilise les images déjà
// envoyées sur Cloudinary lors d'exécutions précédentes (dossier
// sarje-fondation/demo) plutôt que d'échouer — un contenu de démonstration
// n'a pas besoin de correspondre exactement à son alt, seulement d'exister.
let fallbackPool: { secure_url: string; width: number; height: number; bytes: number }[] | null =
  null;
let fallbackIndex = 0;

async function getFallbackImage() {
  if (fallbackPool === null) {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "sarje-fondation/demo",
      max_results: 100,
    });
    fallbackPool = result.resources;
    if (!fallbackPool || fallbackPool.length === 0) {
      throw new Error(
        `Aucune image locale dans ${IMAGE_DIR} et aucune image de secours sur Cloudinary (dossier sarje-fondation/demo vide).`,
      );
    }
  }
  const image = fallbackPool[fallbackIndex % fallbackPool.length];
  fallbackIndex += 1;
  return image;
}

async function uploadImage(filename: string, alt: string) {
  const filePath = path.join(IMAGE_DIR, filename);

  if (fs.existsSync(filePath)) {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "sarje-fondation/demo",
    });
    return prisma.media.create({
      data: {
        url: result.secure_url,
        alt,
        width: result.width,
        height: result.height,
        mimeType: "image/png",
        sizeBytes: result.bytes,
      },
    });
  }

  const fallback = await getFallbackImage();
  return prisma.media.create({
    data: {
      url: fallback.secure_url,
      alt,
      width: fallback.width,
      height: fallback.height,
      mimeType: "image/png",
      sizeBytes: fallback.bytes,
    },
  });
}

async function main() {
  const manifest: Record<string, string[]> = {
    media: [],
    programs: [],
    articles: [],
    teamMembers: [],
    testimonials: [],
    impactStats: [],
    albums: [],
    galleryPhotos: [],
  };

  console.log("Envoi des images de démonstration vers Cloudinary…");

  const covers = {
    education: await uploadImage("education.png", "Enfants en classe, programme Éducation"),
    sante: await uploadImage("sante.png", "Consultation médicale, programme Santé"),
    communautaire: await uploadImage(
      "communautaire.png",
      "Atelier communautaire avec des familles",
    ),
    urgence: await uploadImage("urgence.png", "Distribution d'aide d'urgence"),
    article1: await uploadImage("article1.png", "Rentrée scolaire 2026"),
    article2: await uploadImage("article2.png", "Clinique mobile en tournée"),
    article3: await uploadImage("article3.png", "Atelier de parentalité"),
    membre1: await uploadImage("membre1.png", "Portrait de membre de l'équipe"),
    membre2: await uploadImage("membre2.png", "Portrait de membre de l'équipe"),
    membre3: await uploadImage("membre3.png", "Portrait de membre de l'équipe"),
    temoin1: await uploadImage("temoin1.png", "Portrait de témoin"),
    temoin2: await uploadImage("temoin2.png", "Portrait de témoin"),
    galerie1: await uploadImage("galerie1.png", "Photo de terrain — programme Éducation"),
    galerie2: await uploadImage("galerie2.png", "Photo de terrain — programme Santé"),
    galerie3: await uploadImage("galerie3.png", "Photo de terrain — vie communautaire"),
    galerie4: await uploadImage("galerie4.png", "Photo de terrain — équipe sur site"),
    galerie5: await uploadImage("galerie5.png", "Photo de terrain — distribution"),
    galerie6: await uploadImage("galerie6.png", "Photo de terrain — atelier"),
  };
  manifest.media = Object.values(covers).map((m) => m.id);

  console.log("Création des programmes…");
  const programs = await Promise.all([
    prisma.program.create({
      data: {
        title: "Éducation",
        titleEn: "Education",
        slug: "education",
        summary:
          "Frais de scolarité, fournitures et accompagnement pédagogique pour des enfants qui, sans ce soutien, n'auraient pas accès à l'école.",
        summaryEn:
          "Tuition fees, school supplies, and academic support for children who, without this help, would not have access to school.",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Le programme Éducation prend en charge la scolarité d'enfants issus de familles vulnérables, de la maternelle au secondaire.",
                },
              ],
            },
          ],
        },
        contentEn: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The Education program covers schooling for children from vulnerable families, from kindergarten through high school.",
                },
              ],
            },
          ],
        },
        coverId: covers.education.id,
        order: 0,
        isActive: true,
      },
    }),
    prisma.program.create({
      data: {
        title: "Santé",
        titleEn: "Health",
        slug: "sante",
        summary:
          "Consultations médicales, vaccination et suivi nutritionnel pour les enfants et leurs familles dans les zones les moins desservies.",
        summaryEn:
          "Medical consultations, vaccination, and nutritional follow-up for children and their families in the least-served areas.",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Le programme Santé organise des cliniques mobiles dans les communautés éloignées des centres de soins.",
                },
              ],
            },
          ],
        },
        contentEn: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The Health program runs mobile clinics in communities far from healthcare centers.",
                },
              ],
            },
          ],
        },
        coverId: covers.sante.id,
        order: 1,
        isActive: true,
      },
    }),
    prisma.program.create({
      data: {
        title: "Accompagnement communautaire",
        slug: "accompagnement-communautaire",
        summary:
          "Formation des parents, activités psychosociales et appui aux familles pour construire un environnement stable autour de chaque enfant.",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "L'accompagnement communautaire s'adresse aux familles elles-mêmes : ateliers de parentalité, alphabétisation et appui à la génération de revenus.",
                },
              ],
            },
          ],
        },
        coverId: covers.communautaire.id,
        order: 2,
        isActive: true,
      },
    }),
    prisma.program.create({
      data: {
        title: "Aide d'urgence",
        slug: "aide-urgence",
        summary:
          "Distribution alimentaire et appui matériel de première nécessité lors des crises et catastrophes naturelles.",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Face aux catastrophes naturelles fréquentes en Haïti, la fondation maintient une réserve d'urgence.",
                },
              ],
            },
          ],
        },
        coverId: covers.urgence.id,
        order: 3,
        isActive: true,
      },
    }),
  ]);
  manifest.programs = programs.map((p) => p.id);

  console.log("Création des articles…");
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: "180 enfants supplémentaires accompagnés à la rentrée",
        titleEn: "180 more children supported this school year",
        slug: "rentree-scolaire-2026",
        excerpt:
          "Le programme Éducation s'élargit à trois nouvelles communautés pour cette rentrée scolaire.",
        excerptEn:
          "The Education program is expanding to three new communities this school year.",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Grâce au soutien de nos partenaires, le programme Éducation accompagne cette année 180 enfants supplémentaires dans trois communautés qui n'étaient pas encore couvertes.",
                },
              ],
            },
          ],
        },
        contentEn: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Thanks to the support of our partners, the Education program is supporting 180 more children this year in three communities that were not previously covered.",
                },
              ],
            },
          ],
        },
        coverId: covers.article1.id,
        status: "PUBLISHED",
        publishedAt: new Date("2026-09-01"),
      },
    }),
    prisma.article.create({
      data: {
        title: "Bilan de la clinique mobile : un trimestre sur le terrain",
        slug: "clinique-mobile-bilan",
        excerpt:
          "Retour sur trois mois de consultations gratuites dans les zones les moins desservies.",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "La clinique mobile du programme Santé a sillonné plusieurs communautés isolées ce trimestre, offrant consultations et suivi nutritionnel.",
                },
              ],
            },
          ],
        },
        coverId: covers.article2.id,
        status: "PUBLISHED",
        publishedAt: new Date("2026-07-15"),
      },
    }),
    prisma.article.create({
      data: {
        title: "Premiers ateliers de parentalité dans les centres communautaires",
        slug: "atelier-parentalite",
        excerpt:
          "Un nouveau cycle d'ateliers pour outiller les familles accompagnées par la fondation.",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Le programme d'accompagnement communautaire a lancé son premier cycle d'ateliers de parentalité, animés par des intervenants formés.",
                },
              ],
            },
          ],
        },
        coverId: covers.article3.id,
        status: "PUBLISHED",
        publishedAt: new Date("2026-05-20"),
      },
    }),
  ]);
  manifest.articles = articles.map((a) => a.id);

  console.log("Création de l'équipe…");
  const teamMembers = await Promise.all([
    prisma.teamMember.create({
      data: {
        name: "Nadège Pierre",
        role: "Directrice générale",
        roleEn: "Executive Director",
        bio: "Pilote l'ensemble des programmes de la fondation depuis sa création.",
        bioEn: "Leads all of the foundation's programs since its founding.",
        photoId: covers.membre1.id,
        order: 0,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: "Jonas Charles",
        role: "Coordonnateur des programmes",
        bio: "Supervise le déploiement des programmes Éducation et Santé sur le terrain.",
        photoId: covers.membre2.id,
        order: 1,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: "Wideline Louis",
        role: "Responsable communautaire",
        bio: "Anime les ateliers de parentalité et le lien avec les familles accompagnées.",
        photoId: covers.membre3.id,
        order: 2,
      },
    }),
  ]);
  manifest.teamMembers = teamMembers.map((m) => m.id);

  console.log("Création des témoignages…");
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        author: "Marie-Ange",
        role: "Mère de deux enfants accompagnés",
        roleEn: "Mother of two supported children",
        quote:
          "Grâce au programme Éducation, mes enfants sont retournés à l'école. Je ne pensais pas que ce serait possible cette année.",
        quoteEn:
          "Thanks to the Education program, my children are back in school. I didn't think that would be possible this year.",
        photoId: covers.temoin1.id,
        order: 0,
      },
    }),
    prisma.testimonial.create({
      data: {
        author: "Frantz",
        role: "Bénévole du programme Santé",
        quote:
          "Chaque tournée de la clinique mobile, on voit concrètement la différence que ça fait pour les familles les plus isolées.",
        photoId: covers.temoin2.id,
        order: 1,
      },
    }),
  ]);
  manifest.testimonials = testimonials.map((t) => t.id);

  console.log("Création des chiffres d'impact…");
  const impactStats = await Promise.all([
    prisma.impactStat.create({
      data: {
        value: "1 240",
        label: "enfants accompagnés depuis la création de la fondation",
        labelEn: "children supported since the foundation was created",
        order: 0,
      },
    }),
    prisma.impactStat.create({
      data: { value: "4", label: "programmes actifs sur l'ensemble du territoire", order: 1 },
    }),
    prisma.impactStat.create({
      data: { value: "96%", label: "des fonds directement affectés au terrain", order: 2 },
    }),
  ]);
  manifest.impactStats = impactStats.map((s) => s.id);

  console.log("Création des albums…");
  const albumsData: {
    title: string;
    titleEn?: string;
    slug: string;
    description: string;
    descriptionEn?: string;
    coverKey: keyof typeof covers;
    photos: [keyof typeof covers, string, string?][];
  }[] = [
    {
      title: "Programme Éducation",
      titleEn: "Education Program",
      slug: "programme-education",
      description: "Le programme Éducation sur le terrain, au fil des tournées.",
      descriptionEn: "The Education program on the ground, across our field visits.",
      coverKey: "galerie1",
      photos: [
        [
          "galerie1",
          "Cours de soutien scolaire, communauté de Cabaret",
          "Tutoring session, Cabaret community",
        ],
        ["galerie2", "Consultation lors d'une tournée de la clinique mobile"],
      ],
    },
    {
      title: "Journée communautaire",
      slug: "journee-communautaire",
      description: "Retour en images sur une journée d'activités communautaires.",
      coverKey: "galerie3",
      photos: [
        ["galerie3", "Rencontre communautaire mensuelle"],
        ["galerie4", "L'équipe de la fondation en déplacement"],
        ["galerie5", "Distribution de kits d'hygiène"],
        ["galerie6", "Atelier de parentalité en cours"],
      ],
    },
  ];

  for (const [index, albumData] of albumsData.entries()) {
    const album = await prisma.album.create({
      data: {
        title: albumData.title,
        titleEn: albumData.titleEn,
        slug: albumData.slug,
        description: albumData.description,
        descriptionEn: albumData.descriptionEn,
        coverId: covers[albumData.coverKey].id,
        order: index,
      },
    });
    manifest.albums.push(album.id);

    const photos = await Promise.all(
      albumData.photos.map(([key, caption, captionEn], photoIndex) =>
        prisma.galleryPhoto.create({
          data: {
            albumId: album.id,
            photoId: covers[key].id,
            caption,
            captionEn,
            order: photoIndex,
          },
        }),
      ),
    );
    manifest.galleryPhotos.push(...photos.map((p) => p.id));
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nContenu de démonstration créé. Manifeste écrit dans ${MANIFEST_PATH}`);
  console.log("Pour tout retirer après la présentation : npm run clear-demo-data");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
