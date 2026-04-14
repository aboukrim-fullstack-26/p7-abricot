"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
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
    if (isOpen) { setName(project.name); setDesc(project.description || ""); }
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
        <Button
          variant={name.trim() ? "primary" : "outline"}
          disabled={!name.trim()}
          loading={updateProject.isPending}
          onClick={handleSubmit}
        >
          Enregistrer
        </Button>
      }
    >
      <Input
        id="ep-name" label="Titre" required
        value={name} onChange={(e) => setName(e.target.value)}
      />
      <Textarea
        id="ep-desc" label="Description"
        value={desc} onChange={(e) => setDesc(e.target.value)}
      />
    </Modal>
  );
}
