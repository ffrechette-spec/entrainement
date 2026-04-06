"use client";

import { useState } from "react";
import type { Exercice, Serie } from "@/types";
import SerieInput from "@/components/SerieInput";
import type { SaveStatus } from "@/hooks/useSeance";

interface ExerciceCardProps {
  exercice: Exercice;
  index: number;
  total: number;
  saveStatus: SaveStatus;
  onPrev: () => void;
  onNext: () => void;
  onSeriesChange: (exerciceId: string, nom: string, series: Serie[]) => void;
}

function buildSeries(count: number): Serie[] {
  return Array.from({ length: count }, (_, i) => ({
    numero: i + 1,
    poids: null,
    reps: null,
    completee: false,
  }));
}

export default function ExerciceCard({
  exercice,
  index,
  total,
  saveStatus,
  onPrev,
  onNext,
  onSeriesChange,
}: ExerciceCardProps) {
  const [series, setSeries] = useState<Serie[]>(() => buildSeries(exercice.seriesCount));

  function handleSerieChange(updated: Serie) {
    const next = series.map((s) => (s.numero === updated.numero ? updated : s));
    setSeries(next);
    onSeriesChange(exercice.id, exercice.nom, next);
  }

  const saveLabel =
    saveStatus === "saving" ? "Sauvegarde…"
    : saveStatus === "saved" ? "Sauvegardé ✓"
    : saveStatus === "error" ? "Erreur ✗"
    : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Indicateur de progression */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground/50">
          Exercice {index + 1} / {total}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`block h-1.5 w-6 rounded-full transition-colors ${
                i === index ? "bg-accent" : "bg-accent/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Carte exercice */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent/70 mb-1">
          {exercice.groupeMusculaire}
        </p>
        <h2 className="text-xl font-bold text-foreground mb-4">{exercice.nom}</h2>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-background p-3">
            <p className="text-xs text-foreground/50 mb-0.5">Séries × Reps</p>
            <p className="font-semibold text-foreground">{exercice.seriesCibles}</p>
          </div>
          <div className="rounded-xl bg-background p-3">
            <p className="text-xs text-foreground/50 mb-0.5">Repos</p>
            <p className="font-semibold text-foreground">{exercice.repos}</p>
          </div>
        </div>

        <p className="text-sm text-foreground/60 mb-4 leading-relaxed">{exercice.technique}</p>

        <a
          href={exercice.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-accent/20 px-4 py-2.5 text-sm font-medium text-accent active:opacity-70"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
          Voir sur YouTube
        </a>
      </div>

      {/* Saisie des séries */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <p className="text-sm font-semibold text-foreground">Séries</p>
          {saveLabel ? (
            <span className={`text-xs font-medium ${
              saveStatus === "saved" ? "text-green-600"
              : saveStatus === "error" ? "text-red-500"
              : "text-foreground/40"
            }`}>
              {saveLabel}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-1 px-3 pb-4">
          {series.map((serie) => (
            <SerieInput key={serie.numero} serie={serie} onChange={handleSerieChange} />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="flex-1 min-h-[48px] rounded-xl border border-accent/20 font-medium text-foreground/70 active:opacity-70 disabled:opacity-30"
          type="button"
        >
          ← Précédent
        </button>
        <button
          onClick={onNext}
          disabled={index === total - 1}
          className="flex-1 min-h-[48px] rounded-xl bg-accent font-medium text-white active:opacity-80 disabled:opacity-30"
          type="button"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
