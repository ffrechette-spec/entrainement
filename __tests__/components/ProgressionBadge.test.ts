/**
 * Tests unitaires pour la logique de ProgressionBadge.
 * On teste le calcul de la progression sans rendu DOM.
 */

type BadgeState = "premiere" | "aucun-poids" | "hausse" | "baisse" | "stable";

interface BadgeResult {
  state: BadgeState;
  diff?: number;
  poidsPrecedent?: number;
}

function calculerProgression(
  poidsActuel: number | null,
  poidsPrecedent: number | null
): BadgeResult {
  if (poidsPrecedent === null) return { state: "premiere" };
  if (poidsActuel === null) return { state: "aucun-poids", poidsPrecedent };
  const diff = poidsActuel - poidsPrecedent;
  if (diff > 0) return { state: "hausse", diff };
  if (diff < 0) return { state: "baisse", diff };
  return { state: "stable", diff: 0 };
}

describe("ProgressionBadge — calculerProgression", () => {
  it("première séance : poidsPrecedent null → state 'premiere'", () => {
    expect(calculerProgression(null, null).state).toBe("premiere");
    expect(calculerProgression(60, null).state).toBe("premiere");
  });

  it("poids précédent connu mais pas encore de saisie → 'aucun-poids'", () => {
    const r = calculerProgression(null, 55);
    expect(r.state).toBe("aucun-poids");
    expect(r.poidsPrecedent).toBe(55);
  });

  it("hausse : poidsActuel > poidsPrecedent", () => {
    const r = calculerProgression(62.5, 60);
    expect(r.state).toBe("hausse");
    expect(r.diff).toBeCloseTo(2.5);
  });

  it("baisse : poidsActuel < poidsPrecedent", () => {
    const r = calculerProgression(57.5, 60);
    expect(r.state).toBe("baisse");
    expect(r.diff).toBeCloseTo(-2.5);
  });

  it("stable : poidsActuel === poidsPrecedent", () => {
    const r = calculerProgression(60, 60);
    expect(r.state).toBe("stable");
    expect(r.diff).toBe(0);
  });

  it("hausse avec valeur entière", () => {
    const r = calculerProgression(70, 65);
    expect(r.state).toBe("hausse");
    expect(r.diff).toBe(5);
  });

  it("baisse de 0.5 kg", () => {
    const r = calculerProgression(59.5, 60);
    expect(r.state).toBe("baisse");
    expect(r.diff).toBeCloseTo(-0.5);
  });

  it("diff formaté à 1 décimale", () => {
    const r = calculerProgression(62.5, 60);
    expect(r.diff!.toFixed(1)).toBe("2.5");
  });
});

describe("ProgressionBadge — texte affiché", () => {
  it("hausse → affiche +X.X kg avec signe positif", () => {
    const { diff } = calculerProgression(65, 60);
    expect(`+${diff!.toFixed(1)} kg`).toBe("+5.0 kg");
  });

  it("baisse → affiche X.X kg (négatif)", () => {
    const { diff } = calculerProgression(57.5, 60);
    expect(`${diff!.toFixed(1)} kg`).toBe("-2.5 kg");
  });

  it("stable → 'Stable'", () => {
    const { state } = calculerProgression(60, 60);
    const label = state === "stable" ? "= Stable" : "";
    expect(label).toBe("= Stable");
  });

  it("première séance → '— Première séance'", () => {
    const { state } = calculerProgression(null, null);
    const label = state === "premiere" ? "— Première séance" : "";
    expect(label).toBe("— Première séance");
  });
});
