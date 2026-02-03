/*
  Warnings:

  - Added the required column `masterProgram` to the `Master` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Master" (
    "master" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "icon" TEXT,
    "style" TEXT,
    "masterProgram" TEXT NOT NULL,
    CONSTRAINT "Master_masterProgram_fkey" FOREIGN KEY ("masterProgram") REFERENCES "Program" ("program") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Master" ("icon", "master", "name", "style") SELECT "icon", "master", "name", "style" FROM "Master";
DROP TABLE "Master";
ALTER TABLE "new_Master" RENAME TO "Master";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
