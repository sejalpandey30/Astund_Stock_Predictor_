export interface HistoricalPricePoint {
  date: string;
  price: number;
}

export interface CatalystItem {
  title: string;
  description: string;
}

export interface EarningsData {
  date: string;
  period: string;
  eps: string;
  epsEstimate: string;
  epsStatus: "beat" | "miss" | "inline" | string;
  revenue: string;
  revenueEstimate: string;
  revenueStatus: "beat" | "miss" | "inline" | string;
  takeaways: string[];
}

export interface MetricsExplanations {
  peRatio: string;
  debtToEquity: string;
  fcf: string;
  pegRatio: string;
}

export interface StockAnalysis {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: number | null;
  dividendYield: string;
  fcf: string;
  debtToEquity: string;
  pegRatio: number | null;
  summary: string;
  earnings: EarningsData;
  metricsExplanations: MetricsExplanations;
  bullCases: CatalystItem[];
  bearCases: CatalystItem[];
  historicalChartData: HistoricalPricePoint[];
  isLiveAPI?: boolean;
}

export interface PortfolioStock {
  id?: string;
  symbol: string;
  companyName: string;
  sharesOwned: number;
  averageBuyPrice: number;
  addedAt: number;
}

export interface ResearchNote {
  id?: string;
  symbol: string;
  noteText: string;
  rating: number; // 1 to 5 stars
  updatedAt: number;
}
