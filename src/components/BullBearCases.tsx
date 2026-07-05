import { TrendingUp, TrendingDown, Check, AlertTriangle } from "lucide-react";
import { CatalystItem } from "../types";

interface BullBearCasesProps {
  bullCases: CatalystItem[];
  bearCases: CatalystItem[];
}

export default function BullBearCases({ bullCases, bearCases }: BullBearCasesProps) {
  return (
    <div id="bull-bear-cases-section" className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Bull Cases Card */}
      <div id="bull-catalysts-card" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Bull Case (Catalysts)</h3>
              <p className="text-[10px] text-slate-400 font-mono">OPPORTUNITIES & GROWTH TAILWINDS</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Positive Posture
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {bullCases.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/5 hover:border-emerald-500/30 rounded-2xl p-4 transition-all hover:bg-white/[0.08] group"
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 font-bold" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1 text-justify">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bear Cases Card */}
      <div id="bear-risks-card" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Bear Case (Risks)</h3>
              <p className="text-[10px] text-slate-400 font-mono">RISK FACTORS & HEADWINDS</p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
            Caution Signals
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {bearCases.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/5 hover:border-rose-500/30 rounded-2xl p-4 transition-all hover:bg-white/[0.08] group"
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 font-bold" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-rose-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1 text-justify">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
