import { Calendar, Percent, CheckCircle, AlertCircle, Bookmark } from "lucide-react";
import { EarningsData } from "../types";

interface EarningsSummaryProps {
  earnings: EarningsData;
}

export default function EarningsSummary({ earnings }: EarningsSummaryProps) {
  const isEpsBeat = earnings.epsStatus.toLowerCase() === "beat";
  const isRevBeat = earnings.revenueStatus.toLowerCase() === "beat";

  return (
    <div id="earnings-summary-card" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
      {/* Soft background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div>
        {/* Header Section */}
        <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Earnings Report Summary</h3>
              <p className="text-[10px] text-slate-400 font-mono">PERIOD: {earnings.period}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/10 font-mono text-xs text-slate-400">
            <span>Reported on:</span>
            <span className="text-slate-200 font-bold">{earnings.date}</span>
          </div>
        </div>

        {/* Financial Beats & Misses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* EPS Tracker */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Earnings Per Share (EPS)
              </span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                isEpsBeat
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}>
                {earnings.epsStatus}
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-2xl font-mono font-bold text-slate-100">${earnings.eps}</span>
              <span className="text-xs text-slate-400 font-mono">est. ${earnings.epsEstimate}</span>
            </div>
            <div className="mt-2.5 flex items-center gap-1 text-[10px] text-slate-400">
              {isEpsBeat ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span>Outperformed Consensus estimate by AI calculations</span>
            </div>
          </div>

          {/* Revenue Tracker */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Quarterly Revenue
              </span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                isRevBeat
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}>
                {earnings.revenueStatus}
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-2xl font-mono font-bold text-slate-100">{earnings.revenue}</span>
              <span className="text-xs text-slate-400 font-mono">est. {earnings.revenueEstimate}</span>
            </div>
            <div className="mt-2.5 flex items-center gap-1 text-[10px] text-slate-400">
              {isRevBeat ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span>Favorable commercial scale growth recorded</span>
            </div>
          </div>
        </div>

        {/* Call Takeaways */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
            <Bookmark className="w-4 h-4 text-indigo-400" />
            Key Strategic Takeaways
          </h4>
          <ul className="flex flex-col gap-2.5">
            {earnings.takeaways.map((takeaway, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-300 leading-relaxed bg-white/5 border border-white/5 p-3 rounded-2xl flex items-start gap-2.5 hover:bg-white/[0.08] transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
