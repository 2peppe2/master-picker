-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Master" (
    "master" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "icon" TEXT,
    "style" TEXT
);
INSERT INTO "new_Master" ("icon", "master", "name", "style") SELECT "icon", "master", "name", "style" FROM "Master";
DROP TABLE "Master";
ALTER TABLE "new_Master" RENAME TO "Master";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
