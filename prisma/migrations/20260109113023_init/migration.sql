-- CreateTable
CREATE TABLE "Course" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "credits" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "examiner" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CourseMaster" (
    "master" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,

    PRIMARY KEY ("master", "courseCode"),
    CONSTRAINT "CourseMaster_master_fkey" FOREIGN KEY ("master") REFERENCES "Master" ("program") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CourseMaster_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CourseOccasion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    CONSTRAINT "CourseOccasion_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CourseOccasionBlock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseOccasionId" INTEGER NOT NULL,
    "block" INTEGER NOT NULL,
    CONSTRAINT "CourseOccasionBlock_courseOccasionId_fkey" FOREIGN KEY ("courseOccasionId") REFERENCES "CourseOccasion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CourseOccasionPeriod" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseOccasionId" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    CONSTRAINT "CourseOccasionPeriod_courseOccasionId_fkey" FOREIGN KEY ("courseOccasionId") REFERENCES "CourseOccasion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Examination" (
    "credits" INTEGER NOT NULL,
    "module" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "scale" TEXT NOT NULL DEFAULT 'G_OR_U',

    PRIMARY KEY ("courseCode", "module"),
    CONSTRAINT "Examination_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Master" (
    "program" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "CoursesRequirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requirementId" INTEGER NOT NULL,
    CONSTRAINT "CoursesRequirement_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreditRequirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "requirementId" INTEGER NOT NULL,
    CONSTRAINT "CreditRequirement_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Requirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "masterProgram" TEXT NOT NULL,
    CONSTRAINT "Requirement_masterProgram_fkey" FOREIGN KEY ("masterProgram") REFERENCES "Master" ("program") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CourseToCoursesRequirement" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CourseToCoursesRequirement_A_fkey" FOREIGN KEY ("A") REFERENCES "Course" ("code") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CourseToCoursesRequirement_B_fkey" FOREIGN KEY ("B") REFERENCES "CoursesRequirement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseOccasionBlock_courseOccasionId_block_key" ON "CourseOccasionBlock"("courseOccasionId", "block");

-- CreateIndex
CREATE UNIQUE INDEX "CourseOccasionPeriod_courseOccasionId_period_key" ON "CourseOccasionPeriod"("courseOccasionId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToCoursesRequirement_AB_unique" ON "_CourseToCoursesRequirement"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToCoursesRequirement_B_index" ON "_CourseToCoursesRequirement"("B");
