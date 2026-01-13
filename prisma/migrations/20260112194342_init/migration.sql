/*
  Warnings:

  - Added the required column `type` to the `CoursesRequirement` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CoursesRequirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "requirementId" INTEGER NOT NULL,
    CONSTRAINT "CoursesRequirement_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CoursesRequirement" ("id", "requirementId") SELECT "id", "requirementId" FROM "CoursesRequirement";
DROP TABLE "CoursesRequirement";
ALTER TABLE "new_CoursesRequirement" RENAME TO "CoursesRequirement";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
