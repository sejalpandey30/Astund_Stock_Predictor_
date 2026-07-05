import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, RefreshCw, AlertCircle } from "lucide-react";

interface SearchHeaderProps {
  onSelectSymbol: (symbol: string) => void;
  isLoading: boolean;
  currentSymbol: string;
  onRefresh: () => void;
  apiError: string | null;
}

interface SuggestionItem {
  symbol: string;
  name: string;
}

export default function SearchHeader({
  onSelectSymbol,
  isLoading,
  currentSymbol,
  onRefresh,
  apiError
}: SearchHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks to close suggestion dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(searchTerm)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSelectSymbol(searchTerm.trim().toUpperCase());
      setShowDropdown(false);
    }
  };

  const handleSelect = (symbol: string) => {
    onSelectSymbol(symbol);
    setSearchTerm("");
    setShowDropdown(false);
  };

  return (
    <div id="search-header-container" className="w-full bg-white/[0.03] backdrop-blur-2xl border-b border-white/10 py-4 px-6 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand/Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            Σ
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">SigmaAI <span className="text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 ml-1">Research</span></h1>
            <p className="text-xs text-slate-400 font-sans">Grounded in Google Search & Gemini Intelligence</p>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="flex-1 max-w-md relative" ref={dropdownRef}>
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              id="stock-search-input"
              type="text"
              placeholder="Search ticker (e.g., AAPL, NVDA, COIN)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              className="w-full bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 rounded-xl py-2.5 pl-10 pr-12 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-sm transition-all"
            />
            <div className="absolute left-3.5 text-slate-500 pointer-events-none">
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
            {searchTerm && (
              <button
                type="submit"
                className="absolute right-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors"
              >
                Go
              </button>
            )}
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div id="search-suggestions-dropdown" className="absolute left-0 right-0 mt-2 bg-[#0c1024]/95 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
              <div className="py-1 max-h-60 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
                  Search Results
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.symbol}
                    type="button"
                    onClick={() => handleSelect(item.symbol)}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/5 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <span className="font-mono font-bold text-indigo-400 group-hover:text-indigo-300">
                        {item.symbol}
                      </span>
                      <span className="text-xs text-slate-400 ml-3 truncate inline-block max-w-[200px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 group-hover:text-indigo-400 font-mono transition-colors">
                      Select
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls / Current Ticker Info */}
        <div className="flex items-center gap-3">
          {currentSymbol && (
            <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400">Current:</span>
              <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded text-sm">
                {currentSymbol}
              </span>
              <button
                type="button"
                onClick={onRefresh}
                disabled={isLoading}
                className="text-slate-400 hover:text-indigo-400 disabled:text-slate-700 disabled:pointer-events-none p-1 rounded transition-colors"
                title="Force refresh AI data using Google Search"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Alert message if API key has problems */}
      {apiError && (
        <div className="max-w-7xl mx-auto mt-3 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2.5 text-xs text-amber-400">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            {apiError} (Simulated analyzer fallback will handle custom lookups safely).
          </span>
        </div>
      )}
    </div>
  );
}
