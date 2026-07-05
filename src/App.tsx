import { useState, useEffect } from "react";
import { StockAnalysis } from "./types";
import SearchHeader from "./components/SearchHeader";
import PriceOverviewCard from "./components/PriceOverviewCard";
import KeyMetricsExplainer from "./components/KeyMetricsExplainer";
import BullBearCases from "./components/BullBearCases";
import EarningsSummary from "./components/EarningsSummary";
import ResearchNotebook from "./components/ResearchNotebook";
import PortfolioTracker from "./components/PortfolioTracker";
import { Loader2, TrendingUp, Compass, Award, ShieldAlert, BarChart2 } from "lucide-react";

export default function App() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [stockData, setStockData] = useState<StockAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchStockData = async (symbol: string, forceRefresh = false) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch("/api/stocks/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol, forceRefresh }),
      });

      if (!response.ok) {
        throw new Error("Failed to compile financial research. Please check backend logs.");
      }

      const data = await response.json();
      setStockData(data);
      setSelectedSymbol(data.symbol);
    } catch (err: any) {
      console.error("Error fetching stock data:", err);
      setApiError(err.message || "An unexpected error occurred while analyzing the stock.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData(selectedSymbol);
  }, [selectedSymbol]);

  const handleSelectSymbol = (symbol: string) => {
    fetchStockData(symbol);
  };

  const handleForceRefresh = () => {
    fetchStockData(selectedSymbol, true);
  };

  return (
    <div id="main-app-shell" className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans select-none pb-12 relative overflow-hidden">
      {/* Animated-feel Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/15 rounded-full blur-[100px]"></div>
      </div>

      {/* Search and Navigation Bar */}
      <div className="relative z-20">
        <SearchHeader
          onSelectSymbol={handleSelectSymbol}
          isLoading={isLoading}
          currentSymbol={selectedSymbol}
          onRefresh={handleForceRefresh}
          apiError={apiError}
        />
      </div>

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6">
        {/* Market Highlights Banner */}
        <div id="market-news-ticker" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Executive Investment Terminal</p>
              <p className="text-xs text-slate-400">
                Grounded intelligence compiling instant reports, SEC filings, and macro financial models.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Operational Mode:</span>
            {stockData?.isLiveAPI ? (
              <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
                Alpha Vantage Live + AI
              </span>
            ) : (
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                Search Grounded AI
              </span>
            )}
          </div>
        </div>

        {/* Loading Skeleton Panel */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="lg:col-span-2 space-y-6">
              {/* Price card skeleton */}
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl h-96 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-6 w-1/3 bg-white/5 rounded-lg"></div>
                  <div className="h-10 w-1/4 bg-white/5 rounded-lg"></div>
                </div>
                <div className="h-44 bg-white/5 rounded-xl"></div>
              </div>
              {/* Bull bear skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl h-80"></div>
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl h-80"></div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Metrics explainer skeleton */}
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl h-96"></div>
              {/* Portfolio skeleton */}
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl h-60"></div>
              {/* Notebook skeleton */}
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl h-80"></div>
            </div>
          </div>
        ) : stockData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Primary Reports and Catalyst columns */}
            <div id="dashboard-main-column" className="lg:col-span-2 space-y-6 flex flex-col">
              <PriceOverviewCard
                symbol={stockData.symbol}
                companyName={stockData.companyName}
                currentPrice={stockData.currentPrice}
                change={stockData.change}
                changePercent={stockData.changePercent}
                marketCap={stockData.marketCap}
                dividendYield={stockData.dividendYield}
                summary={stockData.summary}
                chartData={stockData.historicalChartData}
              />

              <BullBearCases
                bullCases={stockData.bullCases}
                bearCases={stockData.bearCases}
              />

              <EarningsSummary earnings={stockData.earnings} />
            </div>

            {/* Right Interactive sidebar controls */}
            <div id="dashboard-sidebar-column" className="space-y-6 flex flex-col">
              <KeyMetricsExplainer
                peRatio={stockData.peRatio}
                debtToEquity={stockData.debtToEquity}
                fcf={stockData.fcf}
                pegRatio={stockData.pegRatio}
                explanations={stockData.metricsExplanations}
              />

              <PortfolioTracker
                symbol={stockData.symbol}
                companyName={stockData.companyName}
                currentPrice={stockData.currentPrice}
              />

              <ResearchNotebook symbol={stockData.symbol} />
            </div>
          </div>
        ) : (
          <div id="dashboard-empty-state" className="flex flex-col items-center justify-center py-20 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl text-center px-4">
            <ShieldAlert className="w-12 h-12 text-rose-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-100">Research Compilation Failed</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-md">
              Could not analyze {selectedSymbol}. Please ensure you are online and have supplied a valid Gemini API key in the Secrets Panel.
            </p>
            <button
              onClick={() => fetchStockData(selectedSymbol)}
              className="mt-6 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
            >
              Retry Analysis
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
