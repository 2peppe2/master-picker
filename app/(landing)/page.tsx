import { prisma } from "@/lib/prisma";
import LandingClientPage from "./LandingClientPage";

const LandingPage = async () => {
  const programs = await prisma.program.findMany({
    select: { 
      program: true,
      name: true,
      shortname: true,
      programCourses: {
        select: {
          startYear: true
        }
      } 
    },
    
  });
  return <LandingClientPage programs={programs} />;
};

export default LandingPage;
