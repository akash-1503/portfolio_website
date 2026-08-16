/*
  Warnings:

  - A unique constraint covering the columns `[volunteerId,eventId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attendance_volunteerId_eventId_key" ON "Attendance"("volunteerId", "eventId");
