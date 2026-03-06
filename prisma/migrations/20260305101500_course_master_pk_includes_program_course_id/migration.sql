-- Make CourseMaster unique per program course cohort (year) as well.
ALTER TABLE "CourseMaster" DROP CONSTRAINT "CourseMaster_pkey";

ALTER TABLE "CourseMaster"
ADD CONSTRAINT "CourseMaster_pkey"
PRIMARY KEY ("master", "masterProgram", "courseCode", "programCourseID");
