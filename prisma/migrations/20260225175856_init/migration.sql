-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('HT', 'VT');

-- CreateEnum
CREATE TYPE "Scale" AS ENUM ('G_OR_U', 'U_THREE_FOUR_FIVE');

-- CreateEnum
CREATE TYPE "CoursesType" AS ENUM ('COURSE_SELECTION');

-- CreateEnum
CREATE TYPE "CreditType" AS ENUM ('CREDITS_ADVANCED_MASTER', 'CREDITS_ADVANCED_PROFILE', 'CREDITS_PROFILE_TOTAL', 'CREDITS_MASTER_TOTAL', 'CREDITS_TOTAL');

-- CreateTable
CREATE TABLE "Course" (
    "code" TEXT NOT NULL,
    "programCourseID" INTEGER NOT NULL,
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

    CONSTRAINT "Course_pkey" PRIMARY KEY ("code","programCourseID")
);

-- CreateTable
CREATE TABLE "CourseMaster" (
    "master" TEXT NOT NULL,
    "masterProgram" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "programCourseID" INTEGER NOT NULL,

    CONSTRAINT "CourseMaster_pkey" PRIMARY KEY ("master","masterProgram","courseCode")
);

-- CreateTable
CREATE TABLE "CourseOccasion" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "semester" "Semester" NOT NULL,
    "courseCode" TEXT NOT NULL,
    "programCourseID" INTEGER NOT NULL,

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
CREATE TABLE "CourseOccasionRecommendedMaster" (
    "courseOccasionId" INTEGER NOT NULL,
    "master" TEXT NOT NULL,
    "masterProgram" TEXT NOT NULL,

    CONSTRAINT "CourseOccasionRecommendedMaster_pkey" PRIMARY KEY ("courseOccasionId","master","masterProgram")
);

-- CreateTable
CREATE TABLE "Examination" (
    "credits" DOUBLE PRECISION NOT NULL,
    "module" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "programCourseID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "scale" "Scale" NOT NULL DEFAULT 'G_OR_U',

    CONSTRAINT "Examination_pkey" PRIMARY KEY ("courseCode","programCourseID","module")
);

-- CreateTable
CREATE TABLE "Master" (
    "master" TEXT NOT NULL,
    "name" TEXT,
    "icon" TEXT,
    "style" TEXT,
    "masterProgram" TEXT NOT NULL,

    CONSTRAINT "Master_pkey" PRIMARY KEY ("master","masterProgram")
);

-- CreateTable
CREATE TABLE "Program" (
    "program" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortname" TEXT NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("program")
);

-- CreateTable
CREATE TABLE "ProgramCourse" (
    "id" INTEGER NOT NULL,
    "program" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,

    CONSTRAINT "ProgramCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseRequirementCourse" (
    "coursesRequirementId" INTEGER NOT NULL,
    "courseCode" TEXT NOT NULL,
    "programCourseID" INTEGER NOT NULL,

    CONSTRAINT "CourseRequirementCourse_pkey" PRIMARY KEY ("coursesRequirementId","courseCode","programCourseID")
);

-- CreateTable
CREATE TABLE "CoursesRequirement" (
    "id" SERIAL NOT NULL,
    "type" "CoursesType" NOT NULL DEFAULT 'COURSE_SELECTION',
    "minCount" INTEGER NOT NULL DEFAULT 1,
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
    "program" TEXT NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseOccasionBlock_coursePeriodId_block_key" ON "CourseOccasionBlock"("coursePeriodId", "block");

-- CreateIndex
CREATE UNIQUE INDEX "CourseOccasionPeriod_courseOccasionId_period_key" ON "CourseOccasionPeriod"("courseOccasionId", "period");

-- CreateIndex
CREATE INDEX "CourseOccasionRecommendedMaster_master_masterProgram_idx" ON "CourseOccasionRecommendedMaster"("master", "masterProgram");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_programCourseID_fkey" FOREIGN KEY ("programCourseID") REFERENCES "ProgramCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMaster" ADD CONSTRAINT "CourseMaster_master_masterProgram_fkey" FOREIGN KEY ("master", "masterProgram") REFERENCES "Master"("master", "masterProgram") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMaster" ADD CONSTRAINT "CourseMaster_courseCode_programCourseID_fkey" FOREIGN KEY ("courseCode", "programCourseID") REFERENCES "Course"("code", "programCourseID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOccasion" ADD CONSTRAINT "CourseOccasion_courseCode_programCourseID_fkey" FOREIGN KEY ("courseCode", "programCourseID") REFERENCES "Course"("code", "programCourseID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOccasionBlock" ADD CONSTRAINT "CourseOccasionBlock_coursePeriodId_fkey" FOREIGN KEY ("coursePeriodId") REFERENCES "CourseOccasionPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOccasionPeriod" ADD CONSTRAINT "CourseOccasionPeriod_courseOccasionId_fkey" FOREIGN KEY ("courseOccasionId") REFERENCES "CourseOccasion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOccasionRecommendedMaster" ADD CONSTRAINT "CourseOccasionRecommendedMaster_courseOccasionId_fkey" FOREIGN KEY ("courseOccasionId") REFERENCES "CourseOccasion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOccasionRecommendedMaster" ADD CONSTRAINT "CourseOccasionRecommendedMaster_master_masterProgram_fkey" FOREIGN KEY ("master", "masterProgram") REFERENCES "Master"("master", "masterProgram") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examination" ADD CONSTRAINT "Examination_courseCode_programCourseID_fkey" FOREIGN KEY ("courseCode", "programCourseID") REFERENCES "Course"("code", "programCourseID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_masterProgram_fkey" FOREIGN KEY ("masterProgram") REFERENCES "Program"("program") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramCourse" ADD CONSTRAINT "ProgramCourse_program_fkey" FOREIGN KEY ("program") REFERENCES "Program"("program") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRequirementCourse" ADD CONSTRAINT "CourseRequirementCourse_coursesRequirementId_fkey" FOREIGN KEY ("coursesRequirementId") REFERENCES "CoursesRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRequirementCourse" ADD CONSTRAINT "CourseRequirementCourse_courseCode_programCourseID_fkey" FOREIGN KEY ("courseCode", "programCourseID") REFERENCES "Course"("code", "programCourseID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursesRequirement" ADD CONSTRAINT "CoursesRequirement_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditRequirement" ADD CONSTRAINT "CreditRequirement_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_masterProgram_program_fkey" FOREIGN KEY ("masterProgram", "program") REFERENCES "Master"("master", "masterProgram") ON DELETE CASCADE ON UPDATE CASCADE;
