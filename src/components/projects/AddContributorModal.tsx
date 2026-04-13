"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useAddContributor } from "@/hooks/use-queries";
import type { Project } from "@/types";

interface AddContributorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function AddContributorModal({ isOpen, onClose, project }: AddContributorModalProps) {
  const { showToast } = useToast();
  const addContributor = useAddContributor(project.id);
  const [email, setEmail] = useState("");

  function handleClose() { setEmail(""); onClose(); }

  async function handleSubmit() {
    if (!email.trim()) return;
    if (project.owner && email.toLowerCase() === project.owner.email.toLowerCase()) {
      showToast("Le propriétaire du projet ne peut pas être ajouté comme contributeur", "error");
      return;
    }
    try {
      await addContributor.mutateAsync({ email });
      showToast("Contributeur ajouté");
      handleClose();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Erreur", "error");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Ajouter un contributeur"
      footer={
        <button
          className={`btn ${email.trim() ? "btn--primary" : "btn--disabled"}`}
          disabled={!email.trim() || addContributor.isPending}
          onClick={handleSubmit}
        >
          {addContributor.isPending ? "..." : "Ajouter"}
        </button>
      }
    >
      <div className="form-group">
        <label className="form-label form-label--required" htmlFor="ce">Email du contributeur</label>
        <input id="ce" type="email" className="form-input" value={email}
          onChange={(e) => setEmail(e.target.value)} placeholder="email@exemple.com" />
        <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
          Le propriétaire du projet ({project.owner?.email}) ne peut pas être ajouté comme contributeur.
        </p>
      </div>
    </Modal>
  );
}
