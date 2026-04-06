import type { JourSemaine } from "@/types";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ seconds: 0, nanoseconds: 0 })),
  },
}));

jest.mock("@/lib/firebase", () => ({ db: {} }));

import { getDocs } from "firebase/firestore";
import { getDerniersPoids } from "@/lib/firestore";

const mockGetDocs = getDocs as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  const { collection, query, where, orderBy, limit } = jest.requireMock("firebase/firestore");
  (collection as jest.Mock).mockReturnValue("col-ref");
  (query as jest.Mock).mockReturnValue("query-ref");
  (where as jest.Mock).mockReturnValue("where-clause");
  (orderBy as jest.Mock).mockReturnValue("orderby-clause");
  (limit as jest.Mock).mockReturnValue("limit-clause");
});

function makeSeanceDoc(date: string, exerciceId: string, series: Array<{ poids: number | null }>, completee = true) {
  return {
    data: () => ({
      date,
      completee,
      exercices: [
        {
          exerciceId,
          nom: "Test",
          series: series.map((s, i) => ({ numero: i + 1, poids: s.poids, reps: 10, completee: true })),
          notes: "",
        },
      ],
    }),
  };
}

describe("getDerniersPoids", () => {
  const TODAY = new Date().toISOString().split("T")[0];
  const YESTERDAY = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const LAST_WEEK = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

  it("retourne null pour toutes les séries si aucun historique", async () => {
    mockGetDocs.mockResolvedValue({ docs: [] });

    const result = await getDerniersPoids("uid-1", "lundi" as JourSemaine, "developpe-couche");

    expect(result).toEqual({ serie1: null, serie2: null, serie3: null, serie4: null });
  });

  it("ignore la séance du jour actuel", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [makeSeanceDoc(TODAY, "developpe-couche", [{ poids: 100 }, { poids: 105 }])],
    });

    const result = await getDerniersPoids("uid-1", "lundi" as JourSemaine, "developpe-couche");

    expect(result).toEqual({ serie1: null, serie2: null, serie3: null, serie4: null });
  });

  it("retourne les poids de la séance précédente la plus récente", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        makeSeanceDoc(YESTERDAY, "developpe-couche", [
          { poids: 80 }, { poids: 82.5 }, { poids: 80 }, { poids: 77.5 },
        ]),
      ],
    });

    const result = await getDerniersPoids("uid-1", "lundi" as JourSemaine, "developpe-couche");

    expect(result.serie1).toBe(80);
    expect(result.serie2).toBe(82.5);
    expect(result.serie3).toBe(80);
    expect(result.serie4).toBe(77.5);
  });

  it("retourne null pour les séries manquantes si séance courte", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [makeSeanceDoc(LAST_WEEK, "squat", [{ poids: 100 }, { poids: 105 }])],
    });

    const result = await getDerniersPoids("uid-1", "mercredi" as JourSemaine, "squat");

    expect(result.serie1).toBe(100);
    expect(result.serie2).toBe(105);
    expect(result.serie3).toBeNull();
    expect(result.serie4).toBeNull();
  });

  it("ignore les séances sans l'exercice recherché", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        makeSeanceDoc(YESTERDAY, "autre-exercice", [{ poids: 90 }]),
      ],
    });

    const result = await getDerniersPoids("uid-1", "lundi" as JourSemaine, "developpe-couche");

    expect(result).toEqual({ serie1: null, serie2: null, serie3: null, serie4: null });
  });
});

describe("calcul progression (ProgressionBadge logic)", () => {
  function calculerDiff(poidsActuel: number | null, poidsPrecedent: number | null): string {
    if (poidsPrecedent === null) return "première séance";
    if (poidsActuel === null) return `dernier: ${poidsPrecedent}`;
    const diff = poidsActuel - poidsPrecedent;
    if (diff > 0) return `↑ +${diff.toFixed(1)}`;
    if (diff < 0) return `↓ ${diff.toFixed(1)}`;
    return "stable";
  }

  it("détecte une progression", () => {
    expect(calculerDiff(85, 80)).toBe("↑ +5.0");
  });

  it("détecte une régression", () => {
    expect(calculerDiff(75, 80)).toBe("↓ -5.0");
  });

  it("détecte la stabilité", () => {
    expect(calculerDiff(80, 80)).toBe("stable");
  });

  it("indique première séance si pas d'historique", () => {
    expect(calculerDiff(80, null)).toBe("première séance");
  });

  it("indique dernier poids si pas encore saisi aujourd'hui", () => {
    expect(calculerDiff(null, 80)).toBe("dernier: 80");
  });
});
