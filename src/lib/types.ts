import { Language } from "./translations";

export interface ApiConfig {
  apiKey: string;
  modelName: string;
  uiLanguage: Language;
}

export interface EnhancementRequest extends ApiConfig {
  experience: string;
  jobDescription: string;
  enhancementLevel: number; // 0-100
  atsOptimization: boolean;
  executiveTone: boolean;
  language: "English" | "Japanese" | "Chinese";
}

export interface EnhancementResponse {
  optimizedResume: string;
  matchScore: number; // 0-100
  extractedKeywords: string[];
  improvementSuggestions: string[];
}
