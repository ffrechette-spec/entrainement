import type { JourSemaine, Serie } from "@/types";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ seconds: 0, nanoseconds: 0 })),
    fromDate: jest.fn((d: Date) => ({ seconds: Math.floor(d.getTime() / 1000), nanoseconds: 0 })),
  },
}));

jest.mock("@/lib/firebase", () => ({ db: {} }));

import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { creerSeance, getSeanceDuJour, sauvegarderSerie } from "@/lib/firestore";

const mockCollection = collection as jest.Mock;
const mockDoc = doc as jest.Mock;
const mockAddDoc = addDoc as jest.Mock;
const mockSetDoc = setDoc as jest.Mock;
const mockGetDoc = getDoc as jest.Mock;
const mockGetDocs = getDocs as jest.Mock;
const mockQuery = query as jest.Mock;
const mockWhere = where as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockCollection.mockReturnValue("collection-ref");
  mockDoc.mockReturnValue("doc-ref");
  mockQuery.mockReturnValue("query-ref");
  mockWhere.mockReturnValue("where-clause");
});

describe("creerSeance", () => {
  it("appelle addDoc avec les bons champs", async () => {
    mockAddDoc.mockResolvedValue({ id: "seance-123" });

    const id = await creerSeance("uid-1", "lundi" as JourSemaine, 2);

    expect(mockAddDoc).toHaveBeenCalledTimes(1);
    const appelArgs = mockAddDoc.mock.calls[0][1] as Record<string, unknown>;
    expect(appelArgs.jour).toBe("lundi");
    expect(appelArgs.semaine).toBe(2);
    expect(appelArgs.completee).toBe(false);
    expect(id).toBe("seance-123");
  });

  it("inclut la date en format ISO string", async () => {
    mockAddDoc.mockResolvedValue({ id: "seance-456" });
    const dateTest = new Date("2026-04-07");

    await creerSeance("uid-1", "mardi" as JourSemaine, 1, dateTest);

    const appelArgs = mockAddDoc.mock.calls[0][1] as Record<string, unknown>;
    expect(appelArgs.date).toBe("2026-04-07");
  });
});

describe("getSeanceDuJour", () => {
  it("retourne null si aucune séance", async () => {
    mockGetDocs.mockResolvedValue({ empty: true, docs: [] });

    const result = await getSeanceDuJour("uid-1", "mercredi" as JourSemaine);

    expect(result).toBeNull();
  });

  it("retourne la séance si elle existe", async () => {
    const fakeData = { jour: "mercredi", date: "2026-04-09", completee: false };
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [{ id: "seance-789", data: () => fakeData }],
    });

    const result = await getSeanceDuJour("uid-1", "mercredi" as JourSemaine);

    expect(result).not.toBeNull();
    expect(result!.id).toBe("seance-789");
    expect(result!.data.jour).toBe("mercredi");
  });
});

describe("sauvegarderSerie", () => {
  const series: Serie[] = [
    { numero: 1, poids: 80, reps: 10, completee: true },
    { numero: 2, poids: 82.5, reps: 8, completee: false },
  ];

  it("ne fait rien si le document séance n'existe pas", async () => {
    mockGetDoc.mockResolvedValue({ exists: () => false });

    await sauvegarderSerie("uid-1", "seance-x", "developpe-couche", "Développé couché", series);

    expect(mockSetDoc).not.toHaveBeenCalled();
  });

  it("crée l'exercice s'il n'existe pas encore dans la séance", async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ exercices: [] }),
    });
    mockSetDoc.mockResolvedValue(undefined);

    await sauvegarderSerie("uid-1", "seance-1", "developpe-couche", "Développé couché", series);

    expect(mockSetDoc).toHaveBeenCalledTimes(1);
    const payload = mockSetDoc.mock.calls[0][1] as { exercices: unknown[] };
    expect(payload.exercices).toHaveLength(1);
  });

  it("met à jour les séries d'un exercice existant", async () => {
    const existingExercices = [
      { exerciceId: "developpe-couche", nom: "Développé couché", series: [], notes: "" },
    ];
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ exercices: existingExercices }),
    });
    mockSetDoc.mockResolvedValue(undefined);

    await sauvegarderSerie("uid-1", "seance-1", "developpe-couche", "Développé couché", series);

    const payload = mockSetDoc.mock.calls[0][1] as { exercices: Array<{ series: Serie[] }> };
    expect(payload.exercices[0].series).toEqual(series);
  });
});
