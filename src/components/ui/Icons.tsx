/**
 * Icônes inline SVG basées sur les fichiers SVG officiels Figma.
 * Utilisées dans les cartes tâches et la navigation.
 */

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

/** Icône dossier (projet) — extrait de svg-projet.svg */
export function FolderIcon({ size = 12, color = "currentColor", className }: IconProps) {
  return (
    <svg width={size} height={Math.round(size * 23 / 29)} viewBox="0 0 29 23" fill="none" className={className} aria-hidden="true">
      <path d="M26.5791 9.08691C27.4428 9.08698 28.2214 9.51204 28.6621 10.2227C29.0726 10.8866 29.1117 11.6992 28.7646 12.3965L24.3672 21.209C23.9765 21.9918 23.1766 22.4873 22.3018 22.4873H1.83984C0.970986 22.4873 0.240875 21.9031 0.0488281 21.1221L5.13672 10.4561C5.52599 9.62428 6.3926 9.08699 7.3457 9.08691H26.5791ZM8.66699 0C9.25766 6.22332e-05 9.81079 0.279265 10.1455 0.748047L12.0352 3.39062C12.0391 3.3935 12.05 3.39843 12.0654 3.39844H22.626C23.616 3.39852 24.4219 4.17503 24.4219 5.12988V7.44629H6.31055C5.35695 7.44629 4.48933 7.9845 4.10059 8.81641L0 17.4141V1.73145C2.66478e-05 0.776583 0.805427 6.71615e-05 1.7959 0H8.66699Z" fill={color}/>
    </svg>
  );
}

/** Icône calendrier (date) — extrait de svig-icon-date.svg */
export function DateIcon({ size = 12, color = "currentColor", className }: IconProps) {
  return (
    <svg width={size} height={Math.round(size * 17 / 15)} viewBox="0 0 15 17" fill="none" className={className} aria-hidden="true">
      <path d="M4.42285 0C4.10746 0 3.8457 0.261761 3.8457 0.577148V1.17871C1.39505 1.38897 0 2.96789 0 5.57715V12.1152C0 14.9229 1.61522 16.538 4.42285 16.5381H10.5771C13.3847 16.538 15 14.9229 15 12.1152V5.57715C15 2.96794 13.6049 1.38901 11.1543 1.17871V0.577148C11.1543 0.261782 10.8925 3.47543e-05 10.5771 0C10.2618 0 10 0.261761 10 0.577148V1.15332H5V0.577148C5 0.261793 4.7382 5.25452e-05 4.42285 0ZM13.8457 12.1152C13.8457 14.3152 12.777 15.3847 10.5771 15.3848H4.42285C2.22293 15.3847 1.15332 14.3152 1.15332 12.1152V6.60742H13.8457V12.1152ZM10 2.88477C10.0001 3.20009 10.2618 3.46191 10.5771 3.46191C10.8925 3.46188 11.1542 3.20007 11.1543 2.88477V2.33789C12.9266 2.51306 13.806 3.53533 13.8418 5.4541H1.15723C1.193 3.53528 2.07336 2.51303 3.8457 2.33789V2.88477C3.84578 3.20009 4.10751 3.46191 4.42285 3.46191C4.73815 3.46186 4.99992 3.20006 5 2.88477V2.30762H10V2.88477Z" fill={color}/>
    </svg>
  );
}

/** Icône commentaire (chat bubble) */
export function ChatIcon({ size = 12, color = "currentColor", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <path d="M10.5 6c0 2.485-2.015 4.5-4.5 4.5a4.48 4.48 0 01-2.25-.606L1.5 10.5l.606-2.25A4.48 4.48 0 011.5 6C1.5 3.515 3.515 1.5 6 1.5S10.5 3.515 10.5 6z" stroke={color} strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  );
}
