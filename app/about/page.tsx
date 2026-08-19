"use client";

import Translate from "@/common/components/translate/Translate";
import DevelopersSection from "@/features/about/components/DevelopersSection";
import HonorableMentions from "@/features/about/components/HonorableMentions";
import WhyWeBuiltItCard from "@/features/about/components/WhyWeBuiltItCard";
import MoreDevelopers from "@/features/about/components/MoreDevelopers";
import SupportCard from "@/features/about/components/SupportCard";
import Header from "@/features/about/components/Header";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

const AboutPage = () => (
  <Suspense fallback={<div className="min-h-screen bg-background" />}>
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* md: is live on a landscape phone, so md:py-24 would spend half the
          viewport on padding; the landscape overrides come last and win. */}
      <main
        className={cn(
          "mx-auto w-full max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-12",
          "md:pb-24 md:pt-24",
          "landscape-phone:px-6 landscape-phone:pb-8 landscape-phone:pt-6",
        )}
      >
        <Header />
        {/* The 2-col split is lg:-gated, so a 932px-wide phone would stack
            these despite having the width to spare. */}
        <section
          className={cn(
            "mt-8 grid gap-4 sm:gap-6 lg:mt-10 lg:grid-cols-[2fr_1fr]",
            "landscape-phone:mt-5 landscape-phone:grid-cols-[2fr_1fr]",
          )}
        >
          <WhyWeBuiltItCard />
          <SupportCard />
        </section>
        <h2 className="mt-12 text-2xl font-semibold landscape-phone:mt-6">
          <Translate text="about_devs_title" />
        </h2>
        <section
          className={cn(
            "mt-6 grid items-stretch gap-4 sm:gap-6 md:grid-cols-2",
            "lg:grid-cols-3",
            "landscape-phone:mt-4 landscape-phone:grid-cols-3",
          )}
        >
          <DevelopersSection />
          <div className="flex flex-col gap-6 lg:col-span-1 landscape-phone:gap-4">
            <HonorableMentions />
            <MoreDevelopers />
          </div>
        </section>
        <footer
          className={cn(
            "mt-20 text-center text-sm text-muted-foreground",
            "landscape-phone:mt-8",
          )}
        >
          &copy; {new Date().getFullYear()} MasterPicker.{" "}
          <Translate text="_about_copyright" />
        </footer>
      </main>
    </div>
  </Suspense>
);

export default AboutPage;
