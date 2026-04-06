"use client";

import type { Serie } from "@/types";

interface SerieInputProps {
  serie: Serie;
  onChange: (updated: Serie) => void;
}

export default function SerieInput({ serie, onChange }: SerieInputProps) {
  function handlePoids(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onChange({ ...serie, poids: val === "" ? null : parseFloat(val) });
  }

  function handleReps(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onChange({ ...serie, reps: val === "" ? null : parseInt(val, 10) });
  }

  function toggleComplete() {
    onChange({ ...serie, completee: !serie.completee });
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
        serie.completee ? "bg-green-50" : "bg-background"
      }`}
    >
      <span className="w-5 shrink-0 text-center text-sm font-semibold text-foreground/40">
        {serie.numero}
      </span>

      <div className="flex flex-1 gap-2">
        <div className="flex flex-1 flex-col">
          <label className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground/40">
            Poids kg
          </label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.5}
            value={serie.poids ?? ""}
            onChange={handlePoids}
            placeholder="—"
            className="min-h-[44px] w-full rounded-lg border border-accent/20 bg-white px-3 py-2 text-center text-base font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <label className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground/40">
            Reps
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={serie.reps ?? ""}
            onChange={handleReps}
            placeholder="—"
            className="min-h-[44px] w-full rounded-lg border border-accent/20 bg-white px-3 py-2 text-center text-base font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={toggleComplete}
        aria-label={serie.completee ? "Marquer incomplète" : "Marquer complète"}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition-colors active:opacity-70 ${
          serie.completee
            ? "bg-green-500 text-white"
            : "border-2 border-accent/20 bg-white text-foreground/30"
        }`}
      >
        {serie.completee ? "✓" : "○"}
      </button>
    </div>
  );
}
