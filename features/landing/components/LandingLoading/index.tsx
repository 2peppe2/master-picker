import LandingFormLoading from "./components/LandingFormLoading";
import LandingHeaderLoading from "./components/LandingHeaderLoading";
import LandingLanguageLoading from "./components/LandingLanguageLoading";
import { cn } from "@/lib/utils";
import type { FC } from "react";

const LandingLoading: FC = () => (
  <div className="flex min-h-[100dvh] flex-col">
    <LandingLanguageLoading />
    <main
      className={cn(
        "mx-auto flex w-full max-w-4xl flex-1 flex-col items-center",
        "justify-center gap-8 px-4 pb-16 text-center",
        "landscape-phone:max-w-2xl landscape-phone:flex-row",
        "landscape-phone:items-center landscape-phone:justify-center",
        "landscape-phone:gap-8 landscape-phone:px-6 landscape-phone:pb-4",
        "landscape-phone:text-left",
      )}
    >
      <LandingHeaderLoading />
      <LandingFormLoading />
    </main>
  </div>
);

export { default as LandingFormLoading } from "./components/LandingFormLoading";
export default LandingLoading;
