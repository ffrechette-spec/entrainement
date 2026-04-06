import type { JourSemaine } from "@/types";

export interface CouleurJour {
  hex: string;
  classe: string;
  classeBg: string;
  classeText: string;
  classeBorder: string;
  gradient: string;
  label: string;
}

const COULEURS: Record<JourSemaine, CouleurJour> = {
  lundi: {
    hex: "#FF6B9D",
    classe: "retro-rose",
    classeBg: "bg-retro-rose",
    classeText: "text-retro-rose",
    classeBorder: "border-retro-rose",
    gradient: "from-retro-rose/10 to-transparent",
    label: "Pectoraux · Épaules · Triceps",
  },
  mardi: {
    hex: "#4ECDC4",
    classe: "retro-bleu",
    classeBg: "bg-retro-bleu",
    classeText: "text-retro-bleu",
    classeBorder: "border-retro-bleu",
    gradient: "from-retro-bleu/10 to-transparent",
    label: "Dos · Biceps",
  },
  mercredi: {
    hex: "#C77DFF",
    classe: "retro-violet",
    classeBg: "bg-retro-violet",
    classeText: "text-retro-violet",
    classeBorder: "border-retro-violet",
    gradient: "from-retro-violet/10 to-transparent",
    label: "Jambes",
  },
  jeudi: {
    hex: "#00F5FF",
    classe: "retro-cyan",
    classeBg: "bg-retro-cyan",
    classeText: "text-retro-cyan",
    classeBorder: "border-retro-cyan",
    gradient: "from-retro-cyan/10 to-transparent",
    label: "Épaules · Dos · Bras",
  },
  vendredi: {
    hex: "#FFD93D",
    classe: "retro-gold",
    classeBg: "bg-retro-gold",
    classeText: "text-retro-gold",
    classeBorder: "border-retro-gold",
    gradient: "from-retro-gold/10 to-transparent",
    label: "Jambes · Abdominaux · Cardio",
  },
};

export function getCouleurJour(jour: JourSemaine): CouleurJour {
  return COULEURS[jour];
}

export type { JourSemaine };
