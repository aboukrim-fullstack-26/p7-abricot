"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import { useAuth } from "@/context/auth-context";
import { useAssignedTasks, useProjectsWithTasks } from "@/hooks/use-queries";
import { formatDate, STATUS_LABELS, STATUS_BADGE_CLASS } from "@/lib/utils";
import styles from "./page.module.css";

type ViewMode = "kanban" | "list" | "projects";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [view, setView] = useState<ViewMode>("kanban");
  const [search, setSearch] = useState("");
  const [showCreateProject, setShowCreateProject] = useState(false);

  const { data: tasks = [], isLoading: tasksLoading } = useAssignedTasks();
  const { data: projects = [], isLoading: projectsLoading } = useProjectsWithTasks();

  const loading = tasksLoading || projectsLoading;

  const filteredTasks = tasks.filter((t) =>
    !search || t.title.toLowerCase().includes(search.toLowerCase())
  );
  const todoTasks = filteredTasks.filter((t) => t.status === "TODO");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = filteredTasks.filter((t) => t.status === "DONE");

  if (authLoading) return <div className="spinner" />;
  if (!user) return null;

  return (
    <>
      <Header />
      <main className="main-content" id="main-content">
        <div className="page-header">
          <div className="page-header__left">
            <h1 className="page-header__title">Tableau de bord</h1>
            <p className="page-header__subtitle">
              Bonjour {user.name || user.email}, voici un aperçu de vos projets et tâches
            </p>
          </div>
          <div className="page-header__actions">
            <button className="btn btn--primary btn--icon" onClick={() => setShowCreateProject(true)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Créer un projet
            </button>
          </div>
        </div>

        <div className="view-toggle" role="tablist" aria-label="Choisir la vue">
          {(["list", "kanban", "projects"] as ViewMode[]).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              className={`view-toggle__btn ${view === v ? "view-toggle__btn--active" : ""}`}
              onClick={() => setView(v)}
            >
              {v === "list" && <svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="1" y="2" width="12" height="1.5" rx="0.75" fill="currentColor"/><rect x="1" y="6.25" width="12" height="1.5" rx="0.75" fill="currentColor"/><rect x="1" y="10.5" width="12" height="1.5" rx="0.75" fill="currentColor"/></svg>}
              {v === "kanban" && <svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="1" y="1" width="3.5" height="12" rx="1" fill="currentColor"/><rect x="5.25" y="1" width="3.5" height="8" rx="1" fill="currentColor"/><rect x="9.5" y="1" width="3.5" height="10" rx="1" fill="currentColor"/></svg>}
              {v === "projects" && <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 4a1 1 0 011-1h4l1.5 2H14a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>}
              {v === "list" ? "Liste" : v === "kanban" ? "Kanban" : "Projets"}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {view === "kanban" && (
              <div className="kanban-board" role="tabpanel">
                {[
                  { label: "À faire", items: todoTasks, cls: "badge--todo" },
                  { label: "En cours", items: inProgressTasks, cls: "badge--inprogress" },
                  { label: "Terminées", items: doneTasks, cls: "badge--done" },
                ].map((col) => (
                  <div className="kanban-column" key={col.label}>
                    <div className="kanban-column__header">
                      <span className="kanban-column__title">{col.label}</span>
                      <span className="kanban-column__count">{col.items.length}</span>
                    </div>
                    <div className="kanban-column__cards">
                      {col.items.length === 0 && (
                        <p className={styles.emptyColumn}>Aucune tâche</p>
                      )}
                      {col.items.map((task) => (
                        <div className="task-card" key={task.id}>
                          <div className="task-card__header">
                            <span className="task-card__title">{task.title}</span>
                            <span className={`badge ${STATUS_BADGE_CLASS[task.status]}`}>{STATUS_LABELS[task.status]}</span>
                          </div>
                          {task.description && <p className="task-card__desc">{task.description}</p>}
                          <div className="task-card__meta">
                            {task.project && (
                              <span className="task-card__meta-item">
                                <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M1 3a1 1 0 011-1h2.5l1 1.5H10a1 1 0 011 1v5a1 1 0 01-1 1H2a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                                {task.project.name}
                              </span>
                            )}
                            {task.dueDate && (
                              <span className="task-card__meta-item">
                                <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><rect x="1.5" y="2" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M4 1v2M8 1v2M1.5 5h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                                {formatDate(task.dueDate)}
                              </span>
                            )}
                            {task.comments && task.comments.length > 0 && (
                              <span className="task-card__meta-item">
                                <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M10.5 6c0 2.485-2.015 4.5-4.5 4.5a4.48 4.48 0 01-2.25-.606L1.5 10.5l.606-2.25A4.48 4.48 0 011.5 6C1.5 3.515 3.515 1.5 6 1.5S10.5 3.515 10.5 6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                                {task.comments.length}
                              </span>
                            )}
                          </div>
                          <div className="task-card__footer">
                            <Link href={`/projects/${task.projectId}`} className="btn-voir">Voir</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === "list" && (
              <div className="list-container" role="tabpanel">
                <div className="list-container__header">
                  <div className="list-container__title-block">
                    <h2 className="list-container__title">Mes tâches assignées</h2>
                    <p className="list-container__subtitle">Par ordre de priorité</p>
                  </div>
                  <div className="search-field">
                    <input
                      type="text"
                      className="search-field__input"
                      placeholder="Rechercher une tâche"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      aria-label="Rechercher une tâche"
                    />
                    <span className="search-field__icon" aria-hidden="true">
                      <svg viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </span>
                  </div>
                </div>
                <div className="list-container__list">
                  {filteredTasks.length === 0 && (
                    <p className={styles.emptyList}>Aucune tâche trouvée</p>
                  )}
                  {filteredTasks.map((task) => (
                    <div className="task-list-item" key={task.id}>
                      <div className="task-list-item__left">
                        <div className="task-list-item__title">{task.title}</div>
                        {task.description && <div className="task-list-item__desc">{task.description}</div>}
                        <div className="task-list-item__meta">
                          {task.project && (
                            <span className="task-list-item__meta-item">
                              <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M1 3a1 1 0 011-1h2.5l1 1.5H10a1 1 0 011 1v5a1 1 0 01-1 1H2a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                              {task.project.name}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="task-list-item__meta-item">
                              <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><rect x="1.5" y="2" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M4 1v2M8 1v2M1.5 5h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                              {formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="task-list-item__right">
                        <span className={`badge ${STATUS_BADGE_CLASS[task.status]}`}>{STATUS_LABELS[task.status]}</span>
                        <Link href={`/projects/${task.projectId}`} className={`btn-voir ${styles.btnVoir}`}>Voir</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === "projects" && (
              <div className="list-container" role="tabpanel">
                <div className="list-container__header">
                  <div className="list-container__title-block">
                    <h2 className="list-container__title">Mes projets avec tâches</h2>
                    <p className="list-container__subtitle">Projets les plus urgents en premier</p>
                  </div>
                </div>
                <div className="list-container__list">
                  {projects.length === 0 && (
                    <p className={styles.emptyList}>Aucun projet trouvé</p>
                  )}
                  {projects.map((p) => (
                    <div className="task-list-item" key={p.id}>
                      <div className="task-list-item__left">
                        <div className="task-list-item__title">{p.name}</div>
                        {p.description && <div className="task-list-item__desc">{p.description}</div>}
                        <div className="task-list-item__meta">
                          <span className="task-list-item__meta-item">{p.tasks?.length || 0} tâche(s)</span>
                          {p.owner && <span className="task-list-item__meta-item">{p.owner.name || p.owner.email}</span>}
                        </div>
                      </div>
                      <div className="task-list-item__right">
                        <Link href={`/projects/${p.id}`} className={`btn-voir ${styles.btnVoir}`}>Voir</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
      <CreateProjectModal isOpen={showCreateProject} onClose={() => setShowCreateProject(false)} />
    </>
  );
}
