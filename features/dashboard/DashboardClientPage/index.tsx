"use client";

import DashboardContent, {
  DashboardClientPageProps,
} from "./components/DashboardContent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { FC, Suspense, useState } from "react";

const DashboardClientPage: FC<DashboardClientPageProps> = (props) => {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <JotaiProvider>
        <Suspense fallback={null}>
          <DashboardContent {...props} />
        </Suspense>
      </JotaiProvider>
    </QueryClientProvider>
  );
};

export default DashboardClientPage;
