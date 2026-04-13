import { describe, it, expect } from "vitest";
import {
  getInitials,
  formatDate,
  timeAgo,
  STATUS_LABELS,
  STATUS_BADGE_CLASS,
  PRIORITY_LABELS,
} from "@/lib/utils";

/**
 * Tests unitaires des fonctions utilitaires pures.
 * Aucune dépendance externe, faciles à tester de manière déterministe.
 */

describe("getInitials", () => {
  it("retourne les deux premières initiales d'un nom complet", () => {
    expect(getInitials("Alice Dupont")).toBe("AD");
  });

  it("met les initiales en majuscules même si le nom est en minuscules", () => {
    expect(getInitials("alice dupont")).toBe("AD");
  });

  it("limite à 2 caractères pour les noms de plus de 2 mots", () => {
    expect(getInitials("Jean Pierre Dupont")).toBe("JP");
  });

  it("retourne une seule lettre pour un mot unique", () => {
    expect(getInitials("Alice")).toBe("A");
  });

  it("retourne ?? pour null", () => {
    expect(getInitials(null)).toBe("??");
  });

  it("retourne ?? pour undefined", () => {
    expect(getInitials(undefined)).toBe("??");
  });

  it("retourne ?? pour une chaîne vide", () => {
    expect(getInitials("")).toBe("??");
  });
});

describe("formatDate", () => {
  it("formate une date ISO en français court", () => {
    const result = formatDate("2025-04-09T12:00:00.000Z");
    // Le format dépend du locale mais doit contenir le jour et le mois
    expect(result).toMatch(/9.*avr/i);
  });

  it("retourne un tiret pour null", () => {
    expect(formatDate(null)).toBe("—");
  });

  it("retourne un tiret pour undefined", () => {
    expect(formatDate(undefined)).toBe("—");
  });
});

describe("timeAgo", () => {
  it("retourne 'à l\\'instant' pour une date toute récente", () => {
    const now = new Date().toISOString();
    expect(timeAgo(now)).toBe("à l'instant");
  });

  it("retourne les minutes pour moins d'une heure", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(timeAgo(fiveMinAgo)).toBe("il y a 5 min");
  });

  it("retourne les heures pour moins d'un jour", () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(threeHoursAgo)).toBe("il y a 3h");
  });

  it("retourne 'il y a 1 jour' pour exactement un jour", () => {
    const oneDayAgo = new Date(Date.now() - 86400 * 1000).toISOString();
    expect(timeAgo(oneDayAgo)).toBe("il y a 1 jour");
  });

  it("retourne le pluriel pour plusieurs jours", () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 86400 * 1000).toISOString();
    expect(timeAgo(fiveDaysAgo)).toBe("il y a 5 jours");
  });
});

describe("STATUS_LABELS", () => {
  it("contient tous les statuts en français", () => {
    expect(STATUS_LABELS.TODO).toBe("À faire");
    expect(STATUS_LABELS.IN_PROGRESS).toBe("En cours");
    expect(STATUS_LABELS.DONE).toBe("Terminée");
    expect(STATUS_LABELS.CANCELLED).toBe("Annulée");
  });
});

describe("STATUS_BADGE_CLASS", () => {
  it("mappe chaque statut sur sa classe CSS", () => {
    expect(STATUS_BADGE_CLASS.TODO).toBe("badge--todo");
    expect(STATUS_BADGE_CLASS.IN_PROGRESS).toBe("badge--inprogress");
    expect(STATUS_BADGE_CLASS.DONE).toBe("badge--done");
  });
});

describe("PRIORITY_LABELS", () => {
  it("contient toutes les priorités en français", () => {
    expect(PRIORITY_LABELS.LOW).toBe("Basse");
    expect(PRIORITY_LABELS.MEDIUM).toBe("Moyenne");
    expect(PRIORITY_LABELS.HIGH).toBe("Haute");
    expect(PRIORITY_LABELS.URGENT).toBe("Urgente");
  });
});
