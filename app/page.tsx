"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import SetupModal, { getDateDebut } from "@/components/SetupModal";
import { getSemaineActuelle, getJourActuel } from "@/lib/utils";
import { getCouleurJour } from "@/lib/couleurs";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import PixelIcon from "@/components/PixelIcon";
import type { JourSemaine } from "@/types";
import type { PixelIconType } from "@/components/PixelIcon";

const JOURS: { slug: JourSemaine; label: string; icon: PixelIconType }[] = [
  { slug: "lundi",    label: "Lundi",    icon: "pecs" },
  { slug: "mardi",    label: "Mardi",    icon: "dos" },
  { slug: "mercredi", label: "Mercredi", icon: "jambes" },
  { slug: "jeudi",    label: "Jeudi",    icon: "epaules" },
  { slug: "vendredi", label: "Vendredi", icon: "cardio" },
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
          {semaine !== null ? (
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-retro-bleu/20 to-retro-violet/20 px-3 py-1">
              <span className="font-retro text-xs font-bold tracking-widest text-retro-bleu">
                SEMAINE {semaine}
              </span>
              <span className="font-retro text-xs text-retro-violet opacity-70">/ 8</span>
            </div>
          ) : (
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent opacity-70">
              Gym Tracker
            </p>
          )}
          <h1 className="font-retro text-2xl font-bold text-foreground">
            {user?.displayName?.split(" ")[0] ?? "Entraînement"}
          </h1>
        </header>

        <ul className="flex flex-col gap-3">
          {JOURS.map(({ slug, label, icon }) => {
            const couleur = getCouleurJour(slug);
            const estAujourdhui = slug === jourActuel;
            const estCompletee = seancesCompletes.has(slug);
            return (
              <li key={slug}>
                <Link
                  href={`/seance/${slug}`}
                  className="flex min-h-[64px] items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm active:opacity-70 overflow-hidden relative"
                  style={{
                    borderLeft: `4px solid ${couleur.hex}`,
                    backgroundColor: estAujourdhui
                      ? `${couleur.hex}18`
                      : undefined,
                  }}
                >
                  <div className="min-w-0">
                    <p className="font-semibold leading-tight text-foreground">
                      {label}
                      {estAujourdhui && (
                        <span
                          className="ml-2 text-xs font-normal"
                          style={{ color: couleur.hex }}
                        >
                          Aujourd&apos;hui
                        </span>
                      )}
                    </p>
                    <p className="text-xs mt-0.5 truncate text-foreground/50">
                      {couleur.label}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {estCompletee && (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{
                          backgroundColor: `${couleur.hex}25`,
                          color: couleur.hex,
                        }}
                      >
                        ✓ Complétée
                      </span>
                    )}
                    <PixelIcon type={icon} size={20} />
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
