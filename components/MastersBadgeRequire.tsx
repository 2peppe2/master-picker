import { Badge } from "./ui/badge";
import { Pill, Joystick, BriefcaseBusiness, Sparkles, Shield, Pi, Server } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Fragment } from "react";

type MastersBadgeProps = {
    program: string;
}
const size = 16;


const programColors: Record<string, string> = {
    AI: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-300",
    MED: "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/20 dark:text-pink-300",
    SECURE: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-300",
    GAMES: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-300",
    IND: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/20 dark:text-amber-300",
    ALGO: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-300",
    SOFT: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300",
};
const programNames: Record<string, string> = {
    AI: "Artificial Intelligence & Machine Learning",
    MED: "Medical Informatics",
    SECURE: "Secure Systems",
    GAMES: "Computer Games Programming",
    IND: "Industrial Economics",
    ALGO: "Programming & Algorithms",
    SOFT: "Large-Scale\nSoftware Engineering",
};

const programIcons: Record<string, React.ReactNode> = {
    "AI": <Sparkles size={size} />,
    "MED": <Pill size={size} />,
    "SECURE": <Shield size={size} />,
    "GAMES": <Joystick size={size} />,
    "IND": <BriefcaseBusiness size={size} />,
    "ALGO": <Pi size={size} />,
    "SOFT": <Server size={size} />,
};

export const MastersBadgeRequire = ({ program }: MastersBadgeProps) => {


    return (
        <Tooltip>
            <TooltipTrigger asChild>
                    <Badge variant={"outline"} className={`mr-2 ${programColors[program]}`}>{programIcons[program]} 0%</Badge>
                
            </TooltipTrigger>
            <TooltipContent side='bottom'>
                {programNames[program]}
            </TooltipContent>
        </Tooltip>


    );
}