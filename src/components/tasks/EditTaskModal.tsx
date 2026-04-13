"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import TaskForm from "./TaskForm";
import { useToast } from "@/components/ui/Toast";
import { useUpdateTask } from "@/hooks/use-queries";
import type { Task, TaskStatus, TaskPriority, ProjectMember } from "@/types";

/** Convertit une date HTML (YYYY-MM-DD) en ISO string complet */
function toIsoDate(htmlDate: string): string | undefined {
  if (!htmlDate) return undefined;
  const d = new Date(htmlDate + "T12:00:00.000Z");
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  projectId: string;
  members: ProjectMember[];
}

export default function EditTaskModal({ isOpen, onClose, task, projectId, members }: EditTaskModalProps) {
  const { showToast } = useToast();
  const updateTask = useUpdateTask(projectId);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);

  // Populate form when task changes
  useEffect(() => {
    if (!task) return;
    setTitle(task.title);
    setDesc(task.description || "");
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setStatus(task.status);
    setPriority(task.priority);
    // FIX CRITIQUE : le backend ne retourne pas `userId` dans TaskAssignee,
    // uniquement l'objet `user` imbriqué. On prend donc `a.user.id`
    // (et non `a.userId` qui serait undefined).
    setAssigneeIds(task.assignees?.map((a) => a.user.id) || []);
  }, [task]);

  async function handleSubmit() {
    if (!task || !title.trim()) return;
    try {
      await updateTask.mutateAsync({
        taskId: task.id,
        data: {
          title, description: desc || undefined,
          dueDate: toIsoDate(dueDate), status, priority,
          assigneeIds,
        },
      });
      showToast("Tâche mise à jour");
      onClose();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Erreur", "error");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Modifier la tâche"
      footer={
        <button
          className={`btn ${title.trim() ? "btn--primary" : "btn--disabled"}`}
          disabled={!title.trim() || updateTask.isPending}
          onClick={handleSubmit}
        >
          {updateTask.isPending ? "..." : "Enregistrer"}
        </button>
      }
    >
      <TaskForm
        title={title} setTitle={setTitle}
        desc={desc} setDesc={setDesc}
        dueDate={dueDate} setDueDate={setDueDate}
        status={status} setStatus={setStatus}
        priority={priority} setPriority={setPriority}
        assigneeIds={assigneeIds} setAssigneeIds={setAssigneeIds}
        members={members}
      />
    </Modal>
  );
}
