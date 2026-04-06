"use client";

import { useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "firebase/auth";

interface SetupModalProps {
  user: User;
  onComplete: () => void;
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export default function SetupModal({ user, onComplete }: SetupModalProps) {
  const [date, setDate] = useState(todayISO());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!date) return;
    setSaving(true);
    setError(null);
    try {
      const configRef = doc(db, "users", user.uid, "meta", "config");
      console.log("[SetupModal] writing to", configRef.path, "date:", date);
      await setDoc(
        configRef,
        { dateDebut: date, programmeActif: "8-semaines" },
        { merge: true }
      );
      console.log("[SetupModal] write success");
      onComplete();
    } catch (err) {
      console.error("[SetupModal] write error", err);
      setError("Erreur lors de la sauvegarde. Réessaie.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-foreground mb-1">
          Bienvenue 👋
        </h2>
        <p className="text-sm text-foreground/60 mb-5">
          Quelle est la date de début de ton programme&nbsp;?
        </p>

        <label className="block text-sm font-medium text-foreground/70 mb-1">
          Date de début
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={todayISO()}
          className="w-full rounded-xl border border-accent/20 bg-white px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent mb-4 min-h-[44px]"
        />

        {error ? (
          <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <button
          onClick={handleSave}
          disabled={saving || !date}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-medium text-white active:opacity-80 disabled:opacity-50"
          type="button"
        >
          {saving ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : null}
          {saving ? "Sauvegarde…" : "Démarrer le programme"}
        </button>
      </div>
    </div>
  );
}

export async function getDateDebut(uid: string): Promise<string | null> {
  const configRef = doc(db, "users", uid, "meta", "config");
  const snap = await getDoc(configRef);
  if (!snap.exists()) return null;
  return (snap.data().dateDebut as string) ?? null;
}
