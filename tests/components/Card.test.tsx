import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Card from "@/components/ui/Card";

describe("Card", () => {
  it("affiche le contenu enfant", () => {
    render(<Card><p>Contenu de la carte</p></Card>);
    expect(screen.getByText("Contenu de la carte")).toBeInTheDocument();
  });

  it("applique la classe de base card", () => {
    render(<Card data-testid="card">Contenu</Card>);
    expect(screen.getByTestId("card").className).toMatch(/card/);
  });

  it("inclut la classe padded par défaut", () => {
    render(<Card data-testid="card">Contenu</Card>);
    // padded=true par défaut → classe card--padded présente
    expect(screen.getByTestId("card").className).toMatch(/padded/);
  });

  it("n'inclut pas la classe padded quand padded=false", () => {
    render(<Card padded={false} data-testid="card">Contenu</Card>);
    expect(screen.getByTestId("card").className).not.toMatch(/padded/);
  });

  it("inclut la classe clickable quand clickable=true", () => {
    render(<Card clickable data-testid="card">Contenu</Card>);
    expect(screen.getByTestId("card").className).toMatch(/clickable/);
  });

  it("n'inclut pas la classe clickable par défaut", () => {
    render(<Card data-testid="card">Contenu</Card>);
    expect(screen.getByTestId("card").className).not.toMatch(/clickable/);
  });

  it("transmet les props HTML (onClick, aria-label…)", () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick} aria-label="ma carte">Contenu</Card>);
    const card = screen.getByLabelText("ma carte");
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
