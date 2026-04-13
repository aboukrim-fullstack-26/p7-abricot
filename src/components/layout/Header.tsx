"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getInitials } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import Logo from "./Logo";

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navItems = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: (
        <svg className="navbar__nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/>
          <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/>
          <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/>
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/>
        </svg>
      ),
    },
    {
      href: "/projects",
      label: "Projets",
      icon: (
        <svg className="navbar__nav-icon" viewBox="0 0 29 23" fill="none" aria-hidden="true">
          <path d="M26.5791 9.08691C27.4428 9.08698 28.2214 9.51204 28.6621 10.2227C29.0726 10.8866 29.1117 11.6992 28.7646 12.3965L24.3672 21.209C23.9765 21.9918 23.1766 22.4873 22.3018 22.4873H1.83984C0.970986 22.4873 0.240875 21.9031 0.0488281 21.1221L5.13672 10.4561C5.52599 9.62428 6.3926 9.08699 7.3457 9.08691H26.5791ZM8.66699 0C9.25766 6.22332e-05 9.81079 0.279265 10.1455 0.748047L12.0352 3.39062C12.0391 3.3935 12.05 3.39843 12.0654 3.39844H22.626C23.616 3.39852 24.4219 4.17503 24.4219 5.12988V7.44629H6.31055C5.35695 7.44629 4.48933 7.9845 4.10059 8.81641L0 17.4141V1.73145C2.66478e-05 0.776583 0.805427 6.71615e-05 1.7959 0H8.66699Z" fill="currentColor"/>
        </svg>
      ),
    },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Navigation principale">
      <div className="navbar__left">
        <Link href="/dashboard" aria-label="Accueil Abricot" style={{ display: "inline-flex", alignItems: "center" }}>
          <Logo variant="top" width={120} />
        </Link>
      </div>
      <div className="navbar__center">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar__nav-item ${isActive ? "navbar__nav-item--active" : "navbar__nav-item--inactive"}`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="navbar__right" ref={menuRef}>
        <button
          className="navbar__avatar"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu utilisateur"
          aria-expanded={menuOpen}
        >
          {getInitials(user?.name)}
        </button>
        {menuOpen && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-menu__header">
              <strong>{user?.name || "Utilisateur"}</strong>
              <span>{user?.email}</span>
            </div>
            <Link href="/profile" className="dropdown-menu__item" role="menuitem" onClick={() => setMenuOpen(false)}>
              Mon profil
            </Link>
            <button className="dropdown-menu__item dropdown-menu__item--danger" role="menuitem" onClick={logout}>
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
