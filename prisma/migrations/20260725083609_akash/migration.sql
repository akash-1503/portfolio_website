/*
  Warnings:

  - The values [GENERATED,ISSUED] on the enum `CertificateStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `logo` on the `NGO` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[certificateNumber]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `certificateNumber` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TASK', 'EVENT', 'CAMPAIGN', 'CERTIFICATE', 'ATTENDANCE', 'MESSAGE');

-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('PROGRAM', 'CAMPAIGN', 'EVENT');

-- AlterEnum
BEGIN;
CREATE TYPE "CertificateStatus_new" AS ENUM ('PENDING', 'VERIFIED', 'REVOKED');
ALTER TABLE "Certificate" ALTER COLUMN "status" TYPE "CertificateStatus_new" USING ("status"::text::"CertificateStatus_new");
ALTER TYPE "CertificateStatus" RENAME TO "CertificateStatus_old";
ALTER TYPE "CertificateStatus_new" RENAME TO "CertificateStatus";
DROP TYPE "CertificateStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "campaignId" TEXT,
ADD COLUMN     "certificateNumber" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "programId" TEXT,
ADD COLUMN     "type" "CertificateType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "NGO" DROP COLUMN "logo";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "type" "NotificationType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateNumber_key" ON "Certificate"("certificateNumber");

-- CreateIndex
CREATE INDEX "Certificate_volunteerId_idx" ON "Certificate"("volunteerId");

-- CreateIndex
CREATE INDEX "Certificate_status_idx" ON "Certificate"("status");

-- CreateIndex
CREATE INDEX "Certificate_type_idx" ON "Certificate"("type");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
