import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Model priority: try gemini-2.0-flash, fallback options noted in comments
const MODEL_NAME = "gemini-2.5-flash";
// Fallback: "gemini-2.5-flash-lite-preview-06-17"

export const enhanceResume = async (resumeData, jobDescription = "") => {
  const prompt = buildPrompt(resumeData, jobDescription);

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  const enhanced = JSON.parse(text);
  return enhanced;
};

function buildPrompt(resumeData, jobDescription) {
  const jobContext = jobDescription
    ? `\n\nThe user is targeting this job:\n"""${jobDescription}"""\nTailor the improvements to match this job description. Use relevant keywords and highlight transferable skills.`
    : "";

  return `You are an expert resume writer and ATS optimization specialist.

Given the following resume data, improve and enhance it. Make the bullet points more impactful using the STAR method (Situation, Task, Action, Result) where appropriate. Use strong action verbs and quantify achievements when possible.

Resume Data:
${JSON.stringify(resumeData, null, 2)}
${jobContext}

Return a JSON object with ONLY the enhanced fields in this exact structure:
{
  "summary": "An improved professional summary (1-2 sentences)",
  "projects": [
    {
      "title": "Same or improved project title",
      "points": [
        "Enhanced bullet point 1",
        "Enhanced bullet point 2"
      ]
    }
  ]
}

Rules:
1. Keep the same number of projects and roughly the same number of bullet points per project
2. Do NOT invent new achievements or technologies that weren't mentioned
3. Make bullet points concise but impactful (1 line each)
4. Start each bullet point with a strong action verb (Developed, Engineered, Implemented, Architected, etc.)
5. Where the original mentions numbers/metrics, keep them. Add plausible metrics only if clearly implied.
6. The summary should be a brief professional overview based on the skills and projects shown
7. Return ONLY valid JSON, no markdown formatting`;
}

// Field-level enhancement — works without saving the resume
export const enhanceField = async (
  text,
  fieldType = "bullet_point",
  context = "",
) => {
  const prompts = {
    bullet_point: `You are an expert resume writer. Enhance this resume bullet point to be more impactful. Use a strong action verb, quantify results where possible, and keep it to one concise line.

Original: "${text}"
${context ? `Context (project/role): ${context}` : ""}

Return ONLY a JSON object: { "enhanced": "your improved text" }`,

    description: `You are an expert resume writer. Improve this project description to be more compelling and professional. Keep it brief (1-2 sentences).

Original: "${text}"
${context ? `Context: ${context}` : ""}

Return ONLY a JSON object: { "enhanced": "your improved text" }`,

    title: `You are an expert resume writer. If this project title can be made more professional or descriptive, improve it. Otherwise keep it as is.

Original: "${text}"

Return ONLY a JSON object: { "enhanced": "your improved text" }`,

    summary: `You are an expert resume writer. Write a compelling professional summary (2-3 sentences) based on this input. Highlight key strengths and experience areas.

Original: "${text}"
${context ? `Skills/projects context: ${context}` : ""}

Return ONLY a JSON object: { "enhanced": "your improved text" }`,
  };

  const prompt = prompts[fieldType] || prompts.bullet_point;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const result = JSON.parse(response.text);
  return result.enhanced;
};
