import type { Timestamp } from "firebase/firestore";

export type JourSemaine = "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi";

export interface Serie {
  numero: number;
  poids: number | null;
  reps: number | null;
  completee: boolean;
}

export interface ExerciceSeance {
  exerciceId: string;
  nom: string;
  series: Serie[];
  notes: string;
}

export interface Seance {
  id: string;
  jour: JourSemaine;
  date: Timestamp;
  semaine: number;
  qualite: number | null;
  energieAvant: number | null;
  energieApres: number | null;
  sommeil: number | null;
  poidsCorps: number | null;
  cardioFait: boolean;
  cardioDuree: number | null;
  notes: string;
  exercices: ExerciceSeance[];
  completee: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
