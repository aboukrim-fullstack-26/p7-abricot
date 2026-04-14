"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { searchUsers } from "@/services/api";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types";

interface UserSearchProps {
  /** Appelé quand l'utilisateur sélectionne un résultat */
  onSelect: (user: User) => void;
  /** IDs à exclure des résultats (déjà membres, propriétaire…) */
  excludeIds?: string[];
  placeholder?: string;
  /** Label du champ (optionnel) */
  label?: string;
}

/**
 * UserSearch — champ de recherche avec autocomplete pour trouver
 * des utilisateurs par nom ou email.
 *
 * - Debounce 300 ms
 * - Fermeture sur Escape ou clic extérieur
 * - Navigation clavier ↑ ↓ Entrée dans la liste
 */
export default function UserSearch({
  onSelect,
  excludeIds = [],
  placeholder = "Rechercher par nom ou email…",
  label,
}: UserSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Recherche avec debounce */
  const search = useCallback(
    async (q: string) => {
      if (q.trim().length < 2) { setResults([]); setOpen(false); return; }
      setLoading(true);
      try {
        const users = await searchUsers(q);
        const filtered = users.filter((u) => !excludeIds.includes(u.id));
        setResults(filtered);
        setOpen(filtered.length > 0);
        setActiveIndex(-1);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [excludeIds]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  /* Fermeture au clic extérieur */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(user: User) {
    onSelect(user);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {label && (
        <label className="form-label" style={{ display: "block", marginBottom: 4 }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          className="form-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={open}
          autoComplete="off"
        />
        {loading && (
          <span style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            width: 14, height: 14, border: "2px solid #E8EAED",
            borderTopColor: "#D3580B", borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
            display: "inline-block",
          }} />
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          role="listbox"
          style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
            background: "#fff", border: "1px solid #E8EAED", borderRadius: 10,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)", zIndex: 100,
            listStyle: "none", margin: 0, padding: "4px 0",
            maxHeight: 240, overflowY: "auto",
          }}
        >
          {results.map((user, i) => (
            <li
              key={user.id}
              role="option"
              aria-selected={i === activeIndex}
              onClick={() => handleSelect(user)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", cursor: "pointer",
                background: i === activeIndex ? "#FFF3EC" : "transparent",
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span
                className="avatar avatar--sm avatar--gray"
                style={{ flexShrink: 0, width: 28, height: 28, fontSize: 10 }}
              >
                {getInitials(user.name)}
              </span>
              <span>
                <span style={{ display: "block", fontSize: 13, fontWeight: 500 }}>
                  {user.name || "—"}
                </span>
                <span style={{ display: "block", fontSize: 11, color: "#6B7280" }}>
                  {user.email}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {open && results.length === 0 && !loading && query.trim().length >= 2 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #E8EAED", borderRadius: 10,
          padding: "12px 16px", fontSize: 13, color: "#9CA3AF",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 100,
        }}>
          Aucun utilisateur trouvé
        </div>
      )}
    </div>
  );
}
