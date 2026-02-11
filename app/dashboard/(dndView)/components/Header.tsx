import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { ChevronDown, Settings } from "lucide-react";

interface HeaderProps {
  showBachelor: boolean;
  setShowBachelor: (v: boolean) => void;
  children: ReactNode;
}

const Header: FC<HeaderProps> = ({
  showBachelor,
  setShowBachelor,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-card sticky top-0 z-40 w-full border-b border-primary/10 backdrop-blur-md bg-opacity-80">
      <div className="px-8 h-20 flex items-center justify-between gap-6">
        <div className="flex-1 min-w-0">{children}</div>

        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all border ${
              isOpen
                ? "bg-white/10 text-white border-white/10"
                : "text-zinc-400 border-transparent hover:bg-white/5 hover:text-zinc-200"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
              <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Layout Settings
                </p>
              </div>

              <div className="p-2">
                <button
                  onClick={() => setShowBachelor(!showBachelor)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 rounded-md hover:bg-white/10 transition-colors group"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      showBachelor
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-zinc-600 group-hover:border-zinc-400"
                    }`}
                  >
                    {showBachelor && (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex flex-col items-start">
                    <span>Show bachelor years</span>
                    <span className="text-[10px] text-zinc-500">
                      Semesters 1 - 6
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
