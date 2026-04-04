import type { JourSemaine } from "@/types";
import { getExercicesParJour } from "@/lib/programme";

export { getExercicesParJour };

const JOURS_SEMAINE: JourSemaine[] = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
];

export function getSemaineActuelle(dateDebut: Date): number {
  const maintenant = new Date();
  const msParJour = 1000 * 60 * 60 * 24;
  const diffMs = maintenant.getTime() - dateDebut.getTime();
  const diffJours = Math.floor(diffMs / msParJour);
  const semaine = Math.floor(diffJours / 7) + 1;
  return Math.min(Math.max(semaine, 1), 8);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getJourActuel(): JourSemaine | null {
  const jour = new Date().getDay();
  const MAP: Record<number, JourSemaine> = {
    1: "lundi",
    2: "mardi",
    3: "mercredi",
    4: "jeudi",
    5: "vendredi",
  };
  return MAP[jour] ?? null;
}

export { JOURS_SEMAINE };
