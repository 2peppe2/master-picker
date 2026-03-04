/*
  Warnings:

  - Added the required column `Department` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "Department" TEXT NOT NULL,
ADD COLUMN     "MainField" TEXT[];
