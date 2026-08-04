import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/db";

// Retire exactement le contenu créé par seed-demo-data.ts, en s'appuyant
// sur le manifeste écrit lors de sa création — ne touche à rien d'autre.

const MANIFEST_PATH = path.join(__dirname, ".demo-data-manifest.json");

type Manifest = {
  media: string[];
  programs: string[];
  articles: string[];
  teamMembers: string[];
  testimonials: string[];
  impactStats: string[];
  albums: string[];
  galleryPhotos: string[];
};

async function main() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.log("Aucun manifeste trouvé — rien à retirer (seed-demo-data.ts a-t-il été lancé ?).");
    return;
  }

  const manifest: Manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));

  // Les entités qui référencent un média sont retirées avant le média
  // lui-même, même si la contrainte est en ON DELETE SET NULL/CASCADE et
  // permettrait un ordre différent — plus explicite ainsi.
  const galleryPhotos = await prisma.galleryPhoto.deleteMany({
    where: { id: { in: manifest.galleryPhotos } },
  });
  const albums = await prisma.album.deleteMany({
    where: { id: { in: manifest.albums } },
  });
  const impactStats = await prisma.impactStat.deleteMany({
    where: { id: { in: manifest.impactStats } },
  });
  const testimonials = await prisma.testimonial.deleteMany({
    where: { id: { in: manifest.testimonials } },
  });
  const teamMembers = await prisma.teamMember.deleteMany({
    where: { id: { in: manifest.teamMembers } },
  });
  const articles = await prisma.article.deleteMany({
    where: { id: { in: manifest.articles } },
  });
  const programs = await prisma.program.deleteMany({
    where: { id: { in: manifest.programs } },
  });
  const media = await prisma.media.deleteMany({
    where: { id: { in: manifest.media } },
  });

  console.log(
    JSON.stringify(
      {
        galleryPhotos: galleryPhotos.count,
        albums: albums.count,
        impactStats: impactStats.count,
        testimonials: testimonials.count,
        teamMembers: teamMembers.count,
        articles: articles.count,
        programs: programs.count,
        media: media.count,
      },
      null,
      2,
    ),
  );

  fs.unlinkSync(MANIFEST_PATH);
  console.log("Contenu de démonstration retiré, manifeste supprimé.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
