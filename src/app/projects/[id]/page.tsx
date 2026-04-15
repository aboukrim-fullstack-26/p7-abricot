"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import CalendarView from "@/components/tasks/CalendarView";
import TaskCard from "@/components/tasks/TaskCard";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import AiCreateTaskModal from "@/components/tasks/AiCreateTaskModal";
import EditProjectModal from "@/components/projects/EditProjectModal";
import AddContributorModal from "@/components/projects/AddContributorModal";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/auth-context";
import {
  useProject, useProjectTasks, useDeleteProject,
  useDeleteTask, useAddComment, useDeleteComment, useRemoveContributor,
} from "@/hooks/use-queries";
import { STATUS_LABELS, getInitials } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types";
import styles from "./page.module.css";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: tasks = [], isLoading: tasksLoading } = useProjectTasks(projectId);
  const deleteProject = useDeleteProject();
  const deleteTask = useDeleteTask(projectId);
  const addComment = useAddComment(projectId);
  const deleteComment = useDeleteComment(projectId);
  const removeContributor = useRemoveContributor(projectId);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [taskView, setTaskView] = useState<"list" | "calendar">("list");
  const [showEditProject, setShowEditProject] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddContrib, setShowAddContrib] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const isOwner = project?.ownerId === user?.id;
  const isAdmin = isOwner || project?.members?.some((m) => m.userId === user?.id && m.role === "ADMIN");

  const filtered = tasks.filter((t) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  async function handleDeleteProject() {
    if (!confirm("Supprimer ce projet et toutes ses tâches ?")) return;
    try { await deleteProject.mutateAsync(projectId); showToast("Projet supprimé"); router.push("/projects"); }
    catch (e: unknown) { showToast(e instanceof Error ? e.message : "Erreur", "error"); }
  }

  async function handleDeleteTask(taskId: string) {
    if (!confirm("Supprimer cette tâche ?")) return;
    try { await deleteTask.mutateAsync(taskId); showToast("Tâche supprimée"); }
    catch (e: unknown) { showToast(e instanceof Error ? e.message : "Erreur", "error"); }
  }

  async function handleAddComment(taskId: string, text: string) {
    try { await addComment.mutateAsync({ taskId, content: text }); }
    catch (e: unknown) { showToast(e instanceof Error ? e.message : "Erreur", "error"); }
  }

  async function handleDeleteComment(taskId: string, commentId: string) {
    try { await deleteComment.mutateAsync({ taskId, commentId }); }
    catch (e: unknown) { showToast(e instanceof Error ? e.message : "Erreur", "error"); }
  }

  async function handleRemoveContributor(userId: string, name: string) {
    if (!confirm(`Retirer ${name} du projet ?`)) return;
    try { await removeContributor.mutateAsync(userId); showToast("Contributeur retiré"); }
    catch (e: unknown) { showToast(e instanceof Error ? e.message : "Erreur", "error"); }
  }

  if (authLoading || projectLoading || tasksLoading) {
    return (
      <>
        <Header />
        <div className={`spinner ${styles.spinnerWrapper}`} />
      </>
    );
  }
  if (!project || !user) {
    return (
      <>
        <Header />
        <main className="main-content" id="main-content"><p>Projet introuvable</p></main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main-content" id="main-content">
        <div className="project-detail__header">
          <Link href="/projects" className="btn-back" aria-label="Retour aux projets">
            <svg viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <div className="project-detail__title-block">
            <div className="project-detail__title-row">
              <h1 className="project-detail__title">{project.name}</h1>
              {isAdmin && (
                <button className="project-detail__edit-link" onClick={() => setShowEditProject(true)}>
                  Modifier
                </button>
              )}
            </div>
            {project.description && <p className="project-detail__subtitle">{project.description}</p>}
          </div>
          <div className="project-detail__actions">
            <Button variant="primary" onClick={() => setShowCreateTask(true)}>Créer une tâche</Button>
            <Button
              variant="ia"
              onClick={() => setShowAI(true)}
              icon={<svg viewBox="0 0 14 14" fill="none" width="14" height="14" aria-hidden="true"><path d="M7 1l1.5 3.5L12 6l-3.5 1.5L7 11l-1.5-3.5L2 6l3.5-1.5L7 1z" fill="currentColor"/></svg>}
            >
              IA
            </Button>
            {isOwner && (
              <Button variant="danger" onClick={handleDeleteProject}>Supprimer</Button>
            )}
          </div>
        </div>

        <div className="contributors-bar">
          <span className="contributors-bar__label">
            Contributeurs <strong>{(project.members?.length || 0) + 1} personne(s)</strong>
          </span>
          <div className="contributors-bar__members">
            {project.owner && (
              <>
                <span className="avatar avatar--sm avatar--orange">{getInitials(project.owner.name)}</span>
                <span className="chip chip--owner">Propriétaire</span>
              </>
            )}
            {project.members?.map((m) => (
              <span key={m.id} className={styles.contributorItem}>
                <span className="avatar avatar--sm avatar--gray">{getInitials(m.user.name)}</span>
                <span className="chip">{m.user.name || m.user.email}</span>
                {isAdmin && (
                  <button
                    onClick={() => handleRemoveContributor(m.userId, m.user.name || m.user.email)}
                    className={styles.removeContributorBtn}
                    aria-label={`Retirer ${m.user.name || m.user.email}`}
                  >
                    ✕
                  </button>
                )}
              </span>
            ))}
            {isAdmin && (
              <button
                className={`chip ${styles.addContributorBtn}`}
                onClick={() => setShowAddContrib(true)}
              >
                + Ajouter
              </button>
            )}
          </div>
        </div>

        <div className="project-tasks">
          <div className="project-tasks__header">
            <div className="project-tasks__title-block">
              <h2 className="project-tasks__title">Tâches</h2>
              <p className="project-tasks__subtitle">{filtered.length} tâche(s)</p>
            </div>
            <div className="project-tasks__toolbar">
              <div className="tab-bar">
                <button
                  className={`tab-bar__item ${taskView === "list" ? "tab-bar__item--active" : ""}`}
                  onClick={() => setTaskView("list")}
                >
                  <svg viewBox="0 0 14 14" fill="none" width="13" height="13" aria-hidden="true"><rect x="1" y="2" width="12" height="1.5" rx="0.75" fill="currentColor"/><rect x="1" y="6.25" width="12" height="1.5" rx="0.75" fill="currentColor"/><rect x="1" y="10.5" width="12" height="1.5" rx="0.75" fill="currentColor"/></svg>
                  Liste
                </button>
                <button
                  className={`tab-bar__item ${taskView === "calendar" ? "tab-bar__item--active" : ""}`}
                  onClick={() => setTaskView("calendar")}
                >
                  <svg viewBox="0 0 14 14" fill="none" width="13" height="13" aria-hidden="true"><rect x="1.5" y="2" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4.5 1v2M9.5 1v2M1.5 5.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  Calendrier
                </button>
              </div>
              {taskView === "list" && (
                <>
                  <div className="tab-bar">
                    {(["ALL", "TODO", "IN_PROGRESS", "DONE"] as const).map((s) => (
                      <button
                        key={s}
                        className={`tab-bar__item ${statusFilter === s ? "tab-bar__item--active" : ""}`}
                        onClick={() => setStatusFilter(s)}
                      >
                        {s === "ALL" ? "Tout" : STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                  <div className="search-field">
                    <input
                      type="text"
                      className="search-field__input"
                      placeholder="Rechercher une tâche"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      aria-label="Rechercher"
                    />
                    <span className="search-field__icon" aria-hidden="true">
                      <svg viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {taskView === "calendar" && (
            <CalendarView tasks={tasks} onTaskClick={(t) => { setEditingTask(t); setShowEditTask(true); }} />
          )}

          {taskView === "list" && (
            <div className="project-tasks__list">
              {filtered.length === 0 && (
                <p className={styles.emptyTasks}>Aucune tâche</p>
              )}
              {filtered.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  currentUser={user}
                  onEdit={(t) => { setEditingTask(t); setShowEditTask(true); }}
                  onDelete={handleDeleteTask}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <EditProjectModal isOpen={showEditProject} onClose={() => setShowEditProject(false)} project={project} />
      <CreateTaskModal isOpen={showCreateTask} onClose={() => setShowCreateTask(false)} projectId={projectId} members={project.members || []} />
      <EditTaskModal isOpen={showEditTask} onClose={() => { setShowEditTask(false); setEditingTask(null); }} task={editingTask} projectId={projectId} members={project.members || []} />
      <AddContributorModal isOpen={showAddContrib} onClose={() => setShowAddContrib(false)} project={project} />
      <AiCreateTaskModal isOpen={showAI} onClose={() => setShowAI(false)} projectId={projectId} projectName={project.name} />
    </>
  );
}
