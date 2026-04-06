"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import SetupModal, { getDateDebut } from "@/components/SetupModal";
import { getSemaineActuelle, getJourActuel } from "@/lib/utils";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import type { JourSemaine } from "@/types";

const JOURS: { slug: JourSemaine; label: string; focus: string }[] = [
  { slug: "lundi",    label: "Lundi",    focus: "Pectoraux · Épaules · Triceps" },
  { slug: "mardi",    label: "Mardi",    focus: "Dos · Biceps" },
  { slug: "mercredi", label: "Mercredi", focus: "Jambes" },
  { slug: "jeudi",    label: "Jeudi",    focus: "Épaules · Dos · Bras" },
  { slug: "vendredi", label: "Vendredi", focus: "Jambes · Abdominaux · Cardio" },
];

function todayDateStr(): string {
  return new Date().toISOString().split("T")[0];
}

export default function Accueil() {
  const { user } = useAuth();
  const [showSetup, setShowSetup] = useState(false);
  const [semaine, setSemaine] = useState<number | null>(null);
  const [seancesCompletes, setSeancesCompletes] = useState<Set<string>>(new Set());
  const jourActuel = getJourActuel();

  useEffect(() => {
    if (!user) return;
    getDateDebut(user.uid).then((dateDebut) => {
      if (!dateDebut) {
        setShowSetup(true);
      } else {
        setSemaine(getSemaineActuelle(new Date(dateDebut)));
      }
    }).catch(() => {
      setShowSetup(true);
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const today = todayDateStr();
    const seancesRef = collection(db, "users", user.uid, "seances");
    const q = query(seancesRef, where("date", "==", today), where("completee", "==", true));
    getDocs(q).then((snap) => {
      const jours = new Set<string>();
      snap.forEach((doc) => {
        const data = doc.data();
        if (data.jour) jours.add(data.jour as string);
      });
      setSeancesCompletes(jours);
    }).catch(() => {});
  }, [user]);

  function handleSetupComplete() {
    setShowSetup(false);
    if (user) {
      getDateDebut(user.uid).then((dateDebut) => {
        if (dateDebut) setSemaine(getSemaineActuelle(new Date(dateDebut)));
      });
    }
  }

  return (
    <>
      {showSetup && user ? (
        <SetupModal user={user} onComplete={handleSetupComplete} />
      ) : null}

      <div className="px-4 py-6">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent opacity-70">
            {semaine !== null ? `Semaine ${semaine} / 8` : "Gym Tracker"}
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            {user?.displayName?.split(" ")[0] ?? "Entraînement"}
          </h1>
        </header>

        <ul className="flex flex-col gap-3">
          {JOURS.map(({ slug, label, focus }) => {
            const estAujourdhui = slug === jourActuel;
            const estCompletee = seancesCompletes.has(slug);
            return (
              <li key={slug}>
                <Link
                  href={`/seance/${slug}`}
                  className={`flex min-h-[64px] items-center justify-between rounded-2xl px-4 py-3 shadow-sm active:opacity-70 ${
                    estAujourdhui
                      ? "bg-accent text-white"
                      : "bg-white text-foreground"
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`font-semibold leading-tight ${estAujourdhui ? "text-white" : "text-foreground"}`}>
                      {label}
                      {estAujourdhui && (
                        <span className="ml-2 text-xs font-normal opacity-80">Aujourd&apos;hui</span>
                      )}
                    </p>
                    <p className={`text-xs mt-0.5 truncate ${estAujourdhui ? "text-white/70" : "text-foreground/50"}`}>
                      {focus}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {estCompletee && (
                      <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-700">
                        ✓
                      </span>
                    )}
                    <span className={estAujourdhui ? "text-white/60" : "text-foreground/30"}>→</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
