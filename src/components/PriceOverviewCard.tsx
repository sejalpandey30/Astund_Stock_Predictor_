import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, BarChart2, Loader2 } from "lucide-react";
import { HistoricalPricePoint } from "../types";

interface PriceOverviewCardProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  marketCap: string;
  dividendYield: string;
  summary: string;
  chartData: HistoricalPricePoint[];
}

export default function PriceOverviewCard({
  symbol,
  companyName,
  currentPrice,
  change,
  changePercent,
  marketCap,
  dividendYield,
  summary,
  chartData,
}: PriceOverviewCardProps) {
  const isPositive = change >= 0;

  const [interval, setIntervalState] = useState<"daily" | "weekly" | "monthly">("daily");
  const [customChartData, setCustomChartData] = useState<HistoricalPricePoint[] | null>(null);
  const [isChartLoading, setIsChartLoading] = useState(false);

  // Reset custom chart data and interval state when symbol changes
  useEffect(() => {
    setIntervalState("daily");
    setCustomChartData(null);
  }, [symbol]);

  const handleIntervalChange = async (newInterval: "daily" | "weekly" | "monthly") => {
    setIntervalState(newInterval);
    setIsChartLoading(true);
    try {
      const response = await fetch(`/api/stocks/history?symbol=${symbol}&interval=${newInterval}`);
      if (response.ok) {
        const data = await response.json();
        setCustomChartData(data);
      }
    } catch (err) {
      console.error("Error fetching historical data:", err);
    } finally {
      setIsChartLoading(false);
    }
  };

  const activeChartData = customChartData || chartData;

  // Custom tooltips for the charts to match our dark theme
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0c1024]/90 backdrop-blur-xl border border-white/10 p-2.5 rounded-xl shadow-xl font-mono text-xs">
          <p className="text-slate-400 mb-1">{payload[0].payload.date}</p>
          <p className="text-indigo-400 font-bold">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="price-overview-card" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

      <div>
        {/* Header Title Section */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md font-mono uppercase tracking-wider">
              Primary Analysis
            </span>
            <h2 className="text-2xl font-bold text-slate-100 mt-1 flex items-center gap-2">
              {companyName}
              <span className="text-sm font-mono text-slate-500 font-normal">({symbol})</span>
            </h2>
          </div>

          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-slate-100 flex items-center justify-end">
              <span className="text-lg text-slate-400 mr-0.5">$</span>
              {currentPrice.toFixed(2)}
            </div>
            <div className={`text-sm font-semibold flex items-center gap-1 mt-0.5 justify-end ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{isPositive ? "+" : ""}{change.toFixed(2)} ({isPositive ? "+" : ""}{changePercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Mini stats highlights */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Market Cap</p>
              <p className="text-sm font-mono font-bold text-slate-200">{marketCap}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Div Yield</p>
              <p className="text-sm font-mono font-bold text-slate-200">{dividendYield}</p>
            </div>
          </div>
        </div>

        {/* Company Profile Abstract */}
        <div className="mb-6">
          <p className="text-xs text-slate-300 leading-relaxed text-justify bg-white/5 p-3 rounded-2xl border border-white/5">
            {summary}
          </p>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-48 w-full bg-white/5 border border-white/5 rounded-2xl p-3 relative flex flex-col justify-between">
        <div className="flex justify-between items-center mb-1">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
            {interval === "daily" ? "Daily Prices Trend" : interval === "weekly" ? "Weekly Prices Trend" : "Monthly Prices Trend"}
          </p>
          
          {/* Interval Toggles */}
          <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-lg text-[10px] font-mono">
            <button
              onClick={() => handleIntervalChange("daily")}
              className={`px-2 py-0.5 rounded-md transition-all ${
                interval === "daily" ? "bg-indigo-500 text-white shadow-md font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => handleIntervalChange("weekly")}
              className={`px-2 py-0.5 rounded-md transition-all ${
                interval === "weekly" ? "bg-indigo-500 text-white shadow-md font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => handleIntervalChange("monthly")}
              className={`px-2 py-0.5 rounded-md transition-all ${
                interval === "monthly" ? "bg-indigo-500 text-white shadow-md font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {isChartLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#020617]/40 backdrop-blur-sm z-10 rounded-2xl">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
          </div>
        )}

        <div className="flex-1 h-36 mt-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0.25}/>
                  <stop offset="95%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={10}
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10}
                tickLine={false} 
                axisLine={false}
                domain={["auto", "auto"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? "#10b981" : "#f43f5e"} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
