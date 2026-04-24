/**
 * Service API — communications avec le backend Abricot
 */
import type {
  ApiResponse, User, Project, Task, Comment, DashboardStats,
  TaskStatus, TaskPriority,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("abricot_token");
}
export function setToken(token: string): void { sessionStorage.setItem("abricot_token", token); }
export function removeToken(): void { sessionStorage.removeItem("abricot_token"); }
export function isAuthenticated(): boolean { return !!getToken(); }

function authHeaders(): Record<string, string> {
  const token = getToken();
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers as Record<string, string>) },
  });
  const json: ApiResponse<T> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Erreur inconnue");
  return json;
}

// Auth
export async function login(email: string, password: string) {
  const res = await request<{ user: User; token: string }>("/auth/login", {
    method: "POST", body: JSON.stringify({ email, password }),
  });
  if (res.data?.token) setToken(res.data.token);
  return res.data!;
}

export async function registerUser(email: string, password: string, name?: string) {
  const res = await request<{ user: User; token: string }>("/auth/register", {
    method: "POST", body: JSON.stringify({ email, password, name }),
  });
  if (res.data?.token) setToken(res.data.token);
  return res.data!;
}

export async function getProfile() {
  const res = await request<{ user: User }>("/auth/profile");
  return res.data!.user;
}

export async function updateProfile(data: { name?: string; email?: string }) {
  const res = await request<{ user: User }>("/auth/profile", {
    method: "PUT", body: JSON.stringify(data),
  });
  return res.data!.user;
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  await request("/auth/password", {
    method: "PUT", body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function requestPasswordReset(email: string) {
  await request("/auth/forgot-password", {
    method: "POST", body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  await request("/auth/reset-password", {
    method: "POST", body: JSON.stringify({ token, newPassword }),
  });
}

// Projects
export async function getProjects() {
  const res = await request<{ projects: Project[] }>("/projects");
  return res.data!.projects;
}

export async function getProject(id: string) {
  const res = await request<{ project: Project }>(`/projects/${id}`);
  return res.data!.project;
}

export async function createProject(data: { name: string; description?: string; contributors?: string[] }) {
  const res = await request<{ project: Project }>("/projects", {
    method: "POST", body: JSON.stringify(data),
  });
  return res.data!.project;
}

export async function updateProject(id: string, data: { name?: string; description?: string }) {
  const res = await request<{ project: Project }>(`/projects/${id}`, {
    method: "PUT", body: JSON.stringify(data),
  });
  return res.data!.project;
}

export async function deleteProject(id: string) {
  await request(`/projects/${id}`, { method: "DELETE" });
}

export async function addContributor(projectId: string, email: string, role?: "ADMIN" | "CONTRIBUTOR") {
  return await request(`/projects/${projectId}/contributors`, {
    method: "POST", body: JSON.stringify({ email, role }),
  });
}

export async function removeContributor(projectId: string, userId: string) {
  await request(`/projects/${projectId}/contributors/${userId}`, { method: "DELETE" });
}

// Tasks
export async function getTasks(projectId: string) {
  const res = await request<{ tasks: Task[] }>(`/projects/${projectId}/tasks`);
  return res.data!.tasks;
}

export async function createTask(projectId: string, data: {
  title: string; description?: string; priority?: TaskPriority;
  dueDate?: string; status?: TaskStatus; assigneeIds?: string[];
}) {
  const res = await request<{ task: Task }>(`/projects/${projectId}/tasks`, {
    method: "POST", body: JSON.stringify(data),
  });
  return res.data!.task;
}

export async function updateTask(projectId: string, taskId: string, data: {
  title?: string; description?: string; status?: TaskStatus;
  priority?: TaskPriority; dueDate?: string; assigneeIds?: string[];
}) {
  const res = await request<{ task: Task }>(`/projects/${projectId}/tasks/${taskId}`, {
    method: "PUT", body: JSON.stringify(data),
  });
  return res.data!.task;
}

export async function deleteTask(projectId: string, taskId: string) {
  await request(`/projects/${projectId}/tasks/${taskId}`, { method: "DELETE" });
}

// Comments
export async function createComment(projectId: string, taskId: string, content: string) {
  const res = await request<{ comment: Comment }>(`/projects/${projectId}/tasks/${taskId}/comments`, {
    method: "POST", body: JSON.stringify({ content }),
  });
  return res.data!.comment;
}

export async function deleteComment(projectId: string, taskId: string, commentId: string) {
  await request(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, { method: "DELETE" });
}

// Dashboard
export async function getAssignedTasks() {
  const res = await request<{ tasks: Task[] }>("/dashboard/assigned-tasks");
  return res.data!.tasks;
}

export async function getProjectsWithTasks() {
  const res = await request<{ projects: Project[] }>("/dashboard/projects-with-tasks");
  return res.data!.projects;
}

export async function getDashboardStats() {
  const res = await request<{ stats: DashboardStats }>("/dashboard/stats");
  return res.data!.stats;
}

// Users search
export async function searchUsers(query: string) {
  //const res = await request<{ users: User[] }>(`/users/search?q=${encodeURIComponent(query)}`);
  //Le backend reçoit bien la requête, mais req.query.query est undefined (puisque le front a envoyé ?q=...), donc il tombe dans la branche d'erreur L732-735 et répond 400.
  const res = await request<{ users: User[] }>(`/users/search?query=${encodeURIComponent(query)}`);
  return res.data!.users;
}
