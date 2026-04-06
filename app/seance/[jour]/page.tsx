"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getDateDebut } from "@/components/SetupModal";
import { getExercicesParJour } from "@/lib/programme";
import { getSemaineActuelle, formatDate } from "@/lib/utils";
import { useSeance } from "@/hooks/useSeance";
import { useHistorique } from "@/hooks/useHistorique";
import { completerSeance } from "@/lib/firestore";
import type { DerniersPoids, FeedbackSeance } from "@/lib/firestore";
import type { JourSemaine } from "@/types";
import ExerciceCard from "@/components/ExerciceCard";
import FinSeanceModal from "@/components/FinSeanceModal";
import PixelIcon from "@/components/PixelIcon";
import { getCouleurJour } from "@/lib/couleurs";
import type { PixelIconType } from "@/components/PixelIcon";

const JOURS_VALIDES: JourSemaine[] = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];

const FOCUS: Record<JourSemaine, string> = {
  lundi: "Pectoraux · Épaules · Triceps",
  mardi: "Dos · Biceps",
  mercredi: "Jambes",
  jeudi: "Épaules · Dos · Bras",
  vendredi: "Jambes · Abdominaux · Cardio",
};

const ICONS: Record<JourSemaine, PixelIconType> = {
  lundi: "pecs",
  mardi: "dos",
  mercredi: "jambes",
  jeudi: "epaules",
  vendredi: "cardio",
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

  const exercices = useMemo(
    () => (jourValide ? getExercicesParJour(jourValide) : []),
    [jourValide]
  );

  const { seanceId, seanceCompletee, saveStatus, saveSerie, saveNotes, nouvelleSeance } = useSeance(
    user?.uid ?? "",
    jourValide ?? "lundi"
  );

  const { getPoidsPrecedents } = useHistorique(user?.uid ?? "");
  const [derniersPoids, setDerniersPoids] = useState<DerniersPoids | null>(null);
  const [showFinSeance, setShowFinSeance] = useState(false);
  const [finSaving, setFinSaving] = useState(false);

  useEffect(() => {
    if (!user || !jourValide || !exercices[index]) return;
    getPoidsPrecedents(jourValide, exercices[index].id).then(setDerniersPoids).catch(() => {});
  }, [user, jourValide, index, exercices, getPoidsPrecedents]);

  useEffect(() => {
    if (!jourValide) router.replace("/");
  }, [jourValide, router]);

  useEffect(() => {
    if (!user) return;
    getDateDebut(user.uid).then((dateDebut) => {
      if (dateDebut) setSemaine(getSemaineActuelle(new Date(dateDebut)));
    });
  }, [user]);

  async function handleTerminer(feedback: FeedbackSeance) {
    if (!user || !seanceId) return;
    setFinSaving(true);
    try {
      await completerSeance(user.uid, seanceId, feedback);
      router.push("/");
    } catch {
      setFinSaving(false);
    }
  }

  if (!jourValide) return null;

  const label = jourValide.charAt(0).toUpperCase() + jourValide.slice(1);
  const focus = FOCUS[jourValide];
  const dateAujourdhui = formatDate(new Date());
  const exercice = exercices[index] ?? null;
  const estDernierExercice = index === exercices.length - 1;
  const couleur = getCouleurJour(jourValide);
  const iconType = ICONS[jourValide];

  return (
    <>
      {showFinSeance && (
        <FinSeanceModal
          onConfirm={handleTerminer}
          onAnnuler={() => setShowFinSeance(false)}
          saving={finSaving}
        />
      )}

      <div
        className="px-4 py-6"
        style={{ background: `linear-gradient(180deg, ${couleur.hex}12 0%, transparent 120px)` }}
      >
        <header className="mb-5 flex items-start gap-3">
          <Link
            href="/"
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-foreground/60 active:opacity-70"
            aria-label="Retour"
          >
            ←
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="font-retro text-xs font-bold tracking-widest animate-retro-pulse inline-block rounded-full px-2 py-0.5"
                style={{ color: couleur.hex, backgroundColor: `${couleur.hex}20` }}
              >
                S{semaine}
              </span>
              <span className="text-xs text-foreground/40">{dateAujourdhui}</span>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="font-retro text-xl font-bold text-foreground leading-tight">{label}</h1>
              <PixelIcon type={iconType} size={20} />
            </div>
            <p className="text-sm text-foreground/50 mt-0.5">{focus}</p>
          </div>
        </header>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-foreground/40 mb-1">
            <span>Exercice {index + 1} / {exercices.length}</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${((index + 1) / exercices.length) * 100}%`,
                backgroundColor: couleur.hex,
              }}
            />
          </div>
        </div>

        {exercice ? (
          <ExerciceCard
            key={exercice.id}
            exercice={exercice}
            index={index}
            total={exercices.length}
            saveStatus={saveStatus}
            derniersPoids={derniersPoids}
            onPrev={() => setIndex((i) => Math.max(0, i - 1))}
            onNext={() => setIndex((i) => Math.min(exercices.length - 1, i + 1))}
            onSeriesChange={saveSerie}
            onNotesChange={saveNotes}
          />
        ) : (
          <div className="rounded-2xl bg-white p-4 shadow-sm text-center text-foreground/50">
            <p className="text-sm">Chargement des exercices…</p>
          </div>
        )}

        {seanceCompletee && (
          <div className="mt-4 rounded-2xl bg-green-50 border border-green-200 p-4">
            <p className="text-sm font-semibold text-green-800 mb-3">
              ✓ Séance déjà complétée aujourd&apos;hui
            </p>
            <button
              type="button"
              onClick={nouvelleSeance}
              className="w-full min-h-[44px] rounded-xl border border-green-300 text-sm font-medium text-green-700 active:opacity-70"
            >
              Recommencer une nouvelle séance
            </button>
          </div>
        )}

        {!seanceCompletee && estDernierExercice && exercice && (
          <button
            type="button"
            onClick={() => setShowFinSeance(true)}
            className="mt-4 w-full min-h-[52px] rounded-2xl bg-green-500 font-semibold text-white text-base active:opacity-80"
          >
            Terminer la séance ✓
          </button>
        )}
      </div>
    </>
  );
}
