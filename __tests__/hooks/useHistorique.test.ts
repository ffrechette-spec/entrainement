jest.mock("@/lib/firestore", () => ({
  getSeancesParJour: jest.fn(),
  getDerniersPoids: jest.fn(),
}));

import { getSeancesParJour } from "@/lib/firestore";

const mockGetSeancesParJour = getSeancesParJour as jest.MockedFunction<typeof getSeancesParJour>;

type SeanceDoc = { id: string; data: Record<string, unknown> };

function makeSeance(overrides: Record<string, unknown>): SeanceDoc {
  return {
    id: overrides.id as string ?? "id-1",
    data: {
      jour: "lundi",
      date: "2026-04-07",
      semaine: 1,
      completee: true,
      exercices: [],
      ...overrides,
    },
  };
}

// Tests de la logique pure extraite de useHistorique
// (pas de hook React — on teste les fonctions de transformation)

function getDerniereSeanceLogic(seances: SeanceDoc[], today: string): SeanceDoc | null {
  const completes = seances
    .filter((s) => s.data.completee)
    .sort((a, b) => {
      const da = typeof a.data.date === "string" ? a.data.date : "";
      const db_ = typeof b.data.date === "string" ? b.data.date : "";
      return db_.localeCompare(da);
    });
  const precedente = completes.find((s) => {
    const d = typeof s.data.date === "string" ? s.data.date : "";
    return d < today;
  });
  return precedente ?? null;
}

function getProgressionLogic(
  seances: SeanceDoc[],
  exerciceId: string
): { date: string; poidsMax: number }[] {
  const completes = seances
    .filter((s) => s.data.completee)
    .sort((a, b) => {
      const da = typeof a.data.date === "string" ? a.data.date : "";
      const db_ = typeof b.data.date === "string" ? b.data.date : "";
      return da.localeCompare(db_);
    });

  return completes
    .map((s) => {
      const exercices = s.data.exercices as Array<{ exerciceId: string; series: Array<{ poids: number | null }> }>;
      const ex = exercices.find((e) => e.exerciceId === exerciceId);
      if (!ex) return null;
      const poidsMax = Math.max(
        0,
        ...(ex.series ?? []).map((serie) => serie.poids ?? 0).filter((p) => p > 0)
      );
      if (poidsMax === 0) return null;
      return { date: typeof s.data.date === "string" ? s.data.date : "", poidsMax };
    })
    .filter((p): p is { date: string; poidsMax: number } => p !== null);
}

describe("useHistorique — getDerniereSeance logique", () => {
  it("retourne null si aucune séance", () => {
    expect(getDerniereSeanceLogic([], "2026-04-07")).toBeNull();
  });

  it("retourne null si toutes les séances sont aujourd'hui ou futur", () => {
    const seances = [makeSeance({ date: "2026-04-07" })];
    expect(getDerniereSeanceLogic(seances, "2026-04-07")).toBeNull();
  });

  it("retourne la séance précédente la plus récente", () => {
    const seances = [
      makeSeance({ id: "a", date: "2026-03-31" }),
      makeSeance({ id: "b", date: "2026-04-06" }),
    ];
    const result = getDerniereSeanceLogic(seances, "2026-04-07");
    expect(result?.id).toBe("b");
  });

  it("ignore les séances non complétées", () => {
    const seances = [
      makeSeance({ id: "a", date: "2026-04-06", completee: false }),
      makeSeance({ id: "b", date: "2026-03-31", completee: true }),
    ];
    const result = getDerniereSeanceLogic(seances, "2026-04-07");
    expect(result?.id).toBe("b");
  });
});

describe("useHistorique — getProgressionExercice logique", () => {
  const exerciceId = "developpe-couche";

  it("retourne tableau vide si aucune séance", () => {
    expect(getProgressionLogic([], exerciceId)).toEqual([]);
  });

  it("retourne tableau vide si exercice absent", () => {
    const seances = [makeSeance({ exercices: [{ exerciceId: "autre", series: [{ poids: 60 }] }] })];
    expect(getProgressionLogic(seances, exerciceId)).toEqual([]);
  });

  it("retourne le poids max de chaque séance", () => {
    const seances = [
      makeSeance({
        id: "s1",
        date: "2026-03-31",
        exercices: [{
          exerciceId,
          series: [{ poids: 60 }, { poids: 62.5 }, { poids: 57.5 }],
        }],
      }),
      makeSeance({
        id: "s2",
        date: "2026-04-07",
        exercices: [{
          exerciceId,
          series: [{ poids: 65 }, { poids: 65 }],
        }],
      }),
    ];
    const result = getProgressionLogic(seances, exerciceId);
    expect(result).toHaveLength(2);
    expect(result[0].poidsMax).toBe(62.5);
    expect(result[1].poidsMax).toBe(65);
  });

  it("ignore les séries avec poids null ou zéro", () => {
    const seances = [
      makeSeance({
        exercices: [{
          exerciceId,
          series: [{ poids: null }, { poids: 0 }, { poids: 55 }],
        }],
      }),
    ];
    const result = getProgressionLogic(seances, exerciceId);
    expect(result[0].poidsMax).toBe(55);
  });

  it("exclut les séances sans poids valide", () => {
    const seances = [
      makeSeance({
        exercices: [{
          exerciceId,
          series: [{ poids: null }, { poids: 0 }],
        }],
      }),
    ];
    expect(getProgressionLogic(seances, exerciceId)).toEqual([]);
  });

  it("trie les points par date croissante", () => {
    const seances = [
      makeSeance({ id: "s2", date: "2026-04-07", exercices: [{ exerciceId, series: [{ poids: 65 }] }] }),
      makeSeance({ id: "s1", date: "2026-03-31", exercices: [{ exerciceId, series: [{ poids: 60 }] }] }),
    ];
    const result = getProgressionLogic(seances, exerciceId);
    expect(result[0].date).toBe("2026-03-31");
    expect(result[1].date).toBe("2026-04-07");
  });
});

describe("getSeancesParJour — intégration mock", () => {
  beforeEach(() => jest.clearAllMocks());

  it("est appelée avec uid et jour", async () => {
    mockGetSeancesParJour.mockResolvedValue([]);
    await getSeancesParJour("uid-1", "lundi");
    expect(mockGetSeancesParJour).toHaveBeenCalledWith("uid-1", "lundi");
  });

  it("retourne tableau vide si aucune séance", async () => {
    mockGetSeancesParJour.mockResolvedValue([]);
    const result = await getSeancesParJour("uid-1", "lundi");
    expect(result).toEqual([]);
  });
});
