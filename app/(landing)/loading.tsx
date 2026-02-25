import { Skeleton } from "@/components/ui/skeleton";
import Header from "./Header";

const LandingLoading = () => {
  return (
    <div className="min-h-screen">
      <main className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <Header />

        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
          <Skeleton className="h-12 w-80" />
          <Skeleton className="h-12 w-80" />
          <div className="flex w-full flex-col items-center gap-3">
            <Skeleton className="h-12 w-80" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-12 w-80" />
          <Skeleton className="h-4 w-48" />
        </div>
      </main>
    </div>
  );
};

export default LandingLoading;
