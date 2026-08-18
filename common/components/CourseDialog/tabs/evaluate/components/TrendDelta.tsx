import { TrendingDown, TrendingUp } from "lucide-react";
import { FC } from "react";

interface TrendDeltaProps {
  delta: number;
}

const TrendDelta: FC<TrendDeltaProps> = ({ delta }) => {
  const positive = delta >= 0;

  return (
    <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold tabular-nums ${positive ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" : "bg-red-500/12 text-red-600 dark:text-red-400"}`}>
      {positive ? <TrendingUp className="size-3.5" aria-hidden /> : <TrendingDown className="size-3.5" aria-hidden />}
      {positive ? "+" : "−"}
      {Math.abs(delta).toFixed(2)}
    </span>
  );
};

export default TrendDelta;
