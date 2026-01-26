/*
  Warnings:

  - You are about to drop the `_CourseToProgram` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `programCourseID` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortname` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_CourseToProgram_B_index";

-- DropIndex
DROP INDEX "_CourseToProgram_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CourseToProgram";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ProgramCourse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "program" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    CONSTRAINT "ProgramCourse_program_fkey" FOREIGN KEY ("program") REFERENCES "Program" ("program") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "credits" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "examiner" TEXT NOT NULL,
    "ecv" TEXT NOT NULL,
    "prerequisitesText" TEXT NOT NULL,
    "scheduledHours" INTEGER NOT NULL,
    "selfStudyHours" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "programCourseID" INTEGER NOT NULL,
    CONSTRAINT "Course_programCourseID_fkey" FOREIGN KEY ("programCourseID") REFERENCES "ProgramCourse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("code", "credits", "ecv", "examiner", "level", "link", "name", "prerequisitesText", "scheduledHours", "selfStudyHours", "updatedAt") SELECT "code", "credits", "ecv", "examiner", "level", "link", "name", "prerequisitesText", "scheduledHours", "selfStudyHours", "updatedAt" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE TABLE "new_Program" (
    "program" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortname" TEXT NOT NULL
);
INSERT INTO "new_Program" ("program") SELECT "program" FROM "Program";
DROP TABLE "Program";
ALTER TABLE "new_Program" RENAME TO "Program";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
