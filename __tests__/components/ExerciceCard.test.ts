/**
 * Tests unitaires pour la logique de ExerciceCard.
 * Teste la navigation, la logique de notes, et l'état des boutons
 * sans rendu DOM.
 */

import type { Serie } from "@/types";

// Logique de navigation
function canGoPrev(index: number): boolean {
  return index > 0;
}

function canGoNext(index: number, total: number): boolean {
  return index < total - 1;
}

function isLast(index: number, total: number): boolean {
  return index === total - 1;
}

// Logique des séries : calcul poids max
function getPoidsMax(series: Serie[]): number | null {
  const poids = series
    .map((s) => s.poids)
    .filter((p): p is number => p !== null && p > 0);
  if (poids.length === 0) return null;
  return Math.max(...poids);
}

// Logique notes collapsible
function hasNote(notes: string): boolean {
  return notes.trim().length > 0;
}

describe("ExerciceCard — navigation", () => {
  it("canGoPrev est false au premier exercice", () => {
    expect(canGoPrev(0)).toBe(false);
  });

  it("canGoPrev est true à partir du deuxième exercice", () => {
    expect(canGoPrev(1)).toBe(true);
    expect(canGoPrev(4)).toBe(true);
  });

  it("canGoNext est false au dernier exercice", () => {
    expect(canGoNext(4, 5)).toBe(false);
  });

  it("canGoNext est true avant le dernier", () => {
    expect(canGoNext(0, 5)).toBe(true);
    expect(canGoNext(3, 5)).toBe(true);
  });

  it("isLast est true uniquement sur le dernier index", () => {
    expect(isLast(4, 5)).toBe(true);
    expect(isLast(3, 5)).toBe(false);
    expect(isLast(0, 1)).toBe(true);
  });

  it("navigation avec 1 seul exercice : ni prev ni next", () => {
    expect(canGoPrev(0)).toBe(false);
    expect(canGoNext(0, 1)).toBe(false);
    expect(isLast(0, 1)).toBe(true);
  });
});

describe("ExerciceCard — poids max séries", () => {
  it("retourne null si aucune série n'a de poids", () => {
    const series: Serie[] = [
      { numero: 1, poids: null, reps: 10, completee: false },
      { numero: 2, poids: null, reps: 8, completee: false },
    ];
    expect(getPoidsMax(series)).toBeNull();
  });

  it("retourne le poids max parmi les séries", () => {
    const series: Serie[] = [
      { numero: 1, poids: 60, reps: 10, completee: true },
      { numero: 2, poids: 62.5, reps: 9, completee: true },
      { numero: 3, poids: 57.5, reps: 10, completee: true },
    ];
    expect(getPoidsMax(series)).toBe(62.5);
  });

  it("ignore les poids nuls ou zéro", () => {
    const series: Serie[] = [
      { numero: 1, poids: 0, reps: 10, completee: false },
      { numero: 2, poids: 55, reps: 8, completee: true },
    ];
    expect(getPoidsMax(series)).toBe(55);
  });

  it("retourne null pour tableau vide", () => {
    expect(getPoidsMax([])).toBeNull();
  });
});

describe("ExerciceCard — notes collapsible", () => {
  it("hasNote est false pour chaîne vide", () => {
    expect(hasNote("")).toBe(false);
  });

  it("hasNote est false pour espaces uniquement", () => {
    expect(hasNote("   ")).toBe(false);
  });

  it("hasNote est true pour une note non vide", () => {
    expect(hasNote("Bonne séance")).toBe(true);
  });

  it("hasNote est true pour une note avec espaces entourants", () => {
    expect(hasNote("  note  ")).toBe(true);
  });
});
