import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/ui/Button";

describe("Button", () => {
  it("affiche le texte enfant", () => {
    render(<Button>Enregistrer</Button>);
    expect(screen.getByText("Enregistrer")).toBeInTheDocument();
  });

  it("est cliquable et appelle onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Cliquer</Button>);
    fireEvent.click(screen.getByText("Cliquer"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("est désactivé quand disabled=true", () => {
    render(<Button disabled>Désactivé</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("affiche '...' et est désactivé quand loading=true", () => {
    render(<Button loading>Enregistrer</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn.textContent).toBe("...");
  });

  it("n'appelle pas onClick quand disabled", () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Test</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applique la variante primary par défaut", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button").className).toContain("btn--primary");
  });

  it("applique la variante outline", () => {
    render(<Button variant="outline">Test</Button>);
    expect(screen.getByRole("button").className).toContain("btn--outline");
  });

  it("affiche l'icône quand fournie", () => {
    render(<Button icon={<span data-testid="icon">★</span>}>Avec icône</Button>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("Avec icône")).toBeInTheDocument();
  });

  it("n'affiche pas l'icône quand loading=true", () => {
    render(<Button loading icon={<span data-testid="icon">★</span>}>Texte</Button>);
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
  });
});
