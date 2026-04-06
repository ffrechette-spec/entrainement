"use client";

import { useEffect } from "react";
import PixelIcon from "@/components/PixelIcon";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (error?.message) {
      // log silencieux — pas de console.log en production
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center gap-5">
      <PixelIcon type="cardio" size={48} />
      <div>
        <h1 className="font-retro text-xl font-bold text-foreground mb-2">
          Oups, une erreur
        </h1>
        <p className="text-sm text-foreground/60 max-w-xs">
          Quelque chose s&apos;est mal passé. Vérifie ta connexion et réessaie.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="min-h-[48px] rounded-2xl px-6 font-semibold text-white text-sm active:opacity-80"
        style={{ backgroundColor: "#FF6B9D" }}
      >
        Réessayer
      </button>
    </div>
  );
}
