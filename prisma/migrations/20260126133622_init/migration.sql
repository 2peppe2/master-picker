/*
  Warnings:

  - You are about to drop the `_CourseToCoursesRequirement` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `programCourseID` to the `CourseMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programCourseID` to the `CourseOccasion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programCourseID` to the `Examination` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_CourseToCoursesRequirement_B_index";

-- DropIndex
DROP INDEX "_CourseToCoursesRequirement_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CourseToCoursesRequirement";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CourseRequirementCourse" (
    "coursesRequirementId" INTEGER NOT NULL,
    "courseCode" TEXT NOT NULL,
    "programCourseID" INTEGER NOT NULL,

    PRIMARY KEY ("coursesRequirementId", "courseCode", "programCourseID"),
    CONSTRAINT "CourseRequirementCourse_coursesRequirementId_fkey" FOREIGN KEY ("coursesRequirementId") REFERENCES "CoursesRequirement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CourseRequirementCourse_courseCode_programCourseID_fkey" FOREIGN KEY ("courseCode", "programCourseID") REFERENCES "Course" ("code", "programCourseID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "code" TEXT NOT NULL,
    "programCourseID" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "examiner" TEXT NOT NULL,
    "ecv" TEXT NOT NULL,
    "prerequisitesText" TEXT NOT NULL,
    "scheduledHours" INTEGER NOT NULL,
    "selfStudyHours" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("code", "programCourseID"),
    CONSTRAINT "Course_programCourseID_fkey" FOREIGN KEY ("programCourseID") REFERENCES "ProgramCourse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("code", "credits", "ecv", "examiner", "level", "link", "name", "prerequisitesText", "programCourseID", "scheduledHours", "selfStudyHours", "updatedAt") SELECT "code", "credits", "ecv", "examiner", "level", "link", "name", "prerequisitesText", "programCourseID", "scheduledHours", "selfStudyHours", "updatedAt" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE TABLE "new_CourseMaster" (
    "master" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "programCourseID" INTEGER NOT NULL,

    PRIMARY KEY ("master", "courseCode"),
    CONSTRAINT "CourseMaster_master_fkey" FOREIGN KEY ("master") REFERENCES "Master" ("master") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CourseMaster_courseCode_programCourseID_fkey" FOREIGN KEY ("courseCode", "programCourseID") REFERENCES "Course" ("code", "programCourseID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CourseMaster" ("courseCode", "master") SELECT "courseCode", "master" FROM "CourseMaster";
DROP TABLE "CourseMaster";
ALTER TABLE "new_CourseMaster" RENAME TO "CourseMaster";
CREATE TABLE "new_CourseOccasion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "programCourseID" INTEGER NOT NULL,
    CONSTRAINT "CourseOccasion_courseCode_programCourseID_fkey" FOREIGN KEY ("courseCode", "programCourseID") REFERENCES "Course" ("code", "programCourseID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CourseOccasion" ("courseCode", "id", "semester", "year") SELECT "courseCode", "id", "semester", "year" FROM "CourseOccasion";
DROP TABLE "CourseOccasion";
ALTER TABLE "new_CourseOccasion" RENAME TO "CourseOccasion";
CREATE TABLE "new_Examination" (
    "credits" INTEGER NOT NULL,
    "module" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "programCourseID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "scale" TEXT NOT NULL DEFAULT 'G_OR_U',

    PRIMARY KEY ("courseCode", "module"),
    CONSTRAINT "Examination_courseCode_programCourseID_fkey" FOREIGN KEY ("courseCode", "programCourseID") REFERENCES "Course" ("code", "programCourseID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Examination" ("courseCode", "credits", "module", "name", "scale") SELECT "courseCode", "credits", "module", "name", "scale" FROM "Examination";
DROP TABLE "Examination";
ALTER TABLE "new_Examination" RENAME TO "Examination";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
