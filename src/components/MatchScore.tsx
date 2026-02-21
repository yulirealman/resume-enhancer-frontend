import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { translations, Language } from "../lib/translations";

interface MatchScoreProps {
  score: number;
  uiLanguage: Language;
}

export function MatchScore({ score, uiLanguage }: MatchScoreProps) {
  const t = translations[uiLanguage];
  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-600";
    if (s >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const getBgColor = (s: number) => {
    if (s >= 80) return "bg-emerald-50 border-emerald-100";
    if (s >= 60) return "bg-amber-50 border-amber-100";
    return "bg-rose-50 border-rose-100";
  };

  return (
    <div className={cn("p-6 rounded-xl border flex items-center justify-between", getBgColor(score))}>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-zinc-900">{t.matchScore}</h4>
        <p className="text-xs text-zinc-500">{t.matchDesc}</p>
      </div>
      <div className="relative flex items-center justify-center">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-zinc-200"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={175.9}
            initial={{ strokeDashoffset: 175.9 }}
            animate={{ strokeDashoffset: 175.9 - (175.9 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={getColor(score)}
          />
        </svg>
        <span className={cn("absolute text-lg font-bold font-mono", getColor(score))}>
          {score}
        </span>
      </div>
    </div>
  );
}
