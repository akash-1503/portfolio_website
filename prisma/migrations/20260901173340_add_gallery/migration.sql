/*
  Warnings:

  - The values [IMAGE,VIDEO,STORY] on the enum `GalleryType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `mediaUrl` on the `GalleryPost` table. All the data in the column will be lost.
  - Made the column `description` on table `GalleryPost` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `category` to the `GalleryPost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GalleryCategory" AS ENUM ('Education', 'Environment', 'Health', 'Emergency');

-- CreateEnum
CREATE TYPE "ErrorSeverity" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "GalleryMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterEnum
BEGIN;
CREATE TYPE "GalleryType_new" AS ENUM ('Story', 'Photo', 'Video', 'Impact');
ALTER TABLE "GalleryPost" ALTER COLUMN "type" TYPE "GalleryType_new" USING ("type"::text::"GalleryType_new");
ALTER TYPE "GalleryType" RENAME TO "GalleryType_old";
ALTER TYPE "GalleryType_new" RENAME TO "GalleryType";
DROP TYPE "GalleryType_old";
COMMIT;

-- AlterTable
ALTER TABLE "GalleryPost" DROP COLUMN "mediaUrl",
ADD COLUMN     "location" TEXT,
ALTER COLUMN "description" SET NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "GalleryCategory" NOT NULL;

-- CreateTable
CREATE TABLE "GalleryMedia" (
    "id" TEXT NOT NULL,
    "galleryPostId" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "mediaType" "GalleryMediaType" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemError" (
    "id" TEXT NOT NULL,
    "ngoId" TEXT,
    "userId" TEXT,
    "method" TEXT,
    "endpoint" TEXT,
    "statusCode" INTEGER,
    "errorType" TEXT,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "requestId" TEXT,
    "metadata" JSONB,
    "severity" "ErrorSeverity" NOT NULL DEFAULT 'ERROR',
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemError_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GalleryMedia_galleryPostId_idx" ON "GalleryMedia"("galleryPostId");

-- CreateIndex
CREATE INDEX "GalleryMedia_mediaType_idx" ON "GalleryMedia"("mediaType");

-- CreateIndex
CREATE INDEX "GalleryMedia_sortOrder_idx" ON "GalleryMedia"("sortOrder");

-- CreateIndex
CREATE INDEX "GalleryMedia_createdAt_idx" ON "GalleryMedia"("createdAt");

-- CreateIndex
CREATE INDEX "SystemError_ngoId_idx" ON "SystemError"("ngoId");

-- CreateIndex
CREATE INDEX "SystemError_userId_idx" ON "SystemError"("userId");

-- CreateIndex
CREATE INDEX "SystemError_resolvedById_idx" ON "SystemError"("resolvedById");

-- CreateIndex
CREATE INDEX "SystemError_statusCode_idx" ON "SystemError"("statusCode");

-- CreateIndex
CREATE INDEX "SystemError_severity_idx" ON "SystemError"("severity");

-- CreateIndex
CREATE INDEX "SystemError_resolved_idx" ON "SystemError"("resolved");

-- CreateIndex
CREATE INDEX "SystemError_createdAt_idx" ON "SystemError"("createdAt");

-- CreateIndex
CREATE INDEX "GalleryPost_category_idx" ON "GalleryPost"("category");

-- CreateIndex
CREATE INDEX "GalleryPost_eventId_idx" ON "GalleryPost"("eventId");

-- CreateIndex
CREATE INDEX "GalleryPost_campaignId_idx" ON "GalleryPost"("campaignId");

-- CreateIndex
CREATE INDEX "GalleryPost_createdBy_idx" ON "GalleryPost"("createdBy");

-- CreateIndex
CREATE INDEX "GalleryPost_isDeleted_idx" ON "GalleryPost"("isDeleted");

-- AddForeignKey
ALTER TABLE "GalleryMedia" ADD CONSTRAINT "GalleryMedia_galleryPostId_fkey" FOREIGN KEY ("galleryPostId") REFERENCES "GalleryPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemError" ADD CONSTRAINT "SystemError_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemError" ADD CONSTRAINT "SystemError_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemError" ADD CONSTRAINT "SystemError_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
