import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { PortfolioStock } from "../types";
import { Briefcase, Loader2, Plus, RefreshCw, Trash2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface PortfolioTrackerProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
}

export default function PortfolioTracker({ symbol, companyName, currentPrice }: PortfolioTrackerProps) {
  const [sharesInput, setSharesInput] = useState("");
  const [buyPriceInput, setBuyPriceInput] = useState("");
  const [holdings, setHoldings] = useState<PortfolioStock | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync holdings from Firestore for the specific symbol
  useEffect(() => {
    setIsLoading(true);
    if (!symbol) return;

    const portfolioRef = collection(db, "portfolio");
    const q = query(portfolioRef, where("symbol", "==", symbol));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const docData = snapshot.docs[0];
          setHoldings({ id: docData.id, ...docData.data() } as PortfolioStock);
          setSharesInput(docData.data().sharesOwned.toString());
          setBuyPriceInput(docData.data().averageBuyPrice.toString());
        } else {
          setHoldings(null);
          setSharesInput("");
          setBuyPriceInput("");
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading portfolio from Firestore:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [symbol]);

  const handleUpdatePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    const shares = parseFloat(sharesInput);
    const buyPrice = parseFloat(buyPriceInput);

    if (isNaN(shares) || shares <= 0 || isNaN(buyPrice) || buyPrice <= 0) return;

    setIsSaving(true);
    try {
      const portfolioRef = collection(db, "portfolio");

      if (holdings && holdings.id) {
        // Update existing record
        const docRef = doc(db, "portfolio", holdings.id);
        await updateDoc(docRef, {
          sharesOwned: shares,
          averageBuyPrice: buyPrice,
          addedAt: Date.now(),
        });
      } else {
        // Create new record
        await addDoc(portfolioRef, {
          symbol: symbol.toUpperCase(),
          companyName: companyName,
          sharesOwned: shares,
          averageBuyPrice: buyPrice,
          addedAt: Date.now(),
        });
      }
    } catch (err) {
      console.error("Error updating portfolio in Firestore:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearPosition = async () => {
    if (!holdings || !holdings.id) return;
    setIsSaving(true);
    try {
      await deleteDoc(doc(db, "portfolio", holdings.id));
      setSharesInput("");
      setBuyPriceInput("");
    } catch (err) {
      console.error("Error clearing portfolio position:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Performance calculations
  const hasShares = holdings !== null && holdings.sharesOwned > 0;
  const totalCost = hasShares ? holdings!.sharesOwned * holdings!.averageBuyPrice : 0;
  const currentValue = hasShares ? holdings!.sharesOwned * currentPrice : 0;
  const totalGainLoss = hasShares ? currentValue - totalCost : 0;
  const gainLossPercent = hasShares && totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  const isGain = totalGainLoss >= 0;

  return (
    <div id="portfolio-tracker-card" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
      {/* Soft background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Virtual Portfolio Simulator</h3>
              <p className="text-[10px] text-slate-400 font-mono">FIRESTORE INVESTMENT TRACKING</p>
            </div>
          </div>
          {hasShares && (
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
              isGain ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}>
              {isGain ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isGain ? "Profit" : "Loss"}
            </span>
          )}
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Holdings Metrics Board */}
            {hasShares && (
              <div className="grid grid-cols-3 gap-2.5 bg-white/5 border border-white/5 rounded-2xl p-3.5 font-mono">
                <div>
                  <p className="text-[9px] uppercase text-slate-400 mb-1">Total Value</p>
                  <p className="text-sm font-bold text-slate-100">${currentValue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase text-slate-400 mb-1">Buy Cost</p>
                  <p className="text-sm font-bold text-slate-300">${totalCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase text-slate-400 mb-1">Total ROI</p>
                  <p className={`text-sm font-bold flex items-center ${isGain ? "text-emerald-400" : "text-rose-400"}`}>
                    {isGain ? "+" : ""}{gainLossPercent.toFixed(1)}%
                  </p>
                </div>
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleUpdatePosition} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="shares-owned-input" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                    Shares Owned
                  </label>
                  <div className="relative">
                    <input
                      id="shares-owned-input"
                      type="number"
                      step="any"
                      placeholder="e.g. 15"
                      value={sharesInput}
                      onChange={(e) => setSharesInput(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="buy-price-input" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                    Average Buy Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[11px] text-slate-400 font-mono">$</span>
                    <input
                      id="buy-price-input"
                      type="number"
                      step="any"
                      placeholder="e.g. 175.50"
                      value={buyPriceInput}
                      onChange={(e) => setBuyPriceInput(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 rounded-xl py-2 pl-6 pr-3 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Position Action CTA Buttons */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={isSaving || !sharesInput || !buyPriceInput}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/5 disabled:text-slate-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : hasShares ? (
                    <RefreshCw className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  {hasShares ? "Update Position" : "Track Holdings"}
                </button>

                {hasShares && (
                  <button
                    type="button"
                    onClick={handleClearPosition}
                    disabled={isSaving}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 font-semibold p-2.5 rounded-xl text-xs transition-colors"
                    title="Remove position from portfolio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
