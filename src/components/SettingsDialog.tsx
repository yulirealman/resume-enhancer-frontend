import * as React from "react";
import { cn } from "@/src/lib/utils";
import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/Card";

import { translations, Language } from "../lib/translations";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  config: { apiKey: string; modelName: string; uiLanguage: Language };
  onSave: (config: { apiKey: string; modelName: string; uiLanguage: Language }) => void;
}

export function SettingsDialog({ isOpen, onClose, config, onSave }: SettingsDialogProps) {
  const [localConfig, setLocalConfig] = React.useState(config);
  const t = translations[localConfig.uiLanguage || "English"];

  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-200">
        <Card className="shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t.apiConfig}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.apiKey}</label>
              <input
                type="password"
                className="w-full p-2 rounded-md border border-zinc-200 text-sm focus:ring-2 focus:ring-zinc-950 outline-none"
                placeholder="sk-..."
                value={localConfig.apiKey}
                onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
              />
              <p className="text-[10px] text-zinc-500">
                {t.keyDesc}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.modelName}</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border border-zinc-200 text-sm focus:ring-2 focus:ring-zinc-950 outline-none"
                placeholder="qwen-plus"
                value={localConfig.modelName}
                onChange={(e) => setLocalConfig({ ...localConfig, modelName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.uiLanguage}</label>
              <select
                className="w-full p-2 rounded-md border border-zinc-200 text-sm focus:ring-2 focus:ring-zinc-950 outline-none bg-white"
                value={localConfig.uiLanguage}
                onChange={(e) => setLocalConfig({ ...localConfig, uiLanguage: e.target.value as Language })}
              >
                <option value="English">English</option>
                <option value="Chinese">中文</option>
                <option value="Japanese">日本語</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>{t.cancel}</Button>
            <Button onClick={() => { onSave(localConfig); onClose(); }}>{t.save}</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
