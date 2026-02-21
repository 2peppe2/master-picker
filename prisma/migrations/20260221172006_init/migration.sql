-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('HT', 'VT');

-- CreateEnum
CREATE TYPE "Scale" AS ENUM ('G_OR_U', 'U_THREE_FOUR_FIVE');

-- CreateEnum
CREATE TYPE "CoursesType" AS ENUM ('COURSES_OR');

-- CreateEnum
CREATE TYPE "CreditType" AS ENUM ('A_LEVEL', 'G_LEVEL', 'TOTAL');

-- CreateTable
CREATE TABLE "Course" (
    "code" TEXT NOT NULL,
    "credits" DOUBLE PRECISION NOT NULL,
    "level" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "examiner" TEXT NOT NULL,
    "ecv" TEXT NOT NULL,
    "prerequisitesText" TEXT NOT NULL,
    "scheduledHours" INTEGER NOT NULL,
    "selfStudyHours" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CourseMaster" (
    "master" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,

    CONSTRAINT "CourseMaster_pkey" PRIMARY KEY ("master","courseCode")
);

-- CreateTable
CREATE TABLE "CourseOccasion" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "semester" "Semester" NOT NULL,
    "courseCode" TEXT NOT NULL,

    CONSTRAINT "CourseOccasion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseOccasionBlock" (
    "id" SERIAL NOT NULL,
    "coursePeriodId" INTEGER NOT NULL,
    "block" INTEGER NOT NULL,

    CONSTRAINT "CourseOccasionBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseOccasionPeriod" (
    "id" SERIAL NOT NULL,
    "courseOccasionId" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,

    CONSTRAINT "CourseOccasionPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Examination" (
    "credits" DOUBLE PRECISION NOT NULL,
    "module" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scale" "Scale" NOT NULL DEFAULT 'G_OR_U',

    CONSTRAINT "Examination_pkey" PRIMARY KEY ("courseCode","module")
);

-- CreateTable
CREATE TABLE "Master" (
    "master" TEXT NOT NULL,
    "name" TEXT,
    "icon" TEXT,
    "style" TEXT,

    CONSTRAINT "Master_pkey" PRIMARY KEY ("master")
);

-- CreateTable
CREATE TABLE "Program" (
    "program" TEXT NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("program")
);

-- CreateTable
CREATE TABLE "CoursesRequirement" (
    "id" SERIAL NOT NULL,
    "type" "CoursesType" NOT NULL,
    "requirementId" INTEGER NOT NULL,

    CONSTRAINT "CoursesRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditRequirement" (
    "id" SERIAL NOT NULL,
    "type" "CreditType" NOT NULL,
    "credits" INTEGER NOT NULL,
    "requirementId" INTEGER NOT NULL,

    CONSTRAINT "CreditRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirement" (
    "id" SERIAL NOT NULL,
    "masterProgram" TEXT NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToProgram" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToProgram_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CourseToCoursesRequirement" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CourseToCoursesRequirement_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CourseOccasionToMaster" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseOccasionToMaster_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseOccasionBlock_coursePeriodId_block_key" ON "CourseOccasionBlock"("coursePeriodId", "block");

-- CreateIndex
CREATE UNIQUE INDEX "CourseOccasionPeriod_courseOccasionId_period_key" ON "CourseOccasionPeriod"("courseOccasionId", "period");

-- CreateIndex
CREATE INDEX "_CourseToProgram_B_index" ON "_CourseToProgram"("B");

-- CreateIndex
CREATE INDEX "_CourseToCoursesRequirement_B_index" ON "_CourseToCoursesRequirement"("B");

-- CreateIndex
CREATE INDEX "_CourseOccasionToMaster_B_index" ON "_CourseOccasionToMaster"("B");

-- AddForeignKey
ALTER TABLE "CourseMaster" ADD CONSTRAINT "CourseMaster_master_fkey" FOREIGN KEY ("master") REFERENCES "Master"("master") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMaster" ADD CONSTRAINT "CourseMaster_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOccasion" ADD CONSTRAINT "CourseOccasion_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOccasionBlock" ADD CONSTRAINT "CourseOccasionBlock_coursePeriodId_fkey" FOREIGN KEY ("coursePeriodId") REFERENCES "CourseOccasionPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOccasionPeriod" ADD CONSTRAINT "CourseOccasionPeriod_courseOccasionId_fkey" FOREIGN KEY ("courseOccasionId") REFERENCES "CourseOccasion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examination" ADD CONSTRAINT "Examination_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursesRequirement" ADD CONSTRAINT "CoursesRequirement_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditRequirement" ADD CONSTRAINT "CreditRequirement_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_masterProgram_fkey" FOREIGN KEY ("masterProgram") REFERENCES "Master"("master") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToProgram" ADD CONSTRAINT "_CourseToProgram_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToProgram" ADD CONSTRAINT "_CourseToProgram_B_fkey" FOREIGN KEY ("B") REFERENCES "Program"("program") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCoursesRequirement" ADD CONSTRAINT "_CourseToCoursesRequirement_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCoursesRequirement" ADD CONSTRAINT "_CourseToCoursesRequirement_B_fkey" FOREIGN KEY ("B") REFERENCES "CoursesRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseOccasionToMaster" ADD CONSTRAINT "_CourseOccasionToMaster_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseOccasion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseOccasionToMaster" ADD CONSTRAINT "_CourseOccasionToMaster_B_fkey" FOREIGN KEY ("B") REFERENCES "Master"("master") ON DELETE CASCADE ON UPDATE CASCADE;
