import Link from "next/link";
import { getInitials } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project: p }: ProjectCardProps) {
  const totalTasks = p.tasks?.length || 0;
  const doneTasks = p.tasks?.filter((t) => t.status === "DONE").length || 0;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const memberCount = (p.members?.length || 0) + 1; // +1 for owner

  return (
    <Link href={`/projects/${p.id}`} className="project-card">
      <h3 className="project-card__title">{p.name}</h3>
      {p.description && <p className="project-card__desc">{p.description}</p>}
      <div className="project-card__progress">
        <div className="project-card__progress-header">
          <span className="project-card__progress-label">Progression</span>
          <span className="project-card__progress-pct">{pct}%</span>
        </div>
        <div className="project-card__progress-bar">
          <div className="project-card__progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="project-card__progress-tasks">{doneTasks}/{totalTasks} tâches terminées</p>
      </div>
      <div className="project-card__team">
        <div className="project-card__team-label">
          <svg viewBox="0 0 14 14" fill="none"><path d="M9.5 12v-1a3.5 3.5 0 00-3.5-3.5h-3A3.5 3.5 0 00-.5 11v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="4.5" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.3"/></svg>
          Équipe ({memberCount})
        </div>
        <div className="project-card__team-members">
          {p.owner && (
            <>
              <span className="avatar avatar--sm avatar--orange">{getInitials(p.owner.name)}</span>
              <span className="chip chip--owner">Propriétaire</span>
            </>
          )}
          {p.members?.slice(0, 3).map((m) => (
            <span key={m.id} className="avatar avatar--sm avatar--gray">{getInitials(m.user.name)}</span>
          ))}
          {(p.members?.length || 0) > 3 && (
            <span className="chip">+{(p.members?.length || 0) - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
