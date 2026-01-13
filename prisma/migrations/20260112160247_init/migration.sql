/*
  Warnings:

  - Added the required column `icon` to the `Master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `style` to the `Master` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Master" (
    "master" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "style" TEXT NOT NULL
);
INSERT INTO "new_Master" ("master") SELECT "master" FROM "Master";
DROP TABLE "Master";
ALTER TABLE "new_Master" RENAME TO "Master";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
