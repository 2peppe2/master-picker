/*
  Warnings:

  - You are about to drop the column `recommendedMasterCode` on the `CourseOccasion` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_CourseOccasionToMaster" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CourseOccasionToMaster_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseOccasion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CourseOccasionToMaster_B_fkey" FOREIGN KEY ("B") REFERENCES "Master" ("master") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseOccasion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    CONSTRAINT "CourseOccasion_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CourseOccasion" ("courseCode", "id", "semester", "year") SELECT "courseCode", "id", "semester", "year" FROM "CourseOccasion";
DROP TABLE "CourseOccasion";
ALTER TABLE "new_CourseOccasion" RENAME TO "CourseOccasion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_CourseOccasionToMaster_AB_unique" ON "_CourseOccasionToMaster"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseOccasionToMaster_B_index" ON "_CourseOccasionToMaster"("B");
