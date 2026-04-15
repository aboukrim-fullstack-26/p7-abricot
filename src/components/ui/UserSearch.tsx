"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { searchUsers } from "@/services/api";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types";
import styles from "./UserSearch.module.css";

interface UserSearchProps {
  onSelect: (user: User) => void;
  excludeIds?: string[];
  placeholder?: string;
  label?: string;
  /** Délai de debounce en ms — mettre à 0 dans les tests (défaut : 300) */
  debounceMs?: number;
}

/**
 * UserSearch — champ de recherche avec autocomplete.
 * Debounce configurable · Escape · navigation clavier ↑ ↓ Entrée.
 */
export default function UserSearch({
  onSelect,
  excludeIds = [],
  placeholder = "Rechercher par nom ou email…",
  label,
  debounceMs = 300,
}: UserSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    async (q: string) => {
      if (q.trim().length < 2) { setResults([]); setOpen(false); return; }
      setLoading(true);
      try {
        const users = await searchUsers(q);
        const filtered = users.filter((u) => !excludeIds.includes(u.id));
        setResults(filtered);
        setOpen(true);
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
    debounceRef.current = setTimeout(() => search(query), debounceMs);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search, debounceMs]);

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
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && activeIndex >= 0) { e.preventDefault(); handleSelect(results[activeIndex]); }
    else if (e.key === "Escape") { setOpen(false); }
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {label && (
        <label className={`form-label ${styles.label}`}>{label}</label>
      )}
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className="form-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          autoComplete="off"
        />
        {loading && <span className={styles.spinner} aria-hidden="true" />}
      </div>

      {open && results.length > 0 && (
        <ul role="listbox" className={styles.dropdown}>
          {results.map((user, i) => (
            <li
              key={user.id}
              role="option"
              aria-selected={i === activeIndex}
              onClick={() => handleSelect(user)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`${styles.option} ${i === activeIndex ? styles["option--active"] : ""}`}
            >
              <span className={`avatar avatar--sm avatar--gray ${styles.optionAvatar}`}>
                {getInitials(user.name)}
              </span>
              <span>
                <span className={styles.optionName}>{user.name || "—"}</span>
                <span className={styles.optionEmail}>{user.email}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {open && results.length === 0 && !loading && query.trim().length >= 2 && (
        <div className={styles.empty}>Aucun utilisateur trouvé</div>
      )}
    </div>
  );
}
