import LandingClientPage from "./LandingClientPage";
import { prisma } from "@/lib/prisma";
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
          requirements: {
            select: {
              masterProgram: true,
              master: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { startYear: "desc" },
      },
    },
  });

  const formattedPrograms = programs.map((p) => ({
    id: p.program,
    name: p.name,
    shortname: p.shortname,
    years: p.programCourses
      .map((pc) => ({
        year: pc.startYear,
        // Only show masters that have a curriculum (requirement) for this year
        masters: pc.requirements.map((r) => ({
          id: r.masterProgram,
          name: r.master.name,
        })),
      }))
      .sort((a, b) => a.year - b.year),
  }));

  return (
    <div className="min-h-screen ">
      <main className="flex flex-col items-center justify-center text-center px-4 pt-16 pb-8">
        <Header />
        <LandingClientPage programs={formattedPrograms} />
      </main>
    </div>
  );
};

export default LandingPage;
