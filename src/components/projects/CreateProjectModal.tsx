"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useCreateProject } from "@/hooks/use-queries";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { showToast } = useToast();
  const createProject = useCreateProject();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  function handleClose() { setName(""); setDesc(""); onClose(); }

  async function handleSubmit() {
    if (!name.trim()) return;
    try {
      await createProject.mutateAsync({ name, description: desc || undefined });
      showToast("Projet créé !");
      handleClose();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Erreur", "error");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Créer un projet"
      footer={
        <button
          className={`btn ${name.trim() ? "btn--primary" : "btn--disabled"}`}
          disabled={!name.trim() || createProject.isPending}
          onClick={handleSubmit}
        >
          {createProject.isPending ? "Création..." : "Ajouter un projet"}
        </button>
      }
    >
      <div className="form-group">
        <label className="form-label form-label--required" htmlFor="proj-name">Titre</label>
        <input id="proj-name" type="text" className="form-input" value={name}
          onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="proj-desc">Description</label>
        <textarea id="proj-desc" className="form-input form-input--textarea" value={desc}
          onChange={(e) => setDesc(e.target.value)} />
      </div>
    </Modal>
  );
}
