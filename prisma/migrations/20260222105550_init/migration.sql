/*
  Warnings:

  - You are about to drop the `_CourseOccasionToMaster` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `CourseMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `masterProgram` to the `CourseMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `program` to the `Requirement` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_CourseOccasionToMaster_B_index";

-- DropIndex
DROP INDEX "_CourseOccasionToMaster_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CourseOccasionToMaster";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CourseOccasionRecommendedMaster" (
    "courseOccasionId" INTEGER NOT NULL,
    "master" TEXT NOT NULL,
    "masterProgram" TEXT NOT NULL,

    PRIMARY KEY ("courseOccasionId", "master", "masterProgram"),
    CONSTRAINT "CourseOccasionRecommendedMaster_courseOccasionId_fkey" FOREIGN KEY ("courseOccasionId") REFERENCES "CourseOccasion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseOccasionRecommendedMaster_master_masterProgram_fkey" FOREIGN KEY ("master", "masterProgram") REFERENCES "Master" ("master", "masterProgram") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseMaster" (
    "master" TEXT NOT NULL,
    "masterProgram" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "programCourseID" INTEGER NOT NULL,

    PRIMARY KEY ("master", "masterProgram", "courseCode"),
    CONSTRAINT "CourseMaster_master_masterProgram_fkey" FOREIGN KEY ("master", "masterProgram") REFERENCES "Master" ("master", "masterProgram") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CourseMaster_courseCode_programCourseID_fkey" FOREIGN KEY ("courseCode", "programCourseID") REFERENCES "Course" ("code", "programCourseID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CourseMaster" ("courseCode", "master", "programCourseID") SELECT "courseCode", "master", "programCourseID" FROM "CourseMaster";
DROP TABLE "CourseMaster";
ALTER TABLE "new_CourseMaster" RENAME TO "CourseMaster";
CREATE TABLE "new_Master" (
    "master" TEXT NOT NULL,
    "name" TEXT,
    "icon" TEXT,
    "style" TEXT,
    "masterProgram" TEXT NOT NULL,

    PRIMARY KEY ("master", "masterProgram"),
    CONSTRAINT "Master_masterProgram_fkey" FOREIGN KEY ("masterProgram") REFERENCES "Program" ("program") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Master" ("icon", "master", "masterProgram", "name", "style") SELECT "icon", "master", "masterProgram", "name", "style" FROM "Master";
DROP TABLE "Master";
ALTER TABLE "new_Master" RENAME TO "Master";
CREATE TABLE "new_Requirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "masterProgram" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    CONSTRAINT "Requirement_masterProgram_program_fkey" FOREIGN KEY ("masterProgram", "program") REFERENCES "Master" ("master", "masterProgram") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Requirement" ("id", "masterProgram") SELECT "id", "masterProgram" FROM "Requirement";
DROP TABLE "Requirement";
ALTER TABLE "new_Requirement" RENAME TO "Requirement";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "CourseOccasionRecommendedMaster_master_masterProgram_idx" ON "CourseOccasionRecommendedMaster"("master", "masterProgram");
