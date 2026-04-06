"use client";

import { useCallback } from "react";
import { getDerniersPoids, getSeancesParJour } from "@/lib/firestore";
import type { DerniersPoids } from "@/lib/firestore";
import type { JourSemaine } from "@/types";

export interface ProgressionPoint {
  date: string;
  poidsMax: number;
}

export function useHistorique(uid: string) {
  const getDerniereSeance = useCallback(
    async (jour: JourSemaine) => {
      const seances = await getSeancesParJour(uid, jour);
      const completes = seances
        .filter((s) => s.data.completee)
        .sort((a, b) => {
          const da = typeof a.data.date === "string" ? a.data.date : "";
          const db_ = typeof b.data.date === "string" ? b.data.date : "";
          return db_.localeCompare(da);
        });
      const today = new Date().toISOString().split("T")[0];
      const precedente = completes.find((s) => {
        const d = typeof s.data.date === "string" ? s.data.date : "";
        return d < today;
      });
      return precedente ?? null;
    },
    [uid]
  );

  const getProgressionExercice = useCallback(
    async (jour: JourSemaine, exerciceId: string): Promise<ProgressionPoint[]> => {
      const seances = await getSeancesParJour(uid, jour);
      const completes = seances
        .filter((s) => s.data.completee)
        .sort((a, b) => {
          const da = typeof a.data.date === "string" ? a.data.date : "";
          const db_ = typeof b.data.date === "string" ? b.data.date : "";
          return da.localeCompare(db_);
        });

      return completes
        .map((s) => {
          const ex = (s.data.exercices ?? []).find(
            (e) => e.exerciceId === exerciceId
          );
          if (!ex) return null;
          const poidsMax = Math.max(
            0,
            ...(ex.series ?? [])
              .map((serie) => serie.poids ?? 0)
              .filter((p) => p > 0)
          );
          if (poidsMax === 0) return null;
          return {
            date: typeof s.data.date === "string" ? s.data.date : "",
            poidsMax,
          };
        })
        .filter((p): p is ProgressionPoint => p !== null);
    },
    [uid]
  );

  const getPoidsPrecedents = useCallback(
    async (jour: JourSemaine, exerciceId: string): Promise<DerniersPoids> => {
      return getDerniersPoids(uid, jour, exerciceId);
    },
    [uid]
  );

  return { getDerniereSeance, getProgressionExercice, getPoidsPrecedents };
}
