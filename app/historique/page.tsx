"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getSeancesParJour } from "@/lib/firestore";
import ProgressionChart from "@/components/ProgressionChart";
import type { JourSemaine } from "@/types";

const JOURS: { slug: JourSemaine; label: string }[] = [
  { slug: "lundi",    label: "Lundi" },
  { slug: "mardi",    label: "Mardi" },
  { slug: "mercredi", label: "Mercredi" },
  { slug: "jeudi",    label: "Jeudi" },
  { slug: "vendredi", label: "Vendredi" },
];

interface SeanceResume {
  id: string;
  date: string;
  semaine: number;
  qualite: number | null;
  completee: boolean;
  nbExercices: number;
}

function formatDateFr(iso: string): string {
  const [y, m, d] = iso.split("-");
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export default function HistoriquePage() {
  const { user } = useAuth();
  const [seancesParJour, setSeancesParJour] = useState<Record<JourSemaine, SeanceResume[]>>({
    lundi: [], mardi: [], mercredi: [], jeudi: [], vendredi: [],
  });
  const [loading, setLoading] = useState(true);
  const [jourOuvert, setJourOuvert] = useState<JourSemaine | null>(null);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    Promise.all(
      JOURS.map(({ slug }) =>
        getSeancesParJour(uid, slug).then((docs) => ({
          slug,
          seances: docs
            .map(({ id, data }) => ({
              id,
              date: typeof data.date === "string" ? data.date : "",
              semaine: data.semaine ?? 0,
              qualite: (data.qualite as number | null) ?? null,
              completee: !!data.completee,
              nbExercices: Array.isArray(data.exercices) ? (data.exercices as unknown[]).length : 0,
            }))
            .filter((s) => s.date !== "")
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 10),
        }))
      )
    ).then((results) => {
      const map = {} as Record<JourSemaine, SeanceResume[]>;
      results.forEach(({ slug, seances }) => { map[slug] = seances; });
      setSeancesParJour(map);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  return (
    <div className="px-4 py-6">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent opacity-70">
          Historique
        </p>
        <h1 className="text-2xl font-bold text-foreground">Mes séances</h1>
      </header>

      {!loading && user && (
        <div className="mb-4">
          <ProgressionChart uid={user.uid} />
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-center text-foreground/40">
          <p className="text-sm">Chargement…</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {JOURS.map(({ slug, label }) => {
            const seances = seancesParJour[slug] ?? [];
            const ouvert = jourOuvert === slug;
            return (
              <div key={slug} className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setJourOuvert(ouvert ? null : slug)}
                  className="flex min-h-[56px] w-full items-center justify-between px-4 py-3 active:opacity-70"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">{label}</span>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      {seances.length}
                    </span>
                  </div>
                  <span className="text-foreground/40 text-sm">{ouvert ? "▲" : "▼"}</span>
                </button>

                {ouvert && (
                  <div className="border-t border-foreground/5">
                    {seances.length === 0 ? (
                      <p className="px-4 py-4 text-sm text-foreground/40 text-center">
                        Aucune séance enregistrée
                      </p>
                    ) : (
                      seances.map((s) => (
                        <Link
                          key={s.id}
                          href={`/historique/${s.id}`}
                          className="flex items-center justify-between px-4 py-3 border-b border-foreground/5 last:border-0 active:opacity-70"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {formatDateFr(s.date)}
                            </p>
                            <p className="text-xs text-foreground/50 mt-0.5">
                              Semaine {s.semaine} · {s.nbExercices} exercice{s.nbExercices > 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-3">
                            {s.completee ? (
                              <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-700">
                                ✓
                              </span>
                            ) : (
                              <span className="rounded-full bg-foreground/8 px-2 py-0.5 text-xs text-foreground/40">
                                En cours
                              </span>
                            )}
                            {s.qualite !== null && (
                              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                                {s.qualite}/10
                              </span>
                            )}
                            <span className="text-foreground/30 text-xs">→</span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
