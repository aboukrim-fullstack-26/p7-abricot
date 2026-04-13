"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: "#F7F8FA", textAlign: "center", padding: 40,
    }}>
      <h1 style={{ fontSize: 72, fontWeight: 700, color: "#D3580B", marginBottom: 8 }}>404</h1>
      <h2 style={{ fontSize: 24, fontWeight: 600, color: "#212121", marginBottom: 12 }}>Page introuvable</h2>
      <p style={{ color: "#6B7280", marginBottom: 32, maxWidth: 400 }}>
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/dashboard" style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "12px 24px", background: "#1B1B1B", color: "#fff",
        borderRadius: 10, fontWeight: 500, fontSize: 14, textDecoration: "none",
      }}>
        Retour au tableau de bord
      </Link>
    </div>
  );
}
