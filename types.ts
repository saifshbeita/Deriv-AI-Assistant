export interface AssetImpact {
  asset: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impactDescription: string;
  shortTermPressure: number; // 0 to 100
}

export interface RiskReport {
  marketRegime: string;
  riskScore: number; // 0 (Low Risk) to 100 (Extreme Risk)
  keyDrivers: string[];
  assetAnalysis: AssetImpact[];
  institutionalStrategy: string;
  disclaimer: string;
  sources?: { title: string; uri: string }[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  report: RiskReport | null;
}

// Mock news is no longer needed but keeping it empty or unused is fine, 
// removing it to clean up.
export const MOCK_NEWS = ``;