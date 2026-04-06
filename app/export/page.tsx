"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { genererExport, nomFichierExport } from "@/lib/export";
import PixelIcon from "@/components/PixelIcon";
import type { ExportData } from "@/lib/export";

export default function ExportPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState<ExportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerer() {
    if (!user) return;
    setLoading(true);
    setError(null);
    setExportData(null);
    try {
      const data = await genererExport(user.uid);
      setExportData(data);
    } catch {
      setError("Erreur lors de la génération. Vérifie ta connexion.");
    } finally {
      setLoading(false);
    }
  }

  function handleTelecharger() {
    if (!exportData) return;
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomFichierExport();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="px-4 py-6">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent opacity-70">
          Export
        </p>
        <h1 className="font-retro text-2xl font-bold text-foreground">Export JSON</h1>
      </header>

      <div className="flex flex-col gap-4">
        {/* Description */}
        <div className="rounded-2xl bg-white p-4 shadow-sm flex items-start gap-3">
          <PixelIcon type="cardio" size={24} />
          <p className="text-sm text-foreground/70 leading-relaxed">
            Exporte toutes tes séances dans un fichier JSON structuré pour analyse par Claude.
          </p>
        </div>

        {/* Bouton générer */}
        <button
          type="button"
          onClick={handleGenerer}
          disabled={loading || !user}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-accent font-semibold text-white text-base active:opacity-80 disabled:opacity-50"
        >
          {loading ? "Génération en cours…" : "Générer l'export"}
        </button>

        {/* Erreur */}
        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Résultat */}
        {exportData && (
          <>
            <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
              <p className="text-sm font-semibold text-green-800 mb-1">
                ✓ Export prêt
              </p>
              <p className="text-sm text-green-700">
                {exportData.seances.length} séance{exportData.seances.length !== 1 ? "s" : ""} incluse{exportData.seances.length !== 1 ? "s" : ""}
                {" · "}Semaine {exportData.semaine_actuelle}
                {" · "}{exportData.export_date}
              </p>
            </div>

            <button
              type="button"
              onClick={handleTelecharger}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-green-500 font-semibold text-white text-base active:opacity-80"
            >
              � Télécharger {nomFichierExport()}
            </button>

            <div className="rounded-2xl bg-accent/5 border border-accent/15 p-4">
              <p className="text-xs font-semibold text-accent mb-1 uppercase tracking-wide">
                Instructions
              </p>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Glisse ce fichier dans ton projet Claude pour analyse.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
