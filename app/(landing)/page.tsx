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

const Header = () => (
  <header className="w-full py-6 px-4 flex flex-col items-center">
    <h1
      className="text-2xl md:text-6xl font-bold"
      style={{ fontFamily: '"DM Serif Text", serif' }}
    >
      LiU Master
    </h1>
    <p className="mb-8 max-w-xl text-center text-lg text-muted-foreground">
      Drop the crazy spreed sheets.
      <br />
      Embrace effortless course planning.
    </p>
  </header>
);

export default LandingPage;
