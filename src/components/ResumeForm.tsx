import * as React from "react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Slider } from "./ui/Slider";
import { Toggle } from "./ui/Toggle";
import { EnhancementRequest, ApiConfig } from "../lib/types";
import { Sparkles } from "lucide-react";
import { translations, Language } from "../lib/translations";

type ResumeFormData = Omit<EnhancementRequest, keyof ApiConfig>;

interface ResumeFormProps {
  onSubmit: (data: ResumeFormData) => void;
  isLoading: boolean;
  uiLanguage: Language;
}

export function ResumeForm({ onSubmit, isLoading, uiLanguage }: ResumeFormProps) {
  const t = translations[uiLanguage];
  const [formData, setFormData] = React.useState<ResumeFormData>({
    experience: "",
    jobDescription: "",
    enhancementLevel: 50,
    atsOptimization: true,
    executiveTone: false,
    language: "English",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-zinc-900" />
          {t.paramsTitle}
        </CardTitle>
        <CardDescription>
          {t.paramsSubtitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.rawExperience}</label>
              <textarea
                required
                className="w-full min-h-[200px] p-3 rounded-md border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 resize-none"
                placeholder={t.placeholderExp}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.jobDescription}</label>
              <textarea
                required
                className="w-full min-h-[200px] p-3 rounded-md border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 resize-none"
                placeholder={t.placeholderJob}
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-zinc-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.outputLanguage}</label>
                <select
                  className="w-full p-2 rounded-md border border-zinc-200 text-sm focus:ring-2 focus:ring-zinc-950 outline-none bg-white"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                >
                  <option value="English">English</option>
                  <option value="Chinese">Chinese (中文)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                </select>
              </div>
              <Slider
                label={t.intensity}
                value={formData.enhancementLevel}
                onChange={(e) => setFormData({ ...formData, enhancementLevel: parseInt(e.target.value) })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Toggle
                label={t.atsOpt}
                description={t.atsDesc}
                checked={formData.atsOptimization}
                onChange={(e) => setFormData({ ...formData, atsOptimization: e.target.checked })}
              />
              <Toggle
                label={t.execTone}
                description={t.execDesc}
                checked={formData.executiveTone}
                onChange={(e) => setFormData({ ...formData, executiveTone: e.target.checked })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t.enhancingBtn : t.enhanceBtn}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
