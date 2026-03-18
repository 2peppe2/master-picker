/*
  Warnings:

  - Added the required column `programCourseID` to the `Requirement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Requirement" ADD COLUMN     "programCourseID" INTEGER NOT NULL;
