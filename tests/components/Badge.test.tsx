import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "@/components/ui/Badge";

describe("Badge", () => {
  it("affiche le texte enfant", () => {
    render(<Badge>À faire</Badge>);
    expect(screen.getByText("À faire")).toBeInTheDocument();
  });

  it("applique la variante todo par défaut quand variant=todo", () => {
    render(<Badge variant="todo">À faire</Badge>);
    expect(screen.getByText("À faire").className).toContain("badge--todo");
  });

  it("applique la variante inprogress", () => {
    render(<Badge variant="inprogress">En cours</Badge>);
    expect(screen.getByText("En cours").className).toContain("badge--inprogress");
  });

  it("applique la variante done", () => {
    render(<Badge variant="done">Terminée</Badge>);
    expect(screen.getByText("Terminée").className).toContain("badge--done");
  });

  it("applique la variante urgent", () => {
    render(<Badge variant="urgent">Urgente</Badge>);
    expect(screen.getByText("Urgente").className).toContain("badge--priority-urgent");
  });

  it("applique la variante high", () => {
    render(<Badge variant="high">Haute</Badge>);
    expect(screen.getByText("Haute").className).toContain("badge--priority-high");
  });

  it("applique toujours la classe de base badge", () => {
    render(<Badge variant="neutral">Test</Badge>);
    expect(screen.getByText("Test").className).toContain("badge");
  });

  it("accepte une className supplémentaire", () => {
    render(<Badge className="ma-classe">Test</Badge>);
    expect(screen.getByText("Test").className).toContain("ma-classe");
  });
});
