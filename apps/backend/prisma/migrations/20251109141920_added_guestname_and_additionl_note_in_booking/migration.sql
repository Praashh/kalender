/*
  Warnings:

  - Added the required column `guestName` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "additionalNote" TEXT,
ADD COLUMN     "guestName" TEXT NOT NULL;
