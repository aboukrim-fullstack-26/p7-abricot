import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as api from "@/services/api";

/**
 * Tests unitaires du service API.
 * Mock complet de fetch pour vérifier :
 * - Les URLs appelées
 * - Les méthodes HTTP
 * - Les headers (Authorization JWT)
 * - Le parsing des réponses
 * - La gestion d'erreurs
 */

const fetchMock = vi.fn();
globalThis.fetch = fetchMock as unknown as typeof fetch;

function jsonResponse<T>(data: T, ok = true) {
  return Promise.resolve({
    ok,
    json: () => Promise.resolve({ success: ok, message: ok ? "OK" : "Erreur", data }),
  } as Response);
}

beforeEach(() => {
  fetchMock.mockReset();
  sessionStorage.clear();
});

afterEach(() => {
  sessionStorage.clear();
});

describe("Token storage", () => {
  it("setToken stocke le token en sessionStorage", () => {
    api.setToken("my-jwt-token");
    expect(sessionStorage.getItem("abricot_token")).toBe("my-jwt-token");
  });

  it("removeToken supprime le token", () => {
    api.setToken("token");
    api.removeToken();
    expect(sessionStorage.getItem("abricot_token")).toBeNull();
  });

  it("isAuthenticated retourne true si un token est présent", () => {
    api.setToken("token");
    expect(api.isAuthenticated()).toBe(true);
  });

  it("isAuthenticated retourne false sans token", () => {
    expect(api.isAuthenticated()).toBe(false);
  });
});

describe("login", () => {
  it("envoie POST /auth/login avec email + password", async () => {
    fetchMock.mockReturnValueOnce(
      jsonResponse({ user: { id: "1", email: "a@b.c", name: "Alice" }, token: "tok" })
    );
    await api.login("a@b.c", "secret");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/auth/login");
    expect(opts.method).toBe("POST");
    expect(JSON.parse(opts.body)).toEqual({ email: "a@b.c", password: "secret" });
  });

  it("stocke automatiquement le token après login", async () => {
    fetchMock.mockReturnValueOnce(
      jsonResponse({ user: { id: "1", email: "a@b.c", name: "A" }, token: "jwt-abc" })
    );
    await api.login("a@b.c", "secret");
    expect(sessionStorage.getItem("abricot_token")).toBe("jwt-abc");
  });

  it("lance une erreur si le backend renvoie une erreur", async () => {
    fetchMock.mockReturnValueOnce(
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ success: false, message: "Identifiants invalides" }),
      } as Response)
    );
    await expect(api.login("a@b.c", "wrong")).rejects.toThrow("Identifiants invalides");
  });
});

describe("registerUser", () => {
  it("envoie POST /auth/register avec les credentials", async () => {
    fetchMock.mockReturnValueOnce(
      jsonResponse({ user: { id: "1", email: "a@b.c", name: "Alice" }, token: "tok" })
    );
    await api.registerUser("a@b.c", "secret123", "Alice");
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/auth/register");
    expect(JSON.parse(opts.body)).toEqual({ email: "a@b.c", password: "secret123", name: "Alice" });
  });
});

describe("requestPasswordReset", () => {
  it("envoie POST /auth/forgot-password avec l'email", async () => {
    fetchMock.mockReturnValueOnce(jsonResponse({}));
    await api.requestPasswordReset("a@b.c");
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/auth/forgot-password");
    expect(opts.method).toBe("POST");
    expect(JSON.parse(opts.body)).toEqual({ email: "a@b.c" });
  });
});

describe("resetPassword", () => {
  it("envoie POST /auth/reset-password avec token + nouveau MDP", async () => {
    fetchMock.mockReturnValueOnce(jsonResponse({}));
    await api.resetPassword("reset-token", "newpass");
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/auth/reset-password");
    expect(JSON.parse(opts.body)).toEqual({ token: "reset-token", newPassword: "newpass" });
  });
});

describe("getProjects (avec auth)", () => {
  it("ajoute le header Authorization quand un token existe", async () => {
    api.setToken("my-token");
    fetchMock.mockReturnValueOnce(jsonResponse({ projects: [] }));
    await api.getProjects();
    const [, opts] = fetchMock.mock.calls[0];
    expect(opts.headers["Authorization"]).toBe("Bearer my-token");
  });

  it("n'ajoute pas Authorization sans token", async () => {
    fetchMock.mockReturnValueOnce(jsonResponse({ projects: [] }));
    await api.getProjects();
    const [, opts] = fetchMock.mock.calls[0];
    expect(opts.headers["Authorization"]).toBeUndefined();
  });
});

describe("createTask", () => {
  it("envoie POST sur /projects/:id/tasks avec le bon body", async () => {
    api.setToken("tok");
    fetchMock.mockReturnValueOnce(
      jsonResponse({ task: { id: "t1", title: "Test" } })
    );
    await api.createTask("proj-1", {
      title: "Authentification JWT",
      description: "Implémenter le système",
      dueDate: "2025-04-09T12:00:00.000Z",
      status: "TODO",
      priority: "HIGH",
      assigneeIds: ["u1", "u2"],
    });
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/projects/proj-1/tasks");
    expect(opts.method).toBe("POST");
    const body = JSON.parse(opts.body);
    expect(body.title).toBe("Authentification JWT");
    expect(body.dueDate).toBe("2025-04-09T12:00:00.000Z");
    expect(body.assigneeIds).toEqual(["u1", "u2"]);
  });
});

describe("deleteTask", () => {
  it("envoie DELETE sur /projects/:id/tasks/:taskId", async () => {
    api.setToken("tok");
    fetchMock.mockReturnValueOnce(jsonResponse({}));
    await api.deleteTask("proj-1", "task-99");
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/projects/proj-1/tasks/task-99");
    expect(opts.method).toBe("DELETE");
  });
});
