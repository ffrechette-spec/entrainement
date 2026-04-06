import { getSemaineActuelle, formatDate, getExercicesParJour, getJourActuel, JOURS_SEMAINE } from "@/lib/utils";

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

  it("retourne 3 après 14 jours", () => {
    const dateDebut = new Date();
    dateDebut.setDate(dateDebut.getDate() - 14);
    expect(getSemaineActuelle(dateDebut)).toBe(3);
  });

  it("retourne 8 à 50 jours (milieu semaine 8)", () => {
    const dateDebut = new Date();
    dateDebut.setDate(dateDebut.getDate() - 50);
    expect(getSemaineActuelle(dateDebut)).toBe(8);
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

  it("retourne 1 si la date est demain", () => {
    const dateDebut = new Date();
    dateDebut.setDate(dateDebut.getDate() + 1);
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

  it("retourne 6 exercices le jeudi", () => {
    expect(getExercicesParJour("jeudi").length).toBe(6);
  });

  it("retourne 5 exercices le vendredi", () => {
    expect(getExercicesParJour("vendredi").length).toBe(5);
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

describe("formatDate", () => {
  it("retourne une chaîne non vide", () => {
    const result = formatDate(new Date("2026-04-06"));
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("contient l'année", () => {
    const result = formatDate(new Date("2026-04-06"));
    expect(result).toContain("2026");
  });

  it("contient le jour du mois", () => {
    const result = formatDate(new Date("2026-04-06"));
    expect(result).toContain("6");
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

  it("JOURS_SEMAINE contient exactement 5 jours", () => {
    expect(JOURS_SEMAINE).toHaveLength(5);
  });

  it("JOURS_SEMAINE contient lundi à vendredi", () => {
    expect(JOURS_SEMAINE).toContain("lundi");
    expect(JOURS_SEMAINE).toContain("mardi");
    expect(JOURS_SEMAINE).toContain("mercredi");
    expect(JOURS_SEMAINE).toContain("jeudi");
    expect(JOURS_SEMAINE).toContain("vendredi");
  });
});
