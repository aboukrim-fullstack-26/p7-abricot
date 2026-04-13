import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "@/components/ui/Modal";

/**
 * Tests d'accessibilité de la modale :
 * - Attributs ARIA (role, aria-modal, aria-label)
 * - Fermeture par Escape
 * - Fermeture par clic sur overlay
 * - Bouton de fermeture avec aria-label
 * - Pas de rendu quand isOpen=false
 */

describe("Modal", () => {
  it("ne rend rien quand isOpen=false", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Titre">
        Contenu
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("rend le titre et le contenu quand isOpen=true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Créer un projet">
        <p>Contenu de la modale</p>
      </Modal>
    );
    expect(screen.getByText("Créer un projet")).toBeInTheDocument();
    expect(screen.getByText("Contenu de la modale")).toBeInTheDocument();
  });

  it("a les attributs ARIA pour l'accessibilité", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modale accessible">
        Contenu
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", "Modale accessible");
  });

  it("appelle onClose quand on appuie sur Escape", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        Contenu
      </Modal>
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("appelle onClose quand on clique sur l'overlay", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        Contenu
      </Modal>
    );
    const overlay = screen.getByRole("dialog");
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("n'appelle PAS onClose quand on clique à l'intérieur de la modale", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <button>Clic interne</button>
      </Modal>
    );
    fireEvent.click(screen.getByText("Clic interne"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("a un bouton de fermeture avec aria-label='Fermer'", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        Contenu
      </Modal>
    );
    const closeBtn = screen.getByLabelText("Fermer");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("affiche le footer si fourni", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test" footer={<button>Sauvegarder</button>}>
        Contenu
      </Modal>
    );
    expect(screen.getByText("Sauvegarder")).toBeInTheDocument();
  });
});
