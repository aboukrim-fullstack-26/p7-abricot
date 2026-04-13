import { describe, it, expect } from "vitest";

/**
 * Tests de la fonction toIsoDate utilisée dans app/projects/[id]/page.tsx.
 * C'est le fix du bug "Données de création de tâche invalides" :
 * le backend exige un format ISO strict (date.toISOString()), mais
 * <input type="date"> renvoie "2025-04-15" sans heure.
 *
 * On reproduit la fonction ici pour la tester en isolation
 * (elle est définie inline dans le composant page.tsx).
 */

function toIsoDate(htmlDate: string): string | undefined {
  if (!htmlDate) return undefined;
  const d = new Date(htmlDate + "T12:00:00.000Z");
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

describe("toIsoDate (fix bug ISO date)", () => {
  it("convertit une date HTML en ISO string complet", () => {
    const result = toIsoDate("2025-04-15");
    expect(result).toBe("2025-04-15T12:00:00.000Z");
  });

  it("retourne un format que la regex isValidDate du backend acceptera", () => {
    const result = toIsoDate("2025-04-15");
    // Le backend exige : dateString === date.toISOString()
    expect(result).toBe(new Date(result!).toISOString());
  });

  it("retourne undefined pour une chaîne vide", () => {
    expect(toIsoDate("")).toBeUndefined();
  });

  it("retourne undefined pour une date invalide", () => {
    expect(toIsoDate("pas-une-date")).toBeUndefined();
  });

  it("préserve la date (jour/mois/année) sans décalage de fuseau", () => {
    // Le piège classique : new Date("2025-04-15") sans heure peut décaler
    // d'un jour selon le fuseau. On utilise T12:00:00.000Z (midi UTC)
    // pour rester dans le même jour partout sur la planète.
    const result = toIsoDate("2025-04-15")!;
    expect(result.startsWith("2025-04-15")).toBe(true);
  });
});
