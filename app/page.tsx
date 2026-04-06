"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import SetupModal, { getDateDebut } from "@/components/SetupModal";
import { getSemaineActuelle } from "@/lib/utils";
import Link from "next/link";

const JOURS = [
  { slug: "lundi", label: "Lundi" },
  { slug: "mardi", label: "Mardi" },
  { slug: "mercredi", label: "Mercredi" },
  { slug: "jeudi", label: "Jeudi" },
  { slug: "vendredi", label: "Vendredi" },
] as const;

export default function Accueil() {
  const { user } = useAuth();
  const [showSetup, setShowSetup] = useState(false);
  const [semaine, setSemaine] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    getDateDebut(user.uid).then((dateDebut) => {
      if (!dateDebut) {
        setShowSetup(true);
      } else {
        const s = getSemaineActuelle(new Date(dateDebut));
        setSemaine(s);
      }
    }).catch(() => {
      setShowSetup(true);
    });
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
          {JOURS.map(({ slug, label }) => (
            <li key={slug}>
              <Link
                href={`/seance/${slug}`}
                className="flex min-h-[56px] items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm active:opacity-70"
              >
                <span className="font-medium text-foreground">{label}</span>
                <span className="text-foreground/30">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
