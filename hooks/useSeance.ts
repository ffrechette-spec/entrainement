"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { creerSeance, getSeanceDuJour, sauvegarderSerie, sauvegarderNotesExercice } from "@/lib/firestore";
import { getSemaineActuelle } from "@/lib/utils";
import { getDateDebut } from "@/components/SetupModal";
import type { JourSemaine, Serie } from "@/types";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseSeanceReturn {
  seanceId: string | null;
  loading: boolean;
  saveStatus: SaveStatus;
  saveSerie: (exerciceId: string, nomExercice: string, series: Serie[]) => void;
  saveNotes: (exerciceId: string, notes: string) => void;
}

export function useSeance(uid: string, jour: JourSemaine): UseSeanceReturn {
  const [seanceId, setSeanceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      try {
        const existing = await getSeanceDuJour(uid, jour);
        if (cancelled) return;
        if (existing) {
          setSeanceId(existing.id);
        } else {
          const dateDebut = await getDateDebut(uid);
          const semaine = dateDebut ? getSemaineActuelle(new Date(dateDebut)) : 1;
          const id = await creerSeance(uid, jour, semaine);
          if (!cancelled) setSeanceId(id);
        }
      } catch {
        // réseau indisponible — on continuera hors-ligne
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, [uid, jour]);

  const saveSerie = useCallback(
    (exerciceId: string, nomExercice: string, series: Serie[]) => {
      if (!seanceId) return;
      setSaveStatus("saving");

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        try {
          await sauvegarderSerie(uid, seanceId, exerciceId, nomExercice, series);
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        } catch {
          setSaveStatus("error");
        }
      }, 500);
    },
    [uid, seanceId]
  );

  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveNotes = useCallback(
    (exerciceId: string, notes: string) => {
      if (!seanceId) return;
      if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current);
      notesDebounceRef.current = setTimeout(async () => {
        try {
          await sauvegarderNotesExercice(uid, seanceId, exerciceId, notes);
        } catch {
          // silently fail — notes are non-critical
        }
      }, 500);
    },
    [uid, seanceId]
  );

  return { seanceId, loading, saveStatus, saveSerie, saveNotes };
}
