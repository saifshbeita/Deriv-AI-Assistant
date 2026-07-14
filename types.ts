export interface AssetImpact {
  asset: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impactDescription: string;
  /** Short term pressure scale: 0 to 100 */
  shortTermPressure: number;
}

export interface RiskReport {
  marketRegime: string;
  /** Risk score scale: 0 (Low Risk) to 100 (Extreme Risk) */
  riskScore: number;
  keyDrivers: string[];
  assetAnalysis: AssetImpact[];
  institutionalStrategy: string;
  disclaimer: string;
  sources?: Array<{ title: string; uri: string }>;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  report: RiskReport | null;
}
