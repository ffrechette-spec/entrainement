jest.mock("@/lib/firestore", () => ({
  creerSeance: jest.fn(),
  getSeanceDuJour: jest.fn(),
  sauvegarderSerie: jest.fn(),
  sauvegarderNotesExercice: jest.fn(),
  completerSeance: jest.fn(),
  getSeancesParJour: jest.fn(),
  getDerniersPoids: jest.fn(),
}));

jest.mock("@/components/SetupModal", () => ({
  getDateDebut: jest.fn(),
}));

import {
  creerSeance,
  getSeanceDuJour,
  sauvegarderSerie,
  sauvegarderNotesExercice,
  completerSeance,
} from "@/lib/firestore";
import { getDateDebut } from "@/components/SetupModal";
import type { Serie } from "@/types";

const mockCreerSeance = creerSeance as jest.MockedFunction<typeof creerSeance>;
const mockGetSeanceDuJour = getSeanceDuJour as jest.MockedFunction<typeof getSeanceDuJour>;
const mockSauvegarderSerie = sauvegarderSerie as jest.MockedFunction<typeof sauvegarderSerie>;
const mockSauvegarderNotes = sauvegarderNotesExercice as jest.MockedFunction<typeof sauvegarderNotesExercice>;
const mockCompleterSeance = completerSeance as jest.MockedFunction<typeof completerSeance>;
const mockGetDateDebut = getDateDebut as jest.MockedFunction<typeof getDateDebut>;

describe("creerSeance", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne un ID de séance", async () => {
    mockCreerSeance.mockResolvedValue("seance-abc");
    const id = await creerSeance("uid-1", "lundi", 2);
    expect(id).toBe("seance-abc");
  });

  it("est appelée avec uid, jour et semaine", async () => {
    mockCreerSeance.mockResolvedValue("seance-xyz");
    await creerSeance("uid-1", "mercredi", 3);
    expect(mockCreerSeance).toHaveBeenCalledWith("uid-1", "mercredi", 3);
  });
});

describe("getSeanceDuJour", () => {
  beforeEach(() => jest.clearAllMocks());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fakeDoc = (overrides: Record<string, unknown>) => ({ id: overrides.id ?? "id-1", data: overrides } as any);

  it("retourne null si aucune séance du jour", async () => {
    mockGetSeanceDuJour.mockResolvedValue(null);
    const result = await getSeanceDuJour("uid-1", "lundi");
    expect(result).toBeNull();
  });

  it("retourne la séance existante avec id et data", async () => {
    mockGetSeanceDuJour.mockResolvedValue(fakeDoc({ id: "seance-1", jour: "lundi", date: "2026-04-06", semaine: 1, completee: false }));
    const result = await getSeanceDuJour("uid-1", "lundi");
    expect(result?.id).toBe("seance-1");
    expect(result?.data.jour).toBe("lundi");
  });

  it("détecte une séance déjà complétée", async () => {
    mockGetSeanceDuJour.mockResolvedValue(fakeDoc({ id: "seance-2", jour: "mardi", date: "2026-04-07", semaine: 1, completee: true }));
    const result = await getSeanceDuJour("uid-1", "mardi");
    expect(result?.data.completee).toBe(true);
  });
});

describe("sauvegarderSerie", () => {
  beforeEach(() => jest.clearAllMocks());

  const series: Serie[] = [
    { numero: 1, poids: 60, reps: 10, completee: true },
    { numero: 2, poids: 62.5, reps: 9, completee: true },
  ];

  it("est appelée avec les bons arguments", async () => {
    mockSauvegarderSerie.mockResolvedValue(undefined);
    await sauvegarderSerie("uid-1", "seance-1", "developpe-couche", "Développé couché", series);
    expect(mockSauvegarderSerie).toHaveBeenCalledWith(
      "uid-1", "seance-1", "developpe-couche", "Développé couché", series
    );
  });

  it("ne lance pas d'erreur sur appel valide", async () => {
    mockSauvegarderSerie.mockResolvedValue(undefined);
    await expect(
      sauvegarderSerie("uid-1", "seance-1", "squat", "Squat", series)
    ).resolves.not.toThrow();
  });
});

describe("sauvegarderNotesExercice", () => {
  beforeEach(() => jest.clearAllMocks());

  it("est appelée avec uid, seanceId, exerciceId et notes", async () => {
    mockSauvegarderNotes.mockResolvedValue(undefined);
    await sauvegarderNotesExercice("uid-1", "seance-1", "squat", "Bonne amplitude");
    expect(mockSauvegarderNotes).toHaveBeenCalledWith(
      "uid-1", "seance-1", "squat", "Bonne amplitude"
    );
  });
});

describe("completerSeance", () => {
  beforeEach(() => jest.clearAllMocks());

  it("est appelée avec uid, seanceId et feedback", async () => {
    mockCompleterSeance.mockResolvedValue(undefined);
    const feedback = {
      qualite: 8,
      energieApres: 6,
      sommeil: 7,
      poidsCorps: 82,
      cardioFait: false,
      cardioDuree: null,
      notes: "Bonne séance",
    };
    await completerSeance("uid-1", "seance-1", feedback);
    expect(mockCompleterSeance).toHaveBeenCalledWith("uid-1", "seance-1", feedback);
  });

  it("ne lance pas d'erreur sur appel valide", async () => {
    mockCompleterSeance.mockResolvedValue(undefined);
    await expect(
      completerSeance("uid-1", "seance-1", {
        qualite: null, energieApres: null, sommeil: null,
        poidsCorps: null, cardioFait: false, cardioDuree: null, notes: "",
      })
    ).resolves.not.toThrow();
  });
});

describe("getDateDebut", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne une chaîne de date si configurée", async () => {
    mockGetDateDebut.mockResolvedValue("2026-03-23");
    const result = await getDateDebut("uid-1");
    expect(result).toBe("2026-03-23");
  });

  it("retourne null si non configurée", async () => {
    mockGetDateDebut.mockResolvedValue(null);
    const result = await getDateDebut("uid-1");
    expect(result).toBeNull();
  });
});
