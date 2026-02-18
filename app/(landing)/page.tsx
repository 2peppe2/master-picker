import { prisma } from "@/lib/prisma";
import LandingClientPage from "./LandingClientPage";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ weight: "600", subsets: ["latin"] });

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
    <div className="flex items-center justify-center gap-4">
      <Image
        src="/logo/mp_logo.svg"
        alt="LiU Master Logo"
        width={100}
        height={100}
        className="mb-4"
      />
      <h1 className={`text-2xl md:text-7xl font-bold ${playfair.className}`}>
        Master Picker
      </h1>
    </div>

    <p className="mb-8 max-w-xl text-center text-lg text-muted-foreground">
      Drop the crazy spreed sheets, embrace effortless course planning.
    </p>
  </header>
);

export default LandingPage;
