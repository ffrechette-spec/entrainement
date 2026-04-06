"use client";

interface ProgressionBadgeProps {
  poidsActuel: number | null;
  poidsPrecedent: number | null;
}

export default function ProgressionBadge({ poidsActuel, poidsPrecedent }: ProgressionBadgeProps) {
  if (poidsPrecedent === null) {
    return (
      <span className="text-xs text-foreground/40">— Première séance</span>
    );
  }

  if (poidsActuel === null) {
    return (
      <span className="text-xs text-foreground/40">— Dernier : {poidsPrecedent} kg</span>
    );
  }

  const diff = poidsActuel - poidsPrecedent;

  if (diff > 0) {
    return (
      <span className="text-xs font-semibold text-green-600">
        ↑ +{diff.toFixed(1)} kg
      </span>
    );
  }

  if (diff < 0) {
    return (
      <span className="text-xs font-semibold text-red-500">
        ↓ {diff.toFixed(1)} kg
      </span>
    );
  }

  return (
    <span className="text-xs font-semibold text-foreground/40">= Stable</span>
  );
}
