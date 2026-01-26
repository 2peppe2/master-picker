-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseRequirementCourse" (
    "coursesRequirementId" INTEGER NOT NULL,
    "courseCode" TEXT NOT NULL,
    "programCourseID" INTEGER NOT NULL,

    PRIMARY KEY ("coursesRequirementId", "courseCode", "programCourseID"),
    CONSTRAINT "CourseRequirementCourse_coursesRequirementId_fkey" FOREIGN KEY ("coursesRequirementId") REFERENCES "CoursesRequirement" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseRequirementCourse_courseCode_programCourseID_fkey" FOREIGN KEY ("courseCode", "programCourseID") REFERENCES "Course" ("code", "programCourseID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CourseRequirementCourse" ("courseCode", "coursesRequirementId", "programCourseID") SELECT "courseCode", "coursesRequirementId", "programCourseID" FROM "CourseRequirementCourse";
DROP TABLE "CourseRequirementCourse";
ALTER TABLE "new_CourseRequirementCourse" RENAME TO "CourseRequirementCourse";
CREATE TABLE "new_CoursesRequirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "requirementId" INTEGER NOT NULL,
    CONSTRAINT "CoursesRequirement_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CoursesRequirement" ("id", "requirementId", "type") SELECT "id", "requirementId", "type" FROM "CoursesRequirement";
DROP TABLE "CoursesRequirement";
ALTER TABLE "new_CoursesRequirement" RENAME TO "CoursesRequirement";
CREATE TABLE "new_CreditRequirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "requirementId" INTEGER NOT NULL,
    CONSTRAINT "CreditRequirement_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CreditRequirement" ("credits", "id", "requirementId", "type") SELECT "credits", "id", "requirementId", "type" FROM "CreditRequirement";
DROP TABLE "CreditRequirement";
ALTER TABLE "new_CreditRequirement" RENAME TO "CreditRequirement";
CREATE TABLE "new_Requirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "masterProgram" TEXT NOT NULL,
    CONSTRAINT "Requirement_masterProgram_fkey" FOREIGN KEY ("masterProgram") REFERENCES "Master" ("master") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Requirement" ("id", "masterProgram") SELECT "id", "masterProgram" FROM "Requirement";
DROP TABLE "Requirement";
ALTER TABLE "new_Requirement" RENAME TO "Requirement";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
