import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Ajoute un padding uniforme (défaut : true) */
  padded?: boolean;
  /** Rend la carte cliquable (curseur pointer + hover shadow) */
  clickable?: boolean;
}

/**
 * Card — conteneur avec border, border-radius et ombre légère.
 *
 * Utilisée comme base pour ProjectCard, TaskCard, etc.
 * Toutes les props natives div sont forwarded (onClick, aria-*, …).
 */
export default function Card({
  children,
  padded = true,
  clickable = false,
  className = "",
  style,
  ...rest
}: CardProps) {
  const base: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #E8EAED",
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    ...(padded ? { padding: "18px 20px" } : {}),
    ...(clickable ? { cursor: "pointer" } : {}),
    ...style,
  };

  return (
    <div className={className} style={base} {...rest}>
      {children}
    </div>
  );
}
