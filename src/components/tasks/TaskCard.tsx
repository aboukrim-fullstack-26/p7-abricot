"use client";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { formatDate, timeAgo, STATUS_LABELS, PRIORITY_LABELS, getInitials } from "@/lib/utils";
import type { Task, Comment as TComment, User, TaskStatus, TaskPriority } from "@/types";
import styles from "./TaskCard.module.css";

const STATUS_TO_VARIANT: Record<TaskStatus, "todo" | "inprogress" | "done" | "cancelled"> = {
  TODO: "todo", IN_PROGRESS: "inprogress", DONE: "done", CANCELLED: "cancelled",
};
const PRIORITY_TO_VARIANT: Record<TaskPriority, "low" | "medium" | "high" | "urgent"> = {
  LOW: "low", MEDIUM: "medium", HIGH: "high", URGENT: "urgent",
};

interface TaskCardProps {
  task: Task;
  currentUser: User;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onAddComment: (taskId: string, text: string) => void;
  onDeleteComment: (taskId: string, commentId: string) => void;
}

export default function TaskCard({ task, currentUser, onEdit, onDelete, onAddComment, onDeleteComment }: TaskCardProps) {
  const [open, setOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  function handleAddComment() {
    if (!commentText.trim()) return;
    onAddComment(task.id, commentText.trim());
    setCommentText("");
  }

  return (
    <Card padded={false} className="task-detail-card">
      <div className="task-detail-card__header">
        <div className="task-detail-card__title-group">
          <span className="task-detail-card__title">{task.title}</span>
          <Badge variant={STATUS_TO_VARIANT[task.status]}>
            {STATUS_LABELS[task.status]}
          </Badge>
          {task.priority && task.priority !== "MEDIUM" && (
            <Badge variant={PRIORITY_TO_VARIANT[task.priority]}>
              {PRIORITY_LABELS[task.priority]}
            </Badge>
          )}
        </div>
        <div className={styles.actions}>
          <button className="btn-menu" onClick={() => onEdit(task)} aria-label="Modifier la tâche" title="Modifier">
            <svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M8.5 1.5a1.5 1.5 0 012.121 2.121L4 10.243l-2.5.5.5-2.5L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="btn-menu" onClick={() => onDelete(task.id)} aria-label="Supprimer la tâche" title="Supprimer">
            <svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M2 3h10M5.5 3V2h3v1M4 5.5v5M7 5.5v5M10 5.5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {task.description && <p className="task-detail-card__desc">{task.description}</p>}

      {task.dueDate && (
        <div className="task-detail-card__meta">
          <div className="task-detail-card__meta-item">
            <svg viewBox="0 0 12 12" fill="none"><rect x="1.5" y="2" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M4 1v2M8 1v2M1.5 5h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Échéance : <strong>{formatDate(task.dueDate)}</strong>
          </div>
        </div>
      )}

      {task.assignees && task.assignees.length > 0 && (
        <div className={styles.assignees}>
          <span className={styles.assigneesLabel}>Assigné à :</span>
          {task.assignees.map((a) => (
            <span key={a.id} className={styles.assigneeItem}>
              <span className="avatar avatar--sm avatar--gray">{getInitials(a.user.name)}</span>
              <span className="chip">{a.user.name || a.user.email}</span>
            </span>
          ))}
        </div>
      )}

      <div
        className="task-detail-card__comments-toggle"
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen((o) => !o); }}
      >
        <span>Commentaires ({task.comments?.length || 0})</span>
        <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
          <path d={open ? "M3 5l4 4 4-4" : "M3 9l4-4 4 4"} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {open && (
        <div className="task-detail-card__comments-body">
          {task.comments?.map((c: TComment) => (
            <div className="comment" key={c.id}>
              <div className="comment__avatar">{getInitials(c.author?.name)}</div>
              <div className="comment__body">
                <div className="comment__author">
                  <strong>{c.author?.name || c.author?.email}</strong>
                  <time>{timeAgo(c.createdAt)}</time>
                  {c.authorId === currentUser.id && (
                    <button
                      onClick={() => onDeleteComment(task.id, c.id)}
                      className={styles.commentDeleteBtn}
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                <p className="comment__text">{c.content}</p>
              </div>
            </div>
          ))}
          <div className="comment-input">
            <div className={`comment__avatar ${styles.currentUserAvatar}`}>
              {getInitials(currentUser.name)}
            </div>
            <input
              type="text"
              className="comment-input__field"
              placeholder="Ajouter un commentaire..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(); }}
              aria-label="Ajouter un commentaire"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
