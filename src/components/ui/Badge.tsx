import type { ReactNode } from "react";

type BadgeVariant =
  | "todo"
  | "inprogress"
  | "done"
  | "cancelled"
  | "low"
  | "medium"
  | "high"
  | "urgent"
  | "owner"
  | "neutral";

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  todo:       "badge--todo",
  inprogress: "badge--inprogress",
  done:       "badge--done",
  cancelled:  "badge--todo",
  low:        "badge--priority-low",
  medium:     "badge--priority-medium",
  high:       "badge--priority-high",
  urgent:     "badge--priority-urgent",
  owner:      "chip--owner",
  neutral:    "badge--neutral",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

/**
 * Badge — étiquette de statut ou priorité.
 *
 * Variantes prédéfinies (calquées sur le design system abricot.css) :
 *   todo, inprogress, done, cancelled
 *   low, medium, high, urgent
 *   owner, neutral
 */
export default function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span className={`badge ${VARIANT_CLASS[variant]} ${className}`.trim()}>
      {children}
    </span>
  );
}
