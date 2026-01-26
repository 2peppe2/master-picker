/*
  Warnings:

  - The primary key for the `Examination` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Examination" (
    "credits" INTEGER NOT NULL,
    "module" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "programCourseID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "scale" TEXT NOT NULL DEFAULT 'G_OR_U',

    PRIMARY KEY ("courseCode", "programCourseID", "module"),
    CONSTRAINT "Examination_courseCode_programCourseID_fkey" FOREIGN KEY ("courseCode", "programCourseID") REFERENCES "Course" ("code", "programCourseID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Examination" ("courseCode", "credits", "module", "name", "programCourseID", "scale") SELECT "courseCode", "credits", "module", "name", "programCourseID", "scale" FROM "Examination";
DROP TABLE "Examination";
ALTER TABLE "new_Examination" RENAME TO "Examination";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
