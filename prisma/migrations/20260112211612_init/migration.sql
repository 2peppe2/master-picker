/*
  Warnings:

  - Added the required column `name` to the `Examination` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Examination" (
    "credits" INTEGER NOT NULL,
    "module" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scale" TEXT NOT NULL DEFAULT 'G_OR_U',

    PRIMARY KEY ("courseCode", "module"),
    CONSTRAINT "Examination_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Examination" ("courseCode", "credits", "module", "scale") SELECT "courseCode", "credits", "module", "scale" FROM "Examination";
DROP TABLE "Examination";
ALTER TABLE "new_Examination" RENAME TO "Examination";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
