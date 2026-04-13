import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * Setup global pour les tests Vitest
 * - Cleanup automatique du DOM après chaque test
 * - Mock de sessionStorage pour les tests d'authentification
 * - Mock de window.matchMedia pour les composants responsive
 */

afterEach(() => {
  cleanup();
});

// Mock sessionStorage
class StorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] ?? null; }
  setItem(key: string, value: string) { this.store[key] = String(value); }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
  get length() { return Object.keys(this.store).length; }
  key(i: number) { return Object.keys(this.store)[i] ?? null; }
}

Object.defineProperty(globalThis, "sessionStorage", {
  value: new StorageMock(),
  writable: true,
});

// Mock window.matchMedia (utile pour les media queries dans les tests)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
