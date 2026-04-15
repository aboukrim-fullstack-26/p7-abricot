"use client";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import UserSearch from "@/components/ui/UserSearch";
import { useToast } from "@/components/ui/Toast";
import { useAddContributor } from "@/hooks/use-queries";
import type { Project, User } from "@/types";
import styles from "./AddContributorModal.module.css";

interface AddContributorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function AddContributorModal({ isOpen, onClose, project }: AddContributorModalProps) {
  const { showToast } = useToast();
  const addContributor = useAddContributor(project.id);

  const excludeIds = [
    project.ownerId,
    ...(project.members?.map((m) => m.userId) || []),
  ];

  async function handleSelect(user: User) {
    try {
      await addContributor.mutateAsync({ email: user.email });
      showToast(`${user.name || user.email} ajouté`);
      onClose();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Erreur", "error");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajouter un contributeur"
      footer={
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      }
    >
      <UserSearch
        label="Rechercher un utilisateur"
        onSelect={handleSelect}
        excludeIds={excludeIds}
        placeholder="Nom ou email…"
      />
      <p className={styles.hint}>
        Le propriétaire ({project.owner?.email}) et les membres actuels sont exclus.
      </p>
    </Modal>
  );
}
