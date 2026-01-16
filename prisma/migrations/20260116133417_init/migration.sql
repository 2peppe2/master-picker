/*
  Warnings:

  - You are about to drop the column `courseOccasionId` on the `CourseOccasionBlock` table. All the data in the column will be lost.
  - Added the required column `coursePeriodId` to the `CourseOccasionBlock` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseOccasionBlock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "coursePeriodId" INTEGER NOT NULL,
    "block" INTEGER NOT NULL,
    CONSTRAINT "CourseOccasionBlock_coursePeriodId_fkey" FOREIGN KEY ("coursePeriodId") REFERENCES "CourseOccasionPeriod" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CourseOccasionBlock" ("block", "id") SELECT "block", "id" FROM "CourseOccasionBlock";
DROP TABLE "CourseOccasionBlock";
ALTER TABLE "new_CourseOccasionBlock" RENAME TO "CourseOccasionBlock";
CREATE UNIQUE INDEX "CourseOccasionBlock_coursePeriodId_block_key" ON "CourseOccasionBlock"("coursePeriodId", "block");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
