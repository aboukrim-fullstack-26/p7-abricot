import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Ajoute un padding uniforme (défaut : true) */
  padded?: boolean;
  /** Rend la carte cliquable (curseur pointer + hover shadow) */
  clickable?: boolean;
}

/**
 * Card — conteneur avec border, border-radius et ombre légère.
 * Toutes les props natives div sont forwarded (onClick, aria-*, …).
 */
export default function Card({
  children,
  padded = true,
  clickable = false,
  className = "",
  ...rest
}: CardProps) {
  const cls = [
    styles.card,
    padded ? styles["card--padded"] : "",
    clickable ? styles["card--clickable"] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}
