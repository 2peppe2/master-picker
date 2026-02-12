import Schedule from "../../(schedule)/Schedule";
import Header from "./Header";

const MainSection = () => (
  <main className="flex flex-col h-screen bg-black/50 min-w-0 w-full relative">
    <Header/>

    <div className="bg-card overflow-y-auto flex flex-col flex-1 px-8 gap-4 py-8">
      <Schedule />
    </div>
  </main>
);

export default MainSection;
