import { useState } from "react";
import { HelpCircle, ChevronRight, BookOpen, AlertCircle } from "lucide-react";
import { MetricsExplanations } from "../types";

interface KeyMetricsExplainerProps {
  peRatio: number | null;
  debtToEquity: string;
  fcf: string;
  pegRatio: number | null;
  explanations: MetricsExplanations;
}

export default function KeyMetricsExplainer({
  peRatio,
  debtToEquity,
  fcf,
  pegRatio,
  explanations,
}: KeyMetricsExplainerProps) {
  const [selectedMetric, setSelectedMetric] = useState<"peRatio" | "debtToEquity" | "fcf" | "pegRatio">("peRatio");

  const metrics = [
    {
      id: "peRatio" as const,
      label: "P/E Ratio",
      value: peRatio !== null ? peRatio.toFixed(1) : "N/A",
      subtitle: "Price to Earnings",
      description: "How much you pay for $1 of earnings.",
      color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5",
    },
    {
      id: "debtToEquity" as const,
      label: "Debt to Equity",
      value: debtToEquity,
      subtitle: "Financial Leverage",
      description: "Company funding from debt vs owners.",
      color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5",
    },
    {
      id: "fcf" as const,
      label: "Free Cash Flow",
      value: fcf,
      subtitle: "Absolute Liquidity",
      description: "Cash left after capital reinvestments.",
      color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5",
    },
    {
      id: "pegRatio" as const,
      label: "PEG Ratio",
      value: pegRatio !== null ? pegRatio.toFixed(1) : "N/A",
      subtitle: "P/E to Growth Rate",
      description: "Value adjusted for growth prospects.",
      color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5",
    },
  ];

  return (
    <div id="key-metrics-explainer" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-slate-100">Financial Metrics Explainer</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Select any core valuation metric to reveal a custom AI-generated explanation of what this exact number means for this specific company.
        </p>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((m) => {
            const isSelected = selectedMetric === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMetric(m.id)}
                className={`text-left p-4 rounded-2xl border transition-all relative ${
                  isSelected
                    ? "bg-white/10 border-indigo-500 shadow-lg shadow-indigo-500/10"
                    : "bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                )}
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {m.subtitle}
                </p>
                <p className="text-xl font-mono font-bold text-slate-100 leading-none mb-1">
                  {m.value}
                </p>
                <p className="text-[11px] font-semibold text-slate-300">
                  {m.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Detail Panel */}
      <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none" />

        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Analyzing {metrics.find((m) => m.id === selectedMetric)?.label}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              {explanations[selectedMetric] || "Select a metric to examine detailed reports."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
