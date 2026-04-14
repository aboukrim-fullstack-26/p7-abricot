import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Card from "@/components/ui/Card";

describe("Card", () => {
  it("affiche le contenu enfant", () => {
    render(<Card><p>Contenu de la carte</p></Card>);
    expect(screen.getByText("Contenu de la carte")).toBeInTheDocument();
  });

  it("applique le padding par défaut (padded=true)", () => {
    render(<Card data-testid="card">Contenu</Card>);
    const card = screen.getByTestId("card");
    expect(card.style.padding).toBe("18px 20px");
  });

  it("n'applique pas de padding quand padded=false", () => {
    render(<Card padded={false} data-testid="card">Contenu</Card>);
    const card = screen.getByTestId("card");
    expect(card.style.padding).toBe("");
  });

  it("applique cursor:pointer quand clickable=true", () => {
    render(<Card clickable data-testid="card">Contenu</Card>);
    expect(screen.getByTestId("card").style.cursor).toBe("pointer");
  });

  it("n'applique pas cursor:pointer par défaut", () => {
    render(<Card data-testid="card">Contenu</Card>);
    expect(screen.getByTestId("card").style.cursor).not.toBe("pointer");
  });

  it("transmet les props HTML (onClick, aria-label…)", () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick} aria-label="ma carte">Contenu</Card>);
    const card = screen.getByLabelText("ma carte");
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("accepte une className supplémentaire", () => {
    render(<Card className="task-detail-card" data-testid="card">Contenu</Card>);
    expect(screen.getByTestId("card").className).toContain("task-detail-card");
  });
});
