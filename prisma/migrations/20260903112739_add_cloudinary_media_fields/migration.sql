-- AlterTable
ALTER TABLE "GalleryMedia" ADD COLUMN     "publicId" TEXT,
ADD COLUMN     "thumbnailPublicId" TEXT;

-- AlterTable
ALTER TABLE "GalleryPost" ADD COLUMN     "thumbnailPublicId" TEXT;
