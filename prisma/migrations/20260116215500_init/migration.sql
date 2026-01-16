-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseOccasion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "recommendedMasterCode" TEXT,
    CONSTRAINT "CourseOccasion_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CourseOccasion_recommendedMasterCode_fkey" FOREIGN KEY ("recommendedMasterCode") REFERENCES "Master" ("master") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CourseOccasion" ("courseCode", "id", "semester", "year") SELECT "courseCode", "id", "semester", "year" FROM "CourseOccasion";
DROP TABLE "CourseOccasion";
ALTER TABLE "new_CourseOccasion" RENAME TO "CourseOccasion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
