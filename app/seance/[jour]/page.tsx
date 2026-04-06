"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getDateDebut } from "@/components/SetupModal";
import { getExercicesParJour } from "@/lib/programme";
import { getSemaineActuelle, formatDate } from "@/lib/utils";
import { useSeance } from "@/hooks/useSeance";
import type { JourSemaine } from "@/types";
import ExerciceCard from "@/components/ExerciceCard";

const JOURS_VALIDES: JourSemaine[] = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];

const FOCUS: Record<JourSemaine, string> = {
  lundi: "Pectoraux · Épaules · Triceps",
  mardi: "Dos · Biceps",
  mercredi: "Jambes",
  jeudi: "Épaules · Dos · Bras",
  vendredi: "Jambes · Abdominaux · Cardio",
};

interface SeancePageProps {
  params: Promise<{ jour: string }>;
}

export default function SeancePage({ params }: SeancePageProps) {
  const { jour } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [semaine, setSemaine] = useState<number>(1);
  const [index, setIndex] = useState(0);

  const jourValide = JOURS_VALIDES.includes(jour as JourSemaine)
    ? (jour as JourSemaine)
    : null;

  const exercices = jourValide ? getExercicesParJour(jourValide) : [];

  const { saveStatus, saveSerie } = useSeance(
    user?.uid ?? "",
    jourValide ?? "lundi"
  );

  useEffect(() => {
    if (!jourValide) router.replace("/");
  }, [jourValide, router]);

  useEffect(() => {
    if (!user) return;
    getDateDebut(user.uid).then((dateDebut) => {
      if (dateDebut) setSemaine(getSemaineActuelle(new Date(dateDebut)));
    });
  }, [user]);

  if (!jourValide) return null;

  const label = jourValide.charAt(0).toUpperCase() + jourValide.slice(1);
  const focus = FOCUS[jourValide];
  const dateAujourdhui = formatDate(new Date());
  const exercice = exercices[index] ?? null;

  return (
    <div className="px-4 py-6">
      <header className="mb-5 flex items-start gap-3">
        <Link
          href="/"
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-foreground/60 active:opacity-70"
          aria-label="Retour"
        >
          ←
        </Link>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent opacity-70">
            Semaine {semaine} · {dateAujourdhui}
          </p>
          <h1 className="text-xl font-bold text-foreground leading-tight">{label}</h1>
          <p className="text-sm text-foreground/50 mt-0.5">{focus}</p>
        </div>
      </header>

      {exercice ? (
        <ExerciceCard
          key={exercice.id}
          exercice={exercice}
          index={index}
          total={exercices.length}
          saveStatus={saveStatus}
          onPrev={() => setIndex((i) => Math.max(0, i - 1))}
          onNext={() => setIndex((i) => Math.min(exercices.length - 1, i + 1))}
          onSeriesChange={saveSerie}
        />
      ) : (
        <div className="rounded-2xl bg-white p-4 shadow-sm text-center text-foreground/50">
          <p className="text-sm">Chargement des exercices…</p>
        </div>
      )}
    </div>
  );
}
