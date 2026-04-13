import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ToastProvider, useToast } from "@/components/ui/Toast";

/**
 * Tests du système de notifications.
 * Vérifie le hook useToast, les types success/error et l'auto-fermeture.
 */

function TestComponent({ message, type }: { message: string; type?: "success" | "error" }) {
  const { showToast } = useToast();
  return (
    <button onClick={() => showToast(message, type)}>Show</button>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ToastProvider", () => {
  it("affiche un toast success quand showToast est appelé", () => {
    render(
      <ToastProvider>
        <TestComponent message="Tâche créée" />
      </ToastProvider>
    );
    act(() => {
      screen.getByText("Show").click();
    });
    expect(screen.getByText("Tâche créée")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("toast--success");
  });

  it("affiche un toast error avec la bonne classe", () => {
    render(
      <ToastProvider>
        <TestComponent message="Erreur réseau" type="error" />
      </ToastProvider>
    );
    act(() => {
      screen.getByText("Show").click();
    });
    expect(screen.getByText("Erreur réseau")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("toast--error");
  });

  it("a un role='alert' et aria-live='polite' pour l'accessibilité", () => {
    render(
      <ToastProvider>
        <TestComponent message="Test" />
      </ToastProvider>
    );
    act(() => {
      screen.getByText("Show").click();
    });
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "polite");
  });

  it("ferme automatiquement le toast après 3 secondes", () => {
    render(
      <ToastProvider>
        <TestComponent message="Auto-close" />
      </ToastProvider>
    );
    act(() => {
      screen.getByText("Show").click();
    });
    expect(screen.getByText("Auto-close")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByText("Auto-close")).not.toBeInTheDocument();
  });
});
