"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useHistorique } from "@/hooks/useHistorique";
import { getExercicesParJour } from "@/lib/programme";
import type { JourSemaine } from "@/types";

const JOURS: JourSemaine[] = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];

interface Point {
  date: string;
  poidsMax: number;
}

interface Props {
  uid: string;
}

function labelDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

export default function ProgressionChart({ uid }: Props) {
  const { getProgressionExercice } = useHistorique(uid);

  const allExercices = JOURS.flatMap((j) =>
    getExercicesParJour(j).map((e) => ({ id: e.id, nom: e.nom, jour: j }))
  );

  const [exerciceId, setExerciceId] = useState(allExercices[0]?.id ?? "");
  const [exerciceJour, setExerciceJour] = useState<JourSemaine>(allExercices[0]?.jour ?? "lundi");
  const [points, setPoints] = useState<Point[] | null>(null);

  useEffect(() => {
    if (!exerciceId || !exerciceJour) return;
    let cancelled = false;
    getProgressionExercice(exerciceJour, exerciceId)
      .then((pts) => { if (!cancelled) setPoints(pts); })
      .catch(() => { if (!cancelled) setPoints([]); });
    return () => { cancelled = true; };
  }, [exerciceId, exerciceJour, getProgressionExercice]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    const found = allExercices.find((ex) => ex.id === val);
    if (found) {
      setExerciceId(found.id);
      setExerciceJour(found.jour);
    }
  }

  const chartData = (points ?? []).map((p) => ({
    date: labelDate(p.date),
    poids: p.poidsMax,
  }));

  return (
    <div className="rounded-2xl bg-white shadow-sm p-5">
      <p className="text-sm font-semibold text-foreground mb-3">Progression par exercice</p>

      <select
        value={exerciceId}
        onChange={handleChange}
        className="w-full min-h-[44px] rounded-xl border border-accent/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent mb-4"
      >
        {JOURS.map((jour) => (
          <optgroup key={jour} label={jour.charAt(0).toUpperCase() + jour.slice(1)}>
            {getExercicesParJour(jour).map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.nom}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {points === null ? (
        <div className="h-40 flex items-center justify-center text-sm text-foreground/40">
          Chargement…
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-sm text-foreground/40">
          Aucune donnée pour cet exercice
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
              formatter={(value) => [`${value} kg`, "Poids max"]}
            />
            <Line
              type="monotone"
              dataKey="poids"
              stroke="#0f3460"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#0f3460", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
