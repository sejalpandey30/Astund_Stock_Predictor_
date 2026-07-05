import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ResearchNote } from "../types";
import { NotebookPen, Star, Trash2, Loader2, Check } from "lucide-react";

interface ResearchNotebookProps {
  symbol: string;
}

export default function ResearchNotebook({ symbol }: ResearchNotebookProps) {
  const [noteText, setNoteText] = useState("");
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync notes from Firestore in real-time
  useEffect(() => {
    setIsLoading(true);
    if (!symbol) return;

    const notesRef = collection(db, "research_notes");
    // Filter by selected symbol and order by last updated
    const q = query(notesRef, where("symbol", "==", symbol), orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notesList: ResearchNote[] = [];
        snapshot.forEach((doc) => {
          notesList.push({ id: doc.id, ...doc.data() } as ResearchNote);
        });
        setNotes(notesList);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading notes from Firestore:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [symbol]);

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !symbol) return;

    setIsSaving(true);
    try {
      const notesRef = collection(db, "research_notes");
      await addDoc(notesRef, {
        symbol: symbol.toUpperCase(),
        noteText: noteText.trim(),
        rating: rating,
        updatedAt: Date.now(),
      });
      setNoteText("");
      setRating(5);
    } catch (err) {
      console.error("Error saving research note to Firestore:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, "research_notes", id));
    } catch (err) {
      console.error("Error deleting research note:", err);
    }
  };

  return (
    <div id="research-notebook-card" className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
      {/* Soft background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div>
        {/* Title */}
        <div className="flex items-center gap-2.5 mb-4 border-b border-white/10 pb-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <NotebookPen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Research Notes & Ratings</h3>
            <p className="text-[10px] text-slate-400 font-mono">FIRESTORE PERSISTENT NOTEBOOK</p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSaveNote} className="mb-6 space-y-4">
          <div>
            <label htmlFor="user-note-textarea" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
              Investor Review for {symbol}
            </label>
            <textarea
              id="user-note-textarea"
              rows={3}
              placeholder="Record catalyst thoughts, entry levels, price targets, or research summaries..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 rounded-xl p-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-xs transition-all leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-mono">Rating:</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className="p-0.5 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        num <= rating ? "text-amber-400 fill-amber-400" : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving || !noteText.trim()}
              className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/5 disabled:text-slate-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              Save to DB
            </button>
          </div>
        </form>

        {/* Notes Feed */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-mono">
            Saved Logs ({notes.length})
          </h4>

          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 bg-white/5 border border-dashed border-white/10 rounded-2xl text-slate-400">
              <p className="text-xs">No research logs saved for {symbol} yet.</p>
              <p className="text-[10px] text-slate-500 mt-1">Write a custom review above to start tracking.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-3 relative group transition-colors"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: note.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed text-justify pr-6">
                    {note.noteText}
                  </p>
                  <button
                    type="button"
                    onClick={() => note.id && handleDeleteNote(note.id)}
                    className="absolute right-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 p-1 rounded transition-all"
                    title="Delete research note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
