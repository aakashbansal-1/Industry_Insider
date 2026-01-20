import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Insight {
  title: string;
  content: string;
  icon: string;
}

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  snippet: string;
  date?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
}

export const getIndustryInsights = async (industry: string, geo: string): Promise<Insight[]> => {
  const prompt = `Analyze the "${industry}" industry in ${geo}. Provide 4 key strategic insights or trends currently shaping this industry in this region. 
  For each insight, provide a short catchy title, a detailed explanation (2-3 sentences), and suggest a Lucide icon name (e.g., 'TrendingUp', 'Zap', 'Globe', 'Users', 'Shield', 'Target') that fits best.
  
  Return the response as a JSON array of objects with keys: title, content, icon.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              icon: { type: Type.STRING },
            },
            required: ["title", "content", "icon"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Insight[];
  } catch (error) {
    console.error("Error fetching insights:", error);
    return [];
  }
};

export const getIndustryNews = async (industry: string, geo: string): Promise<NewsArticle[]> => {
   const prompt = `You are a news aggregator. Search for the latest news in the "${industry}" industry in ${geo} from the last 3 days.
   Strictly filter for articles published within the last 72 hours.
   Return a JSON array of 5 news articles. For each article, include:
   - title: The headline
   - source: The publisher name
   - date: Approximate date (e.g. "2 hours ago", "1 day ago")
   - snippet: A 1-sentence summary
   - url: A relevant URL found in the search results (if you can't find a specific one, leave empty)
   
   Ensure the data is real, based on the search results, and strictly recent (max 3 days old).`;

   try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              source: { type: Type.STRING },
              date: { type: Type.STRING },
              snippet: { type: Type.STRING },
              url: { type: Type.STRING },
            },
            required: ["title", "source", "snippet"],
          },
        },
      },
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as NewsArticle[];
   } catch (e) {
     console.error("News fetch failed", e);
     return [];
   }
}

export const getIndustryQuiz = async (industry: string, geo: string): Promise<QuizQuestion[]> => {
  const prompt = `Create a 5-question multiple choice quiz about the "${industry}" industry in ${geo}.
  Questions should test knowledge of current trends, major players, or fundamental concepts relevant to this region.
  
  Return a JSON array of objects with:
  - question: string
  - options: array of 4 strings
  - correctAnswer: integer (0-3 index of the correct option)
  - explanation: string (brief explanation of why the answer is correct)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
            },
            required: ["question", "options", "correctAnswer", "explanation"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return [];
  }
};
