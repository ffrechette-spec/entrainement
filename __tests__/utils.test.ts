import { getSemaineActuelle, getExercicesParJour, getJourActuel, JOURS_SEMAINE } from "@/lib/utils";

describe("getSemaineActuelle", () => {
  it("retourne 1 le jour du début", () => {
    const dateDebut = new Date();
    expect(getSemaineActuelle(dateDebut)).toBe(1);
  });

  it("retourne 2 après 7 jours", () => {
    const dateDebut = new Date();
    dateDebut.setDate(dateDebut.getDate() - 7);
    expect(getSemaineActuelle(dateDebut)).toBe(2);
  });

  it("retourne 4 après 21 jours", () => {
    const dateDebut = new Date();
    dateDebut.setDate(dateDebut.getDate() - 21);
    expect(getSemaineActuelle(dateDebut)).toBe(4);
  });

  it("plafonne à 8 semaines maximum", () => {
    const dateDebut = new Date();
    dateDebut.setDate(dateDebut.getDate() - 70);
    expect(getSemaineActuelle(dateDebut)).toBe(8);
  });

  it("retourne 1 minimum même si la date est dans le futur", () => {
    const dateDebut = new Date();
    dateDebut.setDate(dateDebut.getDate() + 7);
    expect(getSemaineActuelle(dateDebut)).toBe(1);
  });
});

describe("getExercicesParJour", () => {
  it("retourne des exercices pour chaque jour de la semaine", () => {
    for (const jour of JOURS_SEMAINE) {
      const exercices = getExercicesParJour(jour);
      expect(exercices.length).toBeGreaterThan(0);
    }
  });

  it("retourne uniquement les exercices du jour demandé", () => {
    for (const jour of JOURS_SEMAINE) {
      const exercices = getExercicesParJour(jour);
      for (const ex of exercices) {
        expect(ex.jour).toBe(jour);
      }
    }
  });

  it("retourne 5 exercices le lundi", () => {
    expect(getExercicesParJour("lundi").length).toBe(5);
  });

  it("retourne 5 exercices le mardi", () => {
    expect(getExercicesParJour("mardi").length).toBe(5);
  });

  it("retourne 5 exercices le mercredi", () => {
    expect(getExercicesParJour("mercredi").length).toBe(5);
  });

  it("retourne 5 exercices le jeudi", () => {
    expect(getExercicesParJour("jeudi").length).toBe(5);
  });

  it("retourne 4 exercices le vendredi", () => {
    expect(getExercicesParJour("vendredi").length).toBe(4);
  });

  it("chaque exercice a un id en kebab-case", () => {
    for (const jour of JOURS_SEMAINE) {
      for (const ex of getExercicesParJour(jour)) {
        expect(ex.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      }
    }
  });

  it("chaque exercice a seriesCount > 0", () => {
    for (const jour of JOURS_SEMAINE) {
      for (const ex of getExercicesParJour(jour)) {
        expect(ex.seriesCount).toBeGreaterThan(0);
      }
    }
  });
});

describe("getJourActuel", () => {
  it("retourne null le week-end ou un JourSemaine en semaine", () => {
    const result = getJourActuel();
    const jour = new Date().getDay();
    if (jour === 0 || jour === 6) {
      expect(result).toBeNull();
    } else {
      expect(JOURS_SEMAINE).toContain(result);
    }
  });
});
