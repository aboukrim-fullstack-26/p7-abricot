import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input, Textarea } from "@/components/ui/Input";

describe("Input", () => {
  it("affiche le label quand fourni", () => {
    render(<Input id="nom" label="Nom" />);
    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
  });

  it("ajoute * au label quand required=true", () => {
    render(<Input id="email" label="Email" required />);
    const label = screen.getByText("Email");
    expect(label.className).toContain("form-label--required");
  });

  it("relie le label à l'input via htmlFor/id", () => {
    render(<Input id="pass" label="Mot de passe" type="password" />);
    expect(screen.getByLabelText("Mot de passe")).toHaveAttribute("type", "password");
  });

  it("affiche le message d'erreur", () => {
    render(<Input id="email" label="Email" error="Email invalide" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Email invalide");
  });

  it("met aria-invalid=true quand une erreur est présente", () => {
    render(<Input id="email" label="Email" error="Erreur" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("met aria-invalid=false sans erreur", () => {
    render(<Input id="email" label="Email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "false");
  });

  it("appelle onChange avec la bonne valeur", () => {
    const onChange = vi.fn();
    render(<Input id="nom" label="Nom" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Alice" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("n'affiche pas de label si non fourni", () => {
    render(<Input id="nom" placeholder="Nom" />);
    expect(screen.queryByRole("label")).not.toBeInTheDocument();
  });
});

describe("Textarea", () => {
  it("affiche le label", () => {
    render(<Textarea id="desc" label="Description" />);
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("rend un élément textarea", () => {
    render(<Textarea id="desc" label="Description" />);
    expect(screen.getByLabelText("Description").tagName).toBe("TEXTAREA");
  });

  it("affiche le message d'erreur", () => {
    render(<Textarea id="desc" label="Description" error="Champ requis" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Champ requis");
  });

  it("ajoute * au label quand required=true", () => {
    render(<Textarea id="desc" label="Description" required />);
    expect(screen.getByText("Description").className).toContain("form-label--required");
  });
});
