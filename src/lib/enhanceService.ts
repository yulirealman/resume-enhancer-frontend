import OpenAI from "openai";
import { EnhancementRequest, EnhancementResponse } from "./types";

export async function enhanceResume(request: EnhancementRequest): Promise<EnhancementResponse> {
  const { apiKey, modelName, ...params } = request;

  if (!apiKey) {
    throw new Error("API Key is missing. Please configure it in settings.");
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  });

  const prompt = `
    # ROLE
    You are an expert Executive Resume Writer and ATS (Applicant Tracking System) Optimization Specialist.
    
    # TASK
    Optimize the user's "Raw Experience" to align perfectly with the "Target Job Description".
    
    # PARAMETERS
    - Output Language: ${params.language}
    - Enhancement Intensity: ${params.enhancementLevel}/100 (Higher means more significant rewriting)
    - ATS Optimization: ${params.atsOptimization ? 'ENABLED' : 'DISABLED'}
    - Executive Tone: ${params.executiveTone ? 'ENABLED' : 'DISABLED'}
    
    # INPUT DATA
    - RAW EXPERIENCE: 
    """
    ${params.experience}
    """
    
    - TARGET JOB DESCRIPTION:
    """
    ${params.jobDescription}
    """
    
    # OUTPUT REQUIREMENTS
    - The entire response (optimized resume, suggestions, etc.) MUST be in ${params.language}.
    - Return a JSON object with:
    1. "optimizedResume": The enhanced experience in professional Markdown format. Use bullet points.
    2. "matchScore": An integer (0-100) representing the alignment.
    3. "extractedKeywords": Top 10-15 relevant keywords from the job description used in the rewrite.
    4. "improvementSuggestions": 3-5 actionable tips to further improve the candidate's profile for this specific role.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: modelName || "qwen-plus",
      messages: [
        { role: "system", content: "You are a professional career coach and resume expert. Always respond in valid JSON format matching the requested schema." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("Empty response from AI");
    
    return JSON.parse(content) as EnhancementResponse;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    const message = error.response?.data?.error?.message || error.message || "Failed to connect to AI service";
    throw new Error(message);
  }
}
