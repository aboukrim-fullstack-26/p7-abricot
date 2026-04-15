import { useMemo } from "react";
import { getInitials } from "@/lib/utils";
import type { ProjectMember } from "@/types";
import styles from "./AssigneeSelector.module.css";

interface AssigneeSelectorProps {
  members: ProjectMember[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

/**
 * Seuls les membres (ProjectMember) peuvent être assignés à une tâche.
 * Le propriétaire n'est pas dans la table ProjectMember côté backend,
 * donc il ne peut pas être assigné (limitation API : validateProjectMembers
 * vérifie uniquement la table ProjectMember).
 */
export default function AssigneeSelector({ members, selectedIds, onChange }: AssigneeSelectorProps) {
  const assignableUsers = useMemo(() => {
    const users: { id: string; name: string | null; email: string }[] = [];
    members.forEach((m) => {
      if (!users.find((u) => u.id === m.userId)) {
        users.push(m.user);
      }
    });
    return users;
  }, [members]);

  const toggle = (userId: string) => {
    if (selectedIds.includes(userId)) {
      onChange(selectedIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedIds, userId]);
    }
  };

  if (assignableUsers.length === 0) {
    return (
      <p className={styles.empty}>
        Aucun contributeur disponible. Ajoutez des contributeurs au projet pour pouvoir leur assigner des tâches.
      </p>
    );
  }

  return (
    <div className={styles.list}>
      {assignableUsers.map((u) => (
        <label key={u.id} className={styles.label}>
          <input
            type="checkbox"
            checked={selectedIds.includes(u.id)}
            onChange={() => toggle(u.id)}
            className={styles.checkbox}
          />
          <span className={`avatar avatar--sm avatar--gray ${styles.avatar}`}>
            {getInitials(u.name)}
          </span>
          <span>{u.name || u.email}</span>
        </label>
      ))}
    </div>
  );
}
