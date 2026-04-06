"use client";

import type { Exercice } from "@/types";

interface ExerciceCardProps {
  exercice: Exercice;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function ExerciceCard({
  exercice,
  index,
  total,
  onPrev,
  onNext,
}: ExerciceCardProps) {
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
        <h2 className="text-xl font-bold text-foreground mb-4">
          {exercice.nom}
        </h2>

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

        <p className="text-sm text-foreground/60 mb-4 leading-relaxed">
          {exercice.technique}
        </p>

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

      {/* Zone saisie (Phase 5) */}
      <div className="rounded-2xl bg-white p-5 shadow-sm min-h-[80px] flex items-center justify-center">
        <p className="text-sm text-foreground/30">Saisie des séries — Phase 5</p>
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
