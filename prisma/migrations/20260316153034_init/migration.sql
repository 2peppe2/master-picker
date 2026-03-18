-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_programCourseID_fkey" FOREIGN KEY ("programCourseID") REFERENCES "ProgramCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
