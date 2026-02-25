import { prisma } from "@/lib/prisma";
import LandingClientPage from "./LandingClientPage";
import Header from "./Header";

const LandingPage = async () => {

  const programs = await prisma.program.findMany({
    select: {
      program: true,
      name: true,
      shortname: true,
      programCourses: {
        select: {
          startYear: true,
        },
      },
      masters: {
        select: {
          master: true,
          name: true,
        },
      },
    },
  });
  return (
    <div className="min-h-screen ">
      <main className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <Header />
        <LandingClientPage programs={programs} />
      </main>
    </div>
  );
};

export default LandingPage;
