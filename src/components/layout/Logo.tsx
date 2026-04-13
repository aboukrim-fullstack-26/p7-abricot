"use client";
import Image from "next/image";

interface LogoProps {
  /** "top" = orange logo (navbar), "bottom" = black logo (footer) */
  variant?: "top" | "bottom";
  /** Width in pixels (height is auto-computed) */
  width?: number;
  className?: string;
}

/**
 * Composant Logo Abricot — utilise les SVG officiels Figma.
 * - "top" : logo orange #D3580B pour la navbar (147x19 natif)
 * - "bottom" : logo noir #0F0F0F pour le footer (101x13 natif)
 */
export default function Logo({ variant = "top", width = 100, className }: LogoProps) {
  const src = variant === "top" ? "/icons/logo-top.svg" : "/icons/logo-bottom.svg";
  // Aspect ratio natif des SVG Figma
  const ratio = variant === "top" ? 147 / 19 : 101 / 13;
  const height = Math.round(width / ratio);
  return (
    <Image
      src={src}
      alt="Abricot"
      width={width}
      height={height}
      priority={variant === "top"}
      className={className}
    />
  );
}
