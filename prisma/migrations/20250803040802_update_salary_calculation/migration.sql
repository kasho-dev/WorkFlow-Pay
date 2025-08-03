/*
  Warnings:

  - You are about to drop the column `hourlyRate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `SalarySetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SalarySetting" DROP CONSTRAINT "SalarySetting_userId_fkey";

-- AlterTable
ALTER TABLE "Keystroke" ALTER COLUMN "duration" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hourlyRate";

-- DropTable
DROP TABLE "SalarySetting";
