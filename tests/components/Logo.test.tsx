import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Logo from "@/components/layout/Logo";

/**
 * Mock minimal de next/image — Vitest n'embarque pas Next.js
 * donc on remplace par un simple <img> qui forwarde les props.
 */
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // Strip Next.js-specific props that React doesn't recognize on plain <img>
    const { priority: _priority, ...rest } = props;
    void _priority;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

describe("Logo", () => {
  it("affiche le logo top par défaut avec alt 'Abricot'", () => {
    render(<Logo />);
    const img = screen.getByAltText("Abricot");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/icons/logo-top.svg");
  });

  it("affiche le logo bottom quand variant='bottom'", () => {
    render(<Logo variant="bottom" />);
    const img = screen.getByAltText("Abricot");
    expect(img).toHaveAttribute("src", "/icons/logo-bottom.svg");
  });

  it("calcule la hauteur selon le ratio natif (top: 147/19)", () => {
    render(<Logo variant="top" width={147} />);
    const img = screen.getByAltText("Abricot");
    // 147 / (147/19) = 19
    expect(img).toHaveAttribute("height", "19");
    expect(img).toHaveAttribute("width", "147");
  });

  it("calcule la hauteur selon le ratio natif (bottom: 101/13)", () => {
    render(<Logo variant="bottom" width={101} />);
    const img = screen.getByAltText("Abricot");
    expect(img).toHaveAttribute("height", "13");
  });

  it("met une largeur custom quand width est passé", () => {
    render(<Logo width={300} />);
    const img = screen.getByAltText("Abricot");
    expect(img).toHaveAttribute("width", "300");
  });
});
