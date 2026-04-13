import { useMemo } from "react";
import { getInitials } from "@/lib/utils";
import type { ProjectMember } from "@/types";

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
      <p style={{ color: "#9CA3AF", fontSize: 12, fontStyle: "italic" }}>
        Aucun contributeur disponible. Ajoutez des contributeurs au projet pour pouvoir leur assigner des tâches.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {assignableUsers.map((u) => (
        <label key={u.id} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "6px 0", fontSize: 13 }}>
          <input
            type="checkbox"
            checked={selectedIds.includes(u.id)}
            onChange={() => toggle(u.id)}
            style={{ accentColor: "#D3580B", width: 16, height: 16 }}
          />
          <span className="avatar avatar--sm avatar--gray" style={{ width: 22, height: 22, fontSize: 9 }}>{getInitials(u.name)}</span>
          <span>{u.name || u.email}</span>
        </label>
      ))}
    </div>
  );
}
