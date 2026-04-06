"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { creerSeance, getSeanceDuJour, sauvegarderSerie, sauvegarderNotesExercice } from "@/lib/firestore";
import { getSemaineActuelle } from "@/lib/utils";
import { getDateDebut } from "@/components/SetupModal";
import type { JourSemaine, Serie } from "@/types";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseSeanceReturn {
  seanceId: string | null;
  seanceCompletee: boolean;
  loading: boolean;
  saveStatus: SaveStatus;
  saveSerie: (exerciceId: string, nomExercice: string, series: Serie[]) => void;
  saveNotes: (exerciceId: string, notes: string) => void;
  nouvelleSeance: () => Promise<void>;
}

export function useSeance(uid: string, jour: JourSemaine): UseSeanceReturn {
  const [seanceId, setSeanceId] = useState<string | null>(null);
  const [seanceCompletee, setSeanceCompletee] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initSeance = useCallback(async (forceNew = false) => {
    if (!uid) return;
    setLoading(true);
    try {
      const existing = !forceNew ? await getSeanceDuJour(uid, jour) : null;
      if (existing) {
        setSeanceId(existing.id);
        setSeanceCompletee(!!(existing.data as { completee?: boolean }).completee);
      } else {
        const dateDebut = await getDateDebut(uid);
        const semaine = dateDebut ? getSemaineActuelle(new Date(dateDebut)) : 1;
        const id = await creerSeance(uid, jour, semaine);
        setSeanceId(id);
        setSeanceCompletee(false);
      }
    } catch {
      // réseau indisponible
    } finally {
      setLoading(false);
    }
  }, [uid, jour]);

  useEffect(() => {
    let cancelled = false;
    initSeance().then(() => { if (cancelled) { /* noop */ } });
    return () => { cancelled = true; };
  }, [initSeance]);

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

  const nouvelleSeance = useCallback(async () => {
    await initSeance(true);
  }, [initSeance]);

  return { seanceId, seanceCompletee, loading, saveStatus, saveSerie, saveNotes, nouvelleSeance };
}
