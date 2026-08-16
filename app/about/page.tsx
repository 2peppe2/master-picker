"use client";

import Translate from "@/common/components/translate/Translate";
import DevelopersSection from "@/features/about/components/DevelopersSection";
import HonorableMentions from "@/features/about/components/HonorableMentions";
import WhyWeBuiltItCard from "@/features/about/components/WhyWeBuiltItCard";
import MoreDevelopers from "@/features/about/components/MoreDevelopers";
import SupportCard from "@/features/about/components/SupportCard";
import Header from "@/features/about/components/Header";
import { Suspense } from "react";

const AboutPage = () => (
  <Suspense fallback={<div className="min-h-screen bg-background" />}>
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-12 md:pb-24 md:pt-24">
        <Header />
        <section className="mt-8 grid gap-4 sm:gap-6 lg:mt-10 lg:grid-cols-[2fr_1fr]">
          <WhyWeBuiltItCard />
          <SupportCard />
        </section>
        <h2 className="mt-12 text-2xl font-semibold">
          <Translate text="_about_devs_title" />
        </h2>
        <section className="mt-6 grid items-stretch gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DevelopersSection />
          <div className="flex flex-col gap-6 lg:col-span-1">
            <HonorableMentions />
            <MoreDevelopers />
          </div>
        </section>
        <footer className="mt-20 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MasterPicker.{" "}
          <Translate text="_about_copyright" />
        </footer>
      </main>
    </div>
  </Suspense>
);

export default AboutPage;
