-- DropForeignKey
ALTER TABLE "GalleryPhoto" DROP CONSTRAINT "GalleryPhoto_photoId_fkey";

-- AddForeignKey
ALTER TABLE "GalleryPhoto" ADD CONSTRAINT "GalleryPhoto_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
