import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getSemaineActuelle } from "@/lib/utils";
import { getDateDebut } from "@/components/SetupModal";
import type { ExerciceSeance } from "@/types";

interface SerieExport {
  serie: number;
  poids_kg: number | null;
  reps: number | null;
}

interface ExerciceExport {
  nom: string;
  series: SerieExport[];
  notes: string;
}

interface SeanceExport {
  jour: string;
  date: string;
  semaine: number;
  qualite: number | null;
  energie_avant: number | null;
  energie_apres: number | null;
  sommeil_h: number | null;
  poids_corps_kg: number | null;
  cardio_fait: boolean;
  cardio_duree_min: number | null;
  notes_globales: string;
  exercices: ExerciceExport[];
}

export interface ExportData {
  export_date: string;
  programme: string;
  semaine_actuelle: number;
  seances: SeanceExport[];
}

export async function genererExport(uid: string): Promise<ExportData> {
  const today = new Date().toISOString().split("T")[0];

  const dateDebut = await getDateDebut(uid);
  const semaineActuelle = dateDebut ? getSemaineActuelle(new Date(dateDebut)) : 1;

  const seancesRef = collection(db, "users", uid, "seances");
  const q = query(seancesRef, orderBy("date", "asc"));
  const snap = await getDocs(q);

  const seances: SeanceExport[] = snap.docs.map((docSnap) => {
    const d = docSnap.data();
    const exercices = (d.exercices ?? []) as ExerciceSeance[];
    return {
      jour: d.jour ?? "",
      date: typeof d.date === "string" ? d.date : "",
      semaine: d.semaine ?? 0,
      qualite: d.qualite ?? null,
      energie_avant: d.energieAvant ?? null,
      energie_apres: d.energieApres ?? null,
      sommeil_h: d.sommeil ?? null,
      poids_corps_kg: d.poidsCorps ?? null,
      cardio_fait: !!d.cardioFait,
      cardio_duree_min: d.cardioDuree ?? null,
      notes_globales: d.notes ?? "",
      exercices: exercices.map((ex) => ({
        nom: ex.nom,
        series: (ex.series ?? []).map((s) => ({
          serie: s.numero,
          poids_kg: s.poids,
          reps: s.reps,
        })),
        notes: ex.notes ?? "",
      })),
    };
  });

  return {
    export_date: today,
    programme: "8 semaines — Définition musculaire",
    semaine_actuelle: semaineActuelle,
    seances,
  };
}

export function nomFichierExport(): string {
  const today = new Date().toISOString().split("T")[0];
  return `gym_export_${today}.json`;
}
