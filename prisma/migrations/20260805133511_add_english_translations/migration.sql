-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "contentEn" JSONB,
ADD COLUMN     "excerptEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "GalleryPhoto" ADD COLUMN     "captionEn" TEXT;

-- AlterTable
ALTER TABLE "ImpactStat" ADD COLUMN     "labelEn" TEXT;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "contentEn" JSONB,
ADD COLUMN     "summaryEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "bioEn" TEXT,
ADD COLUMN     "roleEn" TEXT;

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "quoteEn" TEXT,
ADD COLUMN     "roleEn" TEXT;
