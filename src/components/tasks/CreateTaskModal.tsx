"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import TaskForm from "./TaskForm";
import { useToast } from "@/components/ui/Toast";
import { useCreateTask } from "@/hooks/use-queries";
import type { TaskStatus, TaskPriority, ProjectMember } from "@/types";

/** Convertit une date HTML (YYYY-MM-DD) en ISO string complet */
function toIsoDate(htmlDate: string): string | undefined {
  if (!htmlDate) return undefined;
  const d = new Date(htmlDate + "T12:00:00.000Z");
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  members: ProjectMember[];
}

export default function CreateTaskModal({ isOpen, onClose, projectId, members }: CreateTaskModalProps) {
  const { showToast } = useToast();
  const createTask = useCreateTask(projectId);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);

  function reset() {
    setTitle(""); setDesc(""); setDueDate(""); setStatus("TODO");
    setPriority("MEDIUM"); setAssigneeIds([]);
  }

  function handleClose() { reset(); onClose(); }

  async function handleSubmit() {
    if (!title.trim()) return;
    try {
      await createTask.mutateAsync({
        title, description: desc || undefined,
        dueDate: toIsoDate(dueDate), status, priority,
        assigneeIds: assigneeIds.length > 0 ? assigneeIds : undefined,
      });
      showToast("Tâche créée");
      handleClose();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Erreur", "error");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Créer une tâche"
      footer={
        <button
          className={`btn ${title.trim() ? "btn--primary" : "btn--disabled"}`}
          disabled={!title.trim() || createTask.isPending}
          onClick={handleSubmit}
        >
          {createTask.isPending ? "..." : "+ Ajouter une tâche"}
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
