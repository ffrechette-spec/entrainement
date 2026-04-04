import { Timestamp } from "firebase/firestore";

import type { ExerciceSeance, JourSemaine, Seance, Serie } from "@/types";

export interface CreerSeanceInput {
  jour: JourSemaine;
  date?: Date;
  semaine?: number;
}

export interface SauvegarderSerieInput {
  seanceId: string;
  exerciceId: string;
  serie: Serie;
}

export async function creerSeance({ jour, date = new Date(), semaine = 1 }: CreerSeanceInput): Promise<Seance> {
  const timestamp = Timestamp.fromDate(date);

  return {
    id: "",
    jour,
    date: timestamp,
    semaine,
    qualite: null,
    energieAvant: null,
    energieApres: null,
    sommeil: null,
    poidsCorps: null,
    cardioFait: false,
    cardioDuree: null,
    notes: "",
    exercices: [],
    completee: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function sauvegarderSerie({ seanceId, exerciceId, serie }: SauvegarderSerieInput): Promise<{ seanceId: string; exerciceId: string; serie: Serie }> {
  return { seanceId, exerciceId, serie };
}

export async function getSeanceDuJour(jour: JourSemaine, date: Date): Promise<Seance | null> {
  void jour;
  void date;
  return null;
}

export async function getSeancesParJour(jour: JourSemaine): Promise<Seance[]> {
  void jour;
  return [];
}

export async function sauvegarderExercices(_seanceId: string, exercices: ExerciceSeance[]): Promise<ExerciceSeance[]> {
  return exercices;
}
