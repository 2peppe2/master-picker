import MastersRequirementsBar from "../../(mastersRequirementsBar)/MastersRequirementsBar";
import Schedule from "../../(schedule)/Schedule";
import { useState } from "react";
import Header from "./Header";

const MainSection = () => {
  const [showBachelor, setShowBachelor] = useState(false);

  return (
    <main className="flex flex-col h-screen bg-black/50 min-w-0 w-full relative">
      <Header showBachelor={showBachelor} setShowBachelor={setShowBachelor}>
        <MastersRequirementsBar />
      </Header>

      <div className="bg-card overflow-y-auto flex flex-col flex-1 px-8 gap-4 py-8">
        <Schedule />
      </div>
    </main>
  );
};

export default MainSection;
