/*
  Warnings:

  - Added the required column `prerequisitesText` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduledHours` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selfStudyHours` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
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
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Course" ("code", "credits", "ecv", "examiner", "level", "link", "name", "updatedAt") SELECT "code", "credits", "ecv", "examiner", "level", "link", "name", "updatedAt" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
