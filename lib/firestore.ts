import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ExerciceSeance, JourSemaine, Seance, Serie } from "@/types";

function dateToStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

export async function creerSeance(
  uid: string,
  jour: JourSemaine,
  semaine: number,
  date: Date = new Date()
): Promise<string> {
  const now = Timestamp.now();
  const seancesRef = collection(db, "users", uid, "seances");
  const docRef = await addDoc(seancesRef, {
    jour,
    date: dateToStr(date),
    semaine,
    exercices: [],
    completee: false,
    qualite: null,
    energieAvant: null,
    energieApres: null,
    sommeil: null,
    poidsCorps: null,
    cardioFait: false,
    cardioDuree: null,
    notes: "",
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function getSeanceDuJour(
  uid: string,
  jour: JourSemaine,
  date: Date = new Date()
): Promise<{ id: string; data: Seance } | null> {
  const seancesRef = collection(db, "users", uid, "seances");
  const q = query(
    seancesRef,
    where("jour", "==", jour),
    where("date", "==", dateToStr(date))
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const first = snap.docs[0];
  return { id: first.id, data: { id: first.id, ...first.data() } as Seance };
}

export async function sauvegarderSerie(
  uid: string,
  seanceId: string,
  exerciceId: string,
  nomExercice: string,
  series: Serie[]
): Promise<void> {
  const seanceRef = doc(db, "users", uid, "seances", seanceId);
  const snap = await getDoc(seanceRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const exercices: ExerciceSeance[] = Array.isArray(data.exercices)
    ? (data.exercices as ExerciceSeance[])
    : [];

  const idx = exercices.findIndex((e) => e.exerciceId === exerciceId);
  if (idx >= 0) {
    exercices[idx] = { ...exercices[idx], series };
  } else {
    exercices.push({ exerciceId, nom: nomExercice, series, notes: "" });
  }

  await setDoc(
    seanceRef,
    { exercices, updatedAt: Timestamp.now() },
    { merge: true }
  );
}

export async function getSeancesParJour(
  uid: string,
  jour: JourSemaine
): Promise<Array<{ id: string; data: Seance }>> {
  const seancesRef = collection(db, "users", uid, "seances");
  const q = query(seancesRef, where("jour", "==", jour));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, data: { id: d.id, ...d.data() } as Seance }));
}

export async function sauvegarderNotesExercice(
  uid: string,
  seanceId: string,
  exerciceId: string,
  notes: string
): Promise<void> {
  const seanceRef = doc(db, "users", uid, "seances", seanceId);
  const snap = await getDoc(seanceRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const exercices: ExerciceSeance[] = Array.isArray(data.exercices)
    ? (data.exercices as ExerciceSeance[])
    : [];

  const idx = exercices.findIndex((e) => e.exerciceId === exerciceId);
  if (idx >= 0) {
    exercices[idx] = { ...exercices[idx], notes };
    await setDoc(
      seanceRef,
      { exercices, updatedAt: Timestamp.now() },
      { merge: true }
    );
  }
}

export interface DerniersPoids {
  serie1: number | null;
  serie2: number | null;
  serie3: number | null;
  serie4: number | null;
}

export async function getDerniersPoids(
  uid: string,
  jour: JourSemaine,
  exerciceId: string
): Promise<DerniersPoids> {
  const vide: DerniersPoids = { serie1: null, serie2: null, serie3: null, serie4: null };
  const today = dateToStr(new Date());
  const seancesRef = collection(db, "users", uid, "seances");
  const q = query(
    seancesRef,
    where("jour", "==", jour),
    where("completee", "==", true),
    orderBy("date", "desc"),
    limit(10)
  );
  const snap = await getDocs(q);
  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    if (data.date === today) continue;
    const exercices = (data.exercices ?? []) as ExerciceSeance[];
    const ex = exercices.find((e) => e.exerciceId === exerciceId);
    if (!ex) continue;
    const series = ex.series ?? [];
    return {
      serie1: series[0]?.poids ?? null,
      serie2: series[1]?.poids ?? null,
      serie3: series[2]?.poids ?? null,
      serie4: series[3]?.poids ?? null,
    };
  }
  return vide;
}

export interface FeedbackSeance {
  qualite: number | null;
  energieApres: number | null;
  sommeil: number | null;
  poidsCorps: number | null;
  cardioFait: boolean;
  cardioDuree: number | null;
  notes: string;
}

export async function completerSeance(
  uid: string,
  seanceId: string,
  feedback: FeedbackSeance
): Promise<void> {
  const seanceRef = doc(db, "users", uid, "seances", seanceId);
  await setDoc(
    seanceRef,
    { ...feedback, completee: true, updatedAt: Timestamp.now() },
    { merge: true }
  );
}
