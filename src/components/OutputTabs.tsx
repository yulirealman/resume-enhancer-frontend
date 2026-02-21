import * as React from "react";
import { cn } from "@/src/lib/utils";
import ReactMarkdown from "react-markdown";
import { EnhancementResponse } from "../lib/types";
import { FileText, Lightbulb, Tag } from "lucide-react";

import { translations, Language } from "../lib/translations";

interface OutputTabsProps {
  data: EnhancementResponse;
  uiLanguage: Language;
}

export function OutputTabs({ data, uiLanguage }: OutputTabsProps) {
  const t = translations[uiLanguage];
  const [activeTab, setActiveTab] = React.useState<"resume" | "keywords" | "suggestions">("resume");

  const tabs = [
    { id: "resume", label: t.optimizedResume, icon: FileText },
    { id: "keywords", label: t.keywords, icon: Tag },
    { id: "suggestions", label: t.suggestions, icon: Lightbulb },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex space-x-1 bg-zinc-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === tab.id
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-6 min-h-[400px]">
        {activeTab === "resume" && (
          <div className="prose prose-sm max-w-none prose-zinc">
            <ReactMarkdown>{data.optimizedResume}</ReactMarkdown>
          </div>
        )}

        {activeTab === "keywords" && (
          <div className="flex flex-wrap gap-2">
            {data.extractedKeywords.map((keyword, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-xs font-medium border border-zinc-200"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {activeTab === "suggestions" && (
          <ul className="space-y-4">
            {data.improvementSuggestions.map((suggestion, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-600">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center text-[10px] font-bold">
                  {i + 1}
                </span>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
