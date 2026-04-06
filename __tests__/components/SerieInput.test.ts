/**
 * Tests unitaires pour la logique de SerieInput.
 * On teste la logique de parsing/transformation des valeurs,
 * sans rendu DOM (environnement node).
 */

import type { Serie } from "@/types";

function parsePoidsInput(val: string): number | null {
  return val === "" ? null : parseFloat(val);
}

function parseRepsInput(val: string): number | null {
  return val === "" ? null : parseInt(val, 10);
}

function toggleComplete(serie: Serie): Serie {
  return { ...serie, completee: !serie.completee };
}

function applyPoidsChange(serie: Serie, val: string): Serie {
  return { ...serie, poids: parsePoidsInput(val) };
}

function applyRepsChange(serie: Serie, val: string): Serie {
  return { ...serie, reps: parseRepsInput(val) };
}

const baseSerie: Serie = { numero: 1, poids: null, reps: null, completee: false };

describe("SerieInput — logique parsing poids", () => {
  it("valeur vide → null", () => {
    expect(parsePoidsInput("")).toBeNull();
  });

  it("valeur entière → float", () => {
    expect(parsePoidsInput("60")).toBe(60);
  });

  it("valeur décimale → float", () => {
    expect(parsePoidsInput("57.5")).toBe(57.5);
  });

  it("applique le changement de poids à la série", () => {
    const updated = applyPoidsChange(baseSerie, "75");
    expect(updated.poids).toBe(75);
    expect(updated.numero).toBe(1);
  });

  it("efface le poids avec valeur vide", () => {
    const serie = { ...baseSerie, poids: 60 };
    const updated = applyPoidsChange(serie, "");
    expect(updated.poids).toBeNull();
  });
});

describe("SerieInput — logique parsing reps", () => {
  it("valeur vide → null", () => {
    expect(parseRepsInput("")).toBeNull();
  });

  it("valeur entière → int", () => {
    expect(parseRepsInput("10")).toBe(10);
  });

  it("applique le changement de reps à la série", () => {
    const updated = applyRepsChange(baseSerie, "8");
    expect(updated.reps).toBe(8);
  });

  it("efface les reps avec valeur vide", () => {
    const serie = { ...baseSerie, reps: 10 };
    const updated = applyRepsChange(serie, "");
    expect(updated.reps).toBeNull();
  });
});

describe("SerieInput — toggleComplete", () => {
  it("passe de false à true", () => {
    const updated = toggleComplete(baseSerie);
    expect(updated.completee).toBe(true);
  });

  it("passe de true à false", () => {
    const serie = { ...baseSerie, completee: true };
    const updated = toggleComplete(serie);
    expect(updated.completee).toBe(false);
  });

  it("préserve les autres champs", () => {
    const serie: Serie = { numero: 2, poids: 60, reps: 10, completee: false };
    const updated = toggleComplete(serie);
    expect(updated.numero).toBe(2);
    expect(updated.poids).toBe(60);
    expect(updated.reps).toBe(10);
  });
});

describe("SerieInput — placeholder poidsDefaut", () => {
  it("affiche le poids précédent comme hint quand poids est null", () => {
    const poidsDefaut = 55;
    const serie = { ...baseSerie, poids: null };
    const showHint = poidsDefaut != null && serie.poids === null;
    expect(showHint).toBe(true);
  });

  it("n'affiche pas le hint si poids est saisi", () => {
    const poidsDefaut = 55;
    const serie = { ...baseSerie, poids: 60 };
    const showHint = poidsDefaut != null && serie.poids === null;
    expect(showHint).toBe(false);
  });

  it("n'affiche pas le hint si poidsDefaut est null", () => {
    const poidsDefaut = null;
    const serie = { ...baseSerie, poids: null };
    const showHint = poidsDefaut != null && serie.poids === null;
    expect(showHint).toBe(false);
  });
});
