/** Types partagés de l'application Abricot */

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner?: Pick<User, "id" | "name" | "email">;
  members?: ProjectMember[];
  tasks?: Task[];
}

export interface ProjectMember {
  id: string;
  role: "ADMIN" | "CONTRIBUTOR";
  joinedAt: string;
  userId: string;
  projectId: string;
  user: Pick<User, "id" | "name" | "email">;
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  creatorId: string;
  project?: Pick<Project, "id" | "name" | "description">;
  creator?: Pick<User, "id" | "name" | "email">;
  assignees?: TaskAssignee[];
  comments?: Comment[];
}

export interface TaskAssignee {
  id: string;
  assignedAt: string;
  /** Le backend ne renvoie pas ce champ, il n'expose que `user` imbriqué */
  taskId?: string;
  /** Idem — utiliser `user.id` au lieu de `userId` */
  userId?: string;
  user: Pick<User, "id" | "name" | "email">;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  taskId: string;
  authorId: string;
  author: Pick<User, "id" | "name" | "email">;
}

export interface DashboardStats {
  tasks: {
    total: number;
    urgent: number;
    overdue: number;
    byStatus: Record<string, number>;
  };
  projects: {
    total: number;
  };
}

/** Réponse API standard */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: string[];
}
