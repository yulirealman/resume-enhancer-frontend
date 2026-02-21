import * as React from "react";
import { ResumeForm } from "./components/ResumeForm";
import { OutputTabs } from "./components/OutputTabs";
import { MatchScore } from "./components/MatchScore";
import { SettingsDialog } from "./components/SettingsDialog";
import { EnhancementRequest, EnhancementResponse, ApiConfig } from "./lib/types";
import { translations, Language } from "./lib/translations";
import { motion, AnimatePresence } from "motion/react";
import { Layout, History, Settings, LogOut, Sparkles, AlertCircle } from "lucide-react";

export default function App() {
  const [result, setResult] = React.useState<EnhancementResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  
  const [apiConfig, setApiConfig] = React.useState<ApiConfig>(() => {
    const saved = localStorage.getItem("resume_ai_config");
    if (saved) {
      const config = JSON.parse(saved);
      return {
        ...config,
        uiLanguage: config.uiLanguage || "English"
      };
    }
    return { apiKey: "", modelName: "qwen-plus", uiLanguage: "English" };
  });

  const t = translations[apiConfig.uiLanguage || "English"];

  const saveConfig = (config: ApiConfig) => {
    setApiConfig(config);
    localStorage.setItem("resume_ai_config", JSON.stringify(config));
  };

  const handleEnhance = async (formData: Omit<EnhancementRequest, keyof ApiConfig>) => {
    if (!apiConfig.apiKey) {
      setError(t.configError);
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...apiConfig }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to enhance resume");
      }

      const resultData = await response.json();
      setResult(resultData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-right border-zinc-200 bg-white hidden lg:flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">ResumeAI</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={Layout} label={t.dashboard} active />
          <NavItem icon={History} label={t.history} />
          <NavItem 
            icon={Settings} 
            label={t.settings} 
            onClick={() => setIsSettingsOpen(true)} 
          />
        </nav>

        <div className="pt-6 border-t border-zinc-100">
          <NavItem icon={LogOut} label={t.signOut} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-sm font-medium text-zinc-500">{t.workspace} / {t.enhancer}</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200" />
          </div>
        </header>

        <div className="max-w-5xl mx-auto p-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{t.title}</h1>
            <p className="text-zinc-500">{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-7">
              <ResumeForm onSubmit={handleEnhance} isLoading={isLoading} uiLanguage={apiConfig.uiLanguage} />
            </div>

            <div className="xl:col-span-5 space-y-6">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm flex items-start gap-3"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <MatchScore score={result.matchScore} uiLanguage={apiConfig.uiLanguage} />
                    <OutputTabs data={result} uiLanguage={apiConfig.uiLanguage} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full min-h-[400px] border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center p-8 text-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-zinc-900">{t.noResults}</h3>
                      <p className="text-sm text-zinc-500 max-w-[240px]">
                        {t.noResultsDesc}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <SettingsDialog 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        config={apiConfig}
        onSave={saveConfig}
      />
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
