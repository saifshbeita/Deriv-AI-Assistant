import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RiskReport } from "../types";

const SYSTEM_INSTRUCTION = `
You are the "Deriv AI Assistant", an elite financial risk analyst for institutional and retail traders.
Your visual style is bold, serious, and direct.
Your role is to strictly analyze real-time market data found via search and provide a risk assessment report.
You prioritize capital preservation, volatility assessment, and clear market regime identification.

CRITICAL RULES:
1. You MUST NEVER provide direct financial advice (e.g., "Buy BTC", "Sell AAPL"). 
2. Instead, provide "exposure adjustments", "volatility warnings", or "hedging strategies".
3. Maintain a professional, objective tone suitable for a trading desk.
4. Synthesize the search results to form a coherent view.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    marketRegime: {
      type: Type.STRING,
      description: "Current market environment (e.g., 'Risk-Off', 'Range-Bound', 'High Volatility', 'Trend Continuation')."
    },
    riskScore: {
      type: Type.NUMBER,
      description: "Overall portfolio risk score from 0 (Safe) to 100 (Extreme Danger)."
    },
    keyDrivers: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of top 3-5 macro or micro events driving the market."
    },
    assetAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          asset: { type: Type.STRING },
          sentiment: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
          impactDescription: { type: Type.STRING, description: "Specific impact analysis for this asset." },
          shortTermPressure: { type: Type.NUMBER, description: "0-100 gauge of selling pressure (100 = max selling pressure)." }
        },
        required: ['asset', 'sentiment', 'impactDescription', 'shortTermPressure']
      }
    },
    institutionalStrategy: {
      type: Type.STRING,
      description: "A paragraph outlining a defensive or opportunistic strategy. Professional tone."
    },
    disclaimer: {
      type: Type.STRING,
      description: "A brief standard risk disclaimer."
    }
  },
  required: ['marketRegime', 'riskScore', 'keyDrivers', 'assetAnalysis', 'institutionalStrategy', 'disclaimer']
};

export const analyzePortfolioRisk = async (
  assets: string[],
  category: string
): Promise<RiskReport> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Conduct a comprehensive market search for the latest news, sentiment, and technical data regarding these ${category} assets: ${assets.join(", ")}.
    
    Identify key market drivers, current volatility regimes, and specific asset performance catalysts from the search results.
    Generate a JSON risk report based on this real-time intelligence.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.1, 
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response generated from model.");
    }

    const report = JSON.parse(responseText) as RiskReport;

    // Extract grounding chunks (sources)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: { title: string; uri: string }[] = [];

    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    // Remove duplicates based on URI
    report.sources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

    return report;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};