import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RiskReport } from "../types";

const MODEL = "gemini-3-flash-preview";

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

/** Shape of a search grounding chunk returned alongside the report. */
interface WebGroundingChunk {
  web?: { uri?: string; title?: string };
}

let client: GoogleGenAI | null = null;

/** Lazily creates the shared Gemini client so it is built once, not per call. */
function getClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Add it to your .env file.");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

/**
 * Extracts the JSON payload from the model response, tolerating the
 * markdown code fences models sometimes wrap around structured output.
 */
function parseReportJson(responseText: string): RiskReport {
  const cleaned = responseText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '');

  try {
    return JSON.parse(cleaned) as RiskReport;
  } catch (error) {
    console.error("Failed to parse model response as JSON:", error, cleaned);
    throw new Error(
      "The AI returned a response that could not be read. Please try again.",
    );
  }
}

/** Collects unique, attributable web sources from the grounding metadata. */
function extractSources(chunks: WebGroundingChunk[]): RiskReport['sources'] {
  const seen = new Set<string>();
  const sources: NonNullable<RiskReport['sources']> = [];
  for (const chunk of chunks) {
    const { uri, title } = chunk.web ?? {};
    if (uri && title && !seen.has(uri)) {
      seen.add(uri);
      sources.push({ title, uri });
    }
  }
  return sources;
}

export const analyzePortfolioRisk = async (
  assets: string[],
  category: string
): Promise<RiskReport> => {
  const prompt = `
    Conduct a comprehensive market search for the latest news, sentiment, and technical data regarding these ${category} assets: ${assets.join(", ")}.

    Identify key market drivers, current volatility regimes, and specific asset performance catalysts from the search results.
    Generate a JSON risk report based on this real-time intelligence.
  `;

  try {
    const response = await getClient().models.generateContent({
      model: MODEL,
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

    const report = parseReportJson(responseText);

    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    report.sources = extractSources(groundingChunks as WebGroundingChunk[]);

    return report;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
