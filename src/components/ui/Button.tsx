import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger" | "ia";
type ButtonSize    = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "btn btn--primary",
  outline: "btn btn--outline",
  ghost:   "btn btn--ghost",
  danger:  "btn btn--outline",
  ia:      "btn-ia",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "btn--sm",
  md: "",
};

const DANGER_STYLE = { color: "#E5484D", borderColor: "#E5484D" } as const;

/**
 * Button — bouton réutilisable avec variantes, taille, état loading et icône.
 *
 * Variantes : primary | outline | ghost | danger | ia
 * Tailles   : sm | md (défaut)
 */
export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  disabled,
  className = "",
  style,
  ...rest
}: ButtonProps) {
  const cls = [
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    icon ? "btn--icon" : "",
    (disabled || loading) && variant !== "ia" ? "btn--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...rest}
      className={cls}
      disabled={disabled || loading}
      style={variant === "danger" ? { ...DANGER_STYLE, ...style } : style}
    >
      {icon && !loading && icon}
      {loading ? "..." : children}
    </button>
  );
}
