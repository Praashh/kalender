/*
  Warnings:

  - Added the required column `slug` to the `EventType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventType" ADD COLUMN     "slug" TEXT NOT NULL;
