"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import type { ExerciceSeance, JourSemaine } from "@/types";

interface SeanceDetail {
  jour: JourSemaine;
  date: string;
  semaine: number;
  qualite: number | null;
  energieApres: number | null;
  sommeil: number | null;
  poidsCorps: number | null;
  cardioFait: boolean;
  cardioDuree: number | null;
  notes: string;
  exercices: ExerciceSeance[];
  completee: boolean;
}

function formatDateFr(iso: string): string {
  const [y, m, d] = iso.split("-");
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function DetailSeancePage({ params }: Props) {
  const { id } = use(params);
  const { user } = useAuth();
  const [seance, setSeance] = useState<SeanceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "users", user.uid, "seances", id);
    getDoc(ref).then((snap) => {
      if (!snap.exists()) {
        setNotFound(true);
      } else {
        setSeance(snap.data() as SeanceDetail);
      }
      setLoading(false);
    }).catch(() => {
      setNotFound(true);
      setLoading(false);
    });
  }, [user, id]);

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm text-center text-foreground/40">
          <p className="text-sm">Chargement…</p>
        </div>
      </div>
    );
  }

  if (notFound || !seance) {
    return (
      <div className="px-4 py-6">
        <Link href="/historique" className="mb-4 flex items-center gap-2 text-sm text-foreground/60 active:opacity-70">
          ← Historique
        </Link>
        <div className="rounded-2xl bg-white p-6 shadow-sm text-center text-foreground/40">
          <p className="text-sm">Séance introuvable.</p>
        </div>
      </div>
    );
  }

  const jourLabel = seance.jour.charAt(0).toUpperCase() + seance.jour.slice(1);

  return (
    <div className="px-4 py-6">
      <header className="mb-5 flex items-start gap-3">
        <Link
          href="/historique"
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-foreground/60 active:opacity-70"
          aria-label="Retour historique"
        >
          ←
        </Link>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent opacity-70">
            Semaine {seance.semaine} · Lecture seule
          </p>
          <h1 className="text-xl font-bold text-foreground leading-tight">{jourLabel}</h1>
          <p className="text-sm text-foreground/50 mt-0.5">{formatDateFr(seance.date)}</p>
        </div>
      </header>

      {/* Métriques séance */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {seance.qualite !== null && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-foreground/50 mb-0.5">Qualité</p>
            <p className="text-xl font-bold text-accent">{seance.qualite}<span className="text-sm font-normal text-foreground/40">/10</span></p>
          </div>
        )}
        {seance.energieApres !== null && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-foreground/50 mb-0.5">Énergie après</p>
            <p className="text-xl font-bold text-accent">{seance.energieApres}<span className="text-sm font-normal text-foreground/40">/10</span></p>
          </div>
        )}
        {seance.sommeil !== null && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-foreground/50 mb-0.5">Sommeil</p>
            <p className="text-xl font-bold text-foreground">{seance.sommeil}<span className="text-sm font-normal text-foreground/40"> h</span></p>
          </div>
        )}
        {seance.poidsCorps !== null && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-foreground/50 mb-0.5">Poids corporel</p>
            <p className="text-xl font-bold text-foreground">{seance.poidsCorps}<span className="text-sm font-normal text-foreground/40"> kg</span></p>
          </div>
        )}
        {seance.cardioFait && (
          <div className="rounded-2xl bg-white p-4 shadow-sm col-span-2">
            <p className="text-xs text-foreground/50 mb-0.5">Cardio</p>
            <p className="font-semibold text-foreground">
              {seance.cardioDuree ? `${seance.cardioDuree} min` : "Fait"}
            </p>
          </div>
        )}
      </div>

      {/* Notes globales */}
      {seance.notes?.trim() ? (
        <div className="rounded-2xl bg-white p-4 shadow-sm mb-4">
          <p className="text-xs text-foreground/50 mb-1">Notes générales</p>
          <p className="text-sm text-foreground leading-relaxed">{seance.notes}</p>
        </div>
      ) : null}

      {/* Exercices */}
      <div className="flex flex-col gap-3">
        {(seance.exercices ?? []).map((ex) => (
          <div key={ex.exerciceId} className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <p className="font-semibold text-foreground">{ex.nom}</p>
              {ex.notes?.trim() ? (
                <p className="text-xs text-foreground/50 mt-0.5 italic">{ex.notes}</p>
              ) : null}
            </div>
            <div className="px-4 pb-4">
              <div className="flex gap-1 mb-2">
                <span className="flex-1 text-center text-[10px] font-medium uppercase tracking-wide text-foreground/40">Série</span>
                <span className="flex-1 text-center text-[10px] font-medium uppercase tracking-wide text-foreground/40">Poids kg</span>
                <span className="flex-1 text-center text-[10px] font-medium uppercase tracking-wide text-foreground/40">Reps</span>
                <span className="w-8 text-center text-[10px] font-medium uppercase tracking-wide text-foreground/40">✓</span>
              </div>
              {(ex.series ?? []).map((s) => (
                <div key={s.numero} className={`flex gap-1 mb-1 rounded-lg px-2 py-1.5 ${s.completee ? "bg-green-50" : "bg-background"}`}>
                  <span className="flex-1 text-center text-sm text-foreground/50">{s.numero}</span>
                  <span className="flex-1 text-center text-sm font-semibold text-foreground">
                    {s.poids !== null ? s.poids : "—"}
                  </span>
                  <span className="flex-1 text-center text-sm font-semibold text-foreground">
                    {s.reps !== null ? s.reps : "—"}
                  </span>
                  <span className="w-8 text-center text-sm">
                    {s.completee ? "✓" : "○"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(seance.exercices ?? []).length === 0 && (
        <div className="rounded-2xl bg-white p-4 shadow-sm text-center text-foreground/40">
          <p className="text-sm">Aucun exercice enregistré pour cette séance.</p>
        </div>
      )}
    </div>
  );
}
