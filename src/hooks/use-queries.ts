import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  getProject,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  createComment,
  deleteComment,
  getAssignedTasks,
  getProjectsWithTasks,
  addContributor,
  removeContributor,
  createProject,
  updateProject,
  deleteProject,
} from "@/services/api";
import type { TaskStatus, TaskPriority } from "@/types";

/* ─── Query Keys ────────────────────────────────────── */
export const queryKeys = {
  projects: ["projects"] as const,
  project: (id: string) => ["projects", id] as const,
  tasks: (projectId: string) => ["projects", projectId, "tasks"] as const,
  assignedTasks: ["dashboard", "assigned-tasks"] as const,
  projectsWithTasks: ["dashboard", "projects-with-tasks"] as const,
};

/* ─── Projects ──────────────────────────────────────── */
export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: getProjects,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => getProject(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) => createProject(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects });
      qc.invalidateQueries({ queryKey: queryKeys.projectsWithTasks });
    },
  });
}

export function useUpdateProject(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; description?: string }) =>
      updateProject(projectId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.project(projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

/* ─── Contributors ──────────────────────────────────── */
export function useAddContributor(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, role }: { email: string; role?: "ADMIN" | "CONTRIBUTOR" }) =>
      addContributor(projectId, email, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
}

export function useRemoveContributor(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => removeContributor(projectId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
}

/* ─── Tasks ─────────────────────────────────────────── */
export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: queryKeys.tasks(projectId),
    queryFn: () => getTasks(projectId),
    enabled: !!projectId,
  });
}

export function useCreateTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      priority?: TaskPriority;
      dueDate?: string;
      status?: TaskStatus;
      assigneeIds?: string[];
    }) => createTask(projectId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks(projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
}

export function useUpdateTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: {
        title?: string;
        description?: string;
        status?: TaskStatus;
        priority?: TaskPriority;
        dueDate?: string;
        assigneeIds?: string[];
      };
    }) => updateTask(projectId, taskId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks(projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
}

export function useDeleteTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(projectId, taskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks(projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
}

/* ─── Comments ──────────────────────────────────────── */
export function useAddComment(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, content }: { taskId: string; content: string }) =>
      createComment(projectId, taskId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks(projectId) });
    },
  });
}

export function useDeleteComment(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, commentId }: { taskId: string; commentId: string }) =>
      deleteComment(projectId, taskId, commentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks(projectId) });
    },
  });
}

/* ─── Dashboard ─────────────────────────────────────── */
export function useAssignedTasks() {
  return useQuery({
    queryKey: queryKeys.assignedTasks,
    queryFn: getAssignedTasks,
  });
}

export function useProjectsWithTasks() {
  return useQuery({
    queryKey: queryKeys.projectsWithTasks,
    queryFn: getProjectsWithTasks,
  });
}
