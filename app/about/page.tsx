"use client";

import Translate from "@/common/components/translate/Translate";
import DevelopersSection from "./components/DevelopersSection";
import HonorableMentions from "./components/HonorableMentions";
import WhyWeBuiltItCard from "./components/WhyWeBuiltItCard";
import MoreDevelopers from "./components/MoreDevelopers";
import SupportCard from "./components/SupportCard";
import Header from "./components/Header";
import { Suspense } from "react";

const AboutPage = () => (
  <Suspense fallback={<div className="min-h-screen bg-background" />}>
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <main className="mx-auto w-full max-w-6xl px-6 pb-12 pt-12 md:pb-24 md:pt-24">
        <Header />
        <section className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <WhyWeBuiltItCard />
          <SupportCard />
        </section>
        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          <Translate text="_about_devs_title" />
        </h2>
        <section className="mt-6 grid gap-6 items-stretch md:grid-cols-2 lg:grid-cols-3">
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
