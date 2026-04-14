import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import UserSearch from "@/components/ui/UserSearch";

vi.mock("@/services/api", () => ({
  searchUsers: vi.fn(),
}));
import * as api from "@/services/api";

const mockUsers = [
  { id: "1", email: "alice@test.com", name: "Alice Dupont", createdAt: "2024-01-01" },
  { id: "2", email: "bob@test.com",   name: "Bob Martin",   createdAt: "2024-01-01" },
];

beforeEach(() => {
  vi.clearAllMocks();
});

/**
 * Tape dans le champ et attend que la recherche se déclenche.
 * On passe debounceMs={0} au composant donc pas de fake timers.
 */
async function typeAndSearch(value: string) {
  await act(async () => {
    fireEvent.change(screen.getByRole("combobox"), { target: { value } });
  });
  // flush le setTimeout(0) du debounce
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
}

describe("UserSearch", () => {
  it("affiche le label quand fourni", () => {
    render(<UserSearch onSelect={vi.fn()} label="Chercher un utilisateur" debounceMs={0} />);
    expect(screen.getByText("Chercher un utilisateur")).toBeInTheDocument();
  });

  it("affiche le placeholder par défaut", () => {
    render(<UserSearch onSelect={vi.fn()} debounceMs={0} />);
    expect(screen.getByPlaceholderText("Rechercher par nom ou email…")).toBeInTheDocument();
  });

  it("accepte un placeholder personnalisé", () => {
    render(<UserSearch onSelect={vi.fn()} placeholder="Entrer un nom…" debounceMs={0} />);
    expect(screen.getByPlaceholderText("Entrer un nom…")).toBeInTheDocument();
  });

  it("ne lance pas de recherche si moins de 2 caractères", async () => {
    render(<UserSearch onSelect={vi.fn()} debounceMs={0} />);
    await typeAndSearch("a");
    expect(api.searchUsers).not.toHaveBeenCalled();
  });

  it("lance la recherche avec 2+ caractères", async () => {
    vi.mocked(api.searchUsers).mockResolvedValue(mockUsers);
    render(<UserSearch onSelect={vi.fn()} debounceMs={0} />);
    await typeAndSearch("ali");
    expect(api.searchUsers).toHaveBeenCalledWith("ali");
  });

  it("affiche les résultats de recherche", async () => {
    vi.mocked(api.searchUsers).mockResolvedValue(mockUsers);
    render(<UserSearch onSelect={vi.fn()} debounceMs={0} />);
    await typeAndSearch("ali");
    await waitFor(() => expect(screen.getByText("Alice Dupont")).toBeInTheDocument());
    expect(screen.getByText("alice@test.com")).toBeInTheDocument();
  });

  it("exclut les utilisateurs dont l'id est dans excludeIds", async () => {
    vi.mocked(api.searchUsers).mockResolvedValue(mockUsers);
    render(<UserSearch onSelect={vi.fn()} excludeIds={["1"]} debounceMs={0} />);
    await typeAndSearch("ali");
    await waitFor(() => expect(screen.getByText("Bob Martin")).toBeInTheDocument());
    expect(screen.queryByText("Alice Dupont")).not.toBeInTheDocument();
  });

  it("appelle onSelect avec l'utilisateur cliqué", async () => {
    vi.mocked(api.searchUsers).mockResolvedValue(mockUsers);
    const onSelect = vi.fn();
    render(<UserSearch onSelect={onSelect} debounceMs={0} />);
    await typeAndSearch("ali");
    await waitFor(() => screen.getByText("Alice Dupont"));
    fireEvent.click(screen.getByText("Alice Dupont"));
    expect(onSelect).toHaveBeenCalledWith(mockUsers[0]);
  });

  it("vide le champ après sélection", async () => {
    vi.mocked(api.searchUsers).mockResolvedValue(mockUsers);
    render(<UserSearch onSelect={vi.fn()} debounceMs={0} />);
    const input = screen.getByRole("combobox");
    await typeAndSearch("ali");
    await waitFor(() => screen.getByText("Alice Dupont"));
    await act(async () => { fireEvent.click(screen.getByText("Alice Dupont")); });
    expect(input).toHaveValue("");
  });

  it("ferme la liste sur Escape", async () => {
    vi.mocked(api.searchUsers).mockResolvedValue(mockUsers);
    render(<UserSearch onSelect={vi.fn()} debounceMs={0} />);
    await typeAndSearch("ali");
    await waitFor(() => screen.getByText("Alice Dupont"));
    await act(async () => {
      fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });
    });
    expect(screen.queryByText("Alice Dupont")).not.toBeInTheDocument();
  });

  it("affiche 'Aucun utilisateur trouvé' quand la recherche est vide", async () => {
    vi.mocked(api.searchUsers).mockResolvedValue([]);
    render(<UserSearch onSelect={vi.fn()} debounceMs={0} />);
    await typeAndSearch("xyz");
    await waitFor(() => expect(screen.getByText("Aucun utilisateur trouvé")).toBeInTheDocument());
  });
});
