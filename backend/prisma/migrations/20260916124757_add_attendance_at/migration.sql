/*
  Warnings:

  - Added the required column `attendanceAt` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "attendanceAt" TIMESTAMP(3) NOT NULL;
