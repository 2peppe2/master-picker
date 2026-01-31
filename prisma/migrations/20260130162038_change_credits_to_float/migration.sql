-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "credits" REAL NOT NULL,
    "level" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "examiner" TEXT NOT NULL,
    "ecv" TEXT NOT NULL,
    "prerequisitesText" TEXT NOT NULL,
    "scheduledHours" INTEGER NOT NULL,
    "selfStudyHours" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Course" ("code", "credits", "ecv", "examiner", "level", "link", "name", "prerequisitesText", "scheduledHours", "selfStudyHours", "updatedAt") SELECT "code", "credits", "ecv", "examiner", "level", "link", "name", "prerequisitesText", "scheduledHours", "selfStudyHours", "updatedAt" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE TABLE "new_Examination" (
    "credits" REAL NOT NULL,
    "module" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scale" TEXT NOT NULL DEFAULT 'G_OR_U',

    PRIMARY KEY ("courseCode", "module"),
    CONSTRAINT "Examination_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Examination" ("courseCode", "credits", "module", "name", "scale") SELECT "courseCode", "credits", "module", "name", "scale" FROM "Examination";
DROP TABLE "Examination";
ALTER TABLE "new_Examination" RENAME TO "Examination";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
