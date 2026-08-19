"use client";

import GuideContent, {
  GuideClientPageProps,
} from "./components/GuideContent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { FC, Suspense, useState } from "react";

const GuideClientPage: FC<GuideClientPageProps> = (props) => {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <JotaiProvider>
        <Suspense fallback={null}>
          <GuideContent {...props} />
        </Suspense>
      </JotaiProvider>
    </QueryClientProvider>
  );
};

export default GuideClientPage;
