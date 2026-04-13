"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useUpdateProject } from "@/hooks/use-queries";
import type { Project } from "@/types";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const { showToast } = useToast();
  const updateProject = useUpdateProject(project.id);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(project.name);
      setDesc(project.description || "");
    }
  }, [isOpen, project]);

  async function handleSubmit() {
    if (!name.trim()) return;
    try {
      await updateProject.mutateAsync({ name, description: desc || undefined });
      showToast("Projet mis à jour");
      onClose();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Erreur", "error");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Modifier le projet"
      footer={
        <button
          className={`btn ${name.trim() ? "btn--primary" : "btn--disabled"}`}
          disabled={!name.trim() || updateProject.isPending}
          onClick={handleSubmit}
        >
          {updateProject.isPending ? "..." : "Enregistrer"}
        </button>
      }
    >
      <div className="form-group">
        <label className="form-label form-label--required" htmlFor="ep-name">Titre</label>
        <input id="ep-name" type="text" className="form-input" value={name}
          onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="ep-desc">Description</label>
        <textarea id="ep-desc" className="form-input form-input--textarea" value={desc}
          onChange={(e) => setDesc(e.target.value)} />
      </div>
    </Modal>
  );
}
