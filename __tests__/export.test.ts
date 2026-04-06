jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
}));

jest.mock("@/lib/firebase", () => ({ db: {} }));

jest.mock("@/components/SetupModal", () => ({
  getDateDebut: jest.fn(),
}));

import { getDocs } from "firebase/firestore";
import { getDateDebut } from "@/components/SetupModal";
import { genererExport, nomFichierExport } from "@/lib/export";

const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockGetDateDebut = getDateDebut as jest.MockedFunction<typeof getDateDebut>;

function makeDocSnap(data: Record<string, unknown>) {
  return { data: () => data, id: "test-id" };
}

describe("nomFichierExport", () => {
  it("retourne le format gym_export_AAAA-MM-JJ.json", () => {
    const nom = nomFichierExport();
    expect(nom).toMatch(/^gym_export_\d{4}-\d{2}-\d{2}\.json$/);
  });

  it("contient la date d'aujourd'hui", () => {
    const today = new Date().toISOString().split("T")[0];
    const nom = nomFichierExport();
    expect(nom).toBe(`gym_export_${today}.json`);
  });
});

describe("genererExport — format JSON", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDateDebut.mockResolvedValue("2026-03-01");
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const snap = (docs: unknown[]) => ({ docs } as any);

  it("contient les champs racine requis", async () => {
    mockGetDocs.mockResolvedValue(snap([]));
    const data = await genererExport("uid-test");
    expect(data).toHaveProperty("export_date");
    expect(data).toHaveProperty("programme");
    expect(data).toHaveProperty("semaine_actuelle");
    expect(data).toHaveProperty("seances");
  });

  it("export_date est au format AAAA-MM-JJ", async () => {
    mockGetDocs.mockResolvedValue(snap([]));
    const data = await genererExport("uid-test");
    expect(data.export_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("programme est la chaîne attendue", async () => {
    mockGetDocs.mockResolvedValue(snap([]));
    const data = await genererExport("uid-test");
    expect(data.programme).toBe("8 semaines — Définition musculaire");
  });

  it("cas sans données — seances est un tableau vide", async () => {
    mockGetDocs.mockResolvedValue(snap([]));
    const data = await genererExport("uid-test");
    expect(Array.isArray(data.seances)).toBe(true);
    expect(data.seances).toHaveLength(0);
  });

  it("mappe correctement une séance avec exercices", async () => {
    const seanceDoc = makeDocSnap({
      jour: "lundi",
      date: "2026-04-07",
      semaine: 2,
      qualite: 8,
      energieAvant: 7,
      energieApres: 6,
      sommeil: 7.5,
      poidsCorps: 82,
      cardioFait: false,
      cardioDuree: null,
      notes: "Bonne séance",
      completee: true,
      exercices: [
        {
          exerciceId: "developpe-couche",
          nom: "Développé couché",
          notes: "",
          series: [
            { numero: 1, poids: 60, reps: 10, completee: true },
            { numero: 2, poids: 60, reps: 9, completee: true },
          ],
        },
      ],
    });
    mockGetDocs.mockResolvedValue({ docs: [seanceDoc] } as ReturnType<typeof getDocs> extends Promise<infer T> ? T : never);
    const data = await genererExport("uid-test");
    expect(data.seances).toHaveLength(1);
    const s = data.seances[0];
    expect(s.jour).toBe("lundi");
    expect(s.date).toBe("2026-04-07");
    expect(s.semaine).toBe(2);
    expect(s.qualite).toBe(8);
    expect(s.energie_avant).toBe(7);
    expect(s.energie_apres).toBe(6);
    expect(s.sommeil_h).toBe(7.5);
    expect(s.poids_corps_kg).toBe(82);
    expect(s.cardio_fait).toBe(false);
    expect(s.notes_globales).toBe("Bonne séance");
    expect(s.exercices).toHaveLength(1);
    expect(s.exercices[0].nom).toBe("Développé couché");
    expect(s.exercices[0].series).toHaveLength(2);
    expect(s.exercices[0].series[0]).toEqual({ serie: 1, poids_kg: 60, reps: 10 });
  });

  it("mappe cardio_fait et cardio_duree_min", async () => {
    const seanceDoc = makeDocSnap({
      jour: "vendredi",
      date: "2026-04-11",
      semaine: 2,
      qualite: null,
      energieAvant: null,
      energieApres: null,
      sommeil: null,
      poidsCorps: null,
      cardioFait: true,
      cardioDuree: 20,
      notes: "",
      completee: true,
      exercices: [],
    });
    mockGetDocs.mockResolvedValue(snap([seanceDoc]));
    const data = await genererExport("uid-test");
    expect(data.seances[0].cardio_fait).toBe(true);
    expect(data.seances[0].cardio_duree_min).toBe(20);
  });

  it("semaine_actuelle calculée depuis dateDebut", async () => {
    mockGetDateDebut.mockResolvedValue("2026-03-23");
    mockGetDocs.mockResolvedValue(snap([]));
    const data = await genererExport("uid-test");
    expect(typeof data.semaine_actuelle).toBe("number");
    expect(data.semaine_actuelle).toBeGreaterThanOrEqual(1);
  });

  it("semaine_actuelle vaut 1 si dateDebut est null", async () => {
    mockGetDateDebut.mockResolvedValue(null);
    mockGetDocs.mockResolvedValue(snap([]));
    const data = await genererExport("uid-test");
    expect(data.semaine_actuelle).toBe(1);
  });
});
