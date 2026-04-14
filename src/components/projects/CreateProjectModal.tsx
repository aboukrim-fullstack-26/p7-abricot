"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
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
        <Button
          variant={name.trim() ? "primary" : "outline"}
          disabled={!name.trim()}
          loading={createProject.isPending}
          onClick={handleSubmit}
        >
          Ajouter un projet
        </Button>
      }
    >
      <Input
        id="proj-name" label="Titre" required
        value={name} onChange={(e) => setName(e.target.value)}
      />
      <Textarea
        id="proj-desc" label="Description"
        value={desc} onChange={(e) => setDesc(e.target.value)}
      />
    </Modal>
  );
}
