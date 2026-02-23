"use client";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { useAtomValue } from "jotai";
import { useSearchParams } from "next/navigation";

const Disclaimer = () => {
    const searchParams = useSearchParams();
    const program = searchParams.get("program");
    const { programId } = useAtomValue(userPreferencesAtom);
    const programLink = programId ? `https://studieinfo.liu.se/en/program/${program}/${programId}` : "https://studieinfo.liu.se/en/";
    
    return (
    <div className="flex items-center gap-2 mt-4 justify-center">
            <span className="text-xs text-muted-foreground mt-1">
              MasterPicker is a third-party site. Always verify content via the{" "}
              <a
                className="hover:underline"
                href={programLink}
                target="_blank"
                rel="noreferrer"
              >
                LiU program page
              </a>
              .
            </span>
          </div>
    );

}

export default Disclaimer;
