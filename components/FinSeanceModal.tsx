"use client";

import { useState } from "react";
import type { FeedbackSeance } from "@/lib/firestore";

interface FinSeanceModalProps {
  onConfirm: (feedback: FeedbackSeance) => void;
  onAnnuler: () => void;
  saving?: boolean;
}

function ScaleInput({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
        {value !== null && (
          <span className="ml-2 font-bold text-accent">{value}</span>
        )}
      </label>
      <div className="flex gap-1.5 flex-wrap">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`h-10 w-10 rounded-xl text-sm font-semibold transition-colors active:opacity-70 ${
              value === v
                ? "bg-accent text-white"
                : "bg-background text-foreground/60 border border-accent/20"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FinSeanceModal({ onConfirm, onAnnuler, saving }: FinSeanceModalProps) {
  const [qualite, setQualite] = useState<number | null>(null);
  const [energieApres, setEnergieApres] = useState<number | null>(null);
  const [sommeil, setSommeil] = useState<number | null>(null);
  const [poidsCorps, setPoidsCorps] = useState<string>("");
  const [cardioFait, setCardioFait] = useState(false);
  const [cardioDuree, setCardioDuree] = useState<string>("");
  const [notes, setNotes] = useState("");

  function handleConfirm() {
    const feedback: FeedbackSeance = {
      qualite,
      energieApres,
      sommeil,
      poidsCorps: poidsCorps !== "" ? parseFloat(poidsCorps) : null,
      cardioFait,
      cardioDuree: cardioFait && cardioDuree !== "" ? parseInt(cardioDuree, 10) : null,
      notes,
    };
    onConfirm(feedback);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-6 overflow-y-auto">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-foreground mb-1">Séance terminée 💪</h2>
        <p className="text-sm text-foreground/50 mb-5">
          Quelques infos pour suivre ta progression.
        </p>

        <ScaleInput label="Qualité de la séance" value={qualite} onChange={setQualite} />
        <ScaleInput label="Énergie après la séance" value={energieApres} onChange={setEnergieApres} />

        {/* Sommeil */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1">
            Heures de sommeil (nuit précédente)
          </label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={24}
            step={0.5}
            value={sommeil ?? ""}
            onChange={(e) => setSommeil(e.target.value === "" ? null : parseFloat(e.target.value))}
            placeholder="ex: 7.5"
            className="w-full min-h-[44px] rounded-xl border border-accent/20 bg-background px-4 py-2.5 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Poids corps */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1">
            Poids corporel (kg, optionnel)
          </label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.1}
            value={poidsCorps}
            onChange={(e) => setPoidsCorps(e.target.value)}
            placeholder="ex: 82.5"
            className="w-full min-h-[44px] rounded-xl border border-accent/20 bg-background px-4 py-2.5 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Cardio */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setCardioFait((v) => !v)}
            className={`flex min-h-[44px] w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors active:opacity-70 ${
              cardioFait
                ? "border-accent bg-accent/10 text-accent"
                : "border-accent/20 bg-background text-foreground/60"
            }`}
          >
            <span>Cardio fait aujourd&apos;hui</span>
            <span>{cardioFait ? "✓ Oui" : "Non"}</span>
          </button>
          {cardioFait && (
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={cardioDuree}
              onChange={(e) => setCardioDuree(e.target.value)}
              placeholder="Durée en minutes"
              className="mt-2 w-full min-h-[44px] rounded-xl border border-accent/20 bg-background px-4 py-2.5 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          )}
        </div>

        {/* Notes */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-foreground mb-1">
            Notes générales (optionnel)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Impressions, douleurs, PR…"
            rows={3}
            className="w-full rounded-xl border border-accent/20 bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onAnnuler}
            disabled={saving}
            className="flex-1 min-h-[48px] rounded-xl border border-accent/20 font-medium text-foreground/70 active:opacity-70 disabled:opacity-40"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving}
            className="flex-1 min-h-[48px] rounded-xl bg-accent font-medium text-white active:opacity-80 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {saving ? "Sauvegarde…" : "Terminer la séance"}
          </button>
        </div>
      </div>
    </div>
  );
}
