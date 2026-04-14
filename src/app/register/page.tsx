"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/api";
import { useAuth } from "@/context/auth-context";
import Logo from "@/components/layout/Logo";
import AuthIllustration from "@/components/auth/AuthIllustration";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(email, password, name || undefined);
      await refreshUser();
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__panel">
        <div className="auth-page__logo">
          <Logo variant="top" width={252} />
        </div>

        <h1 className="auth-page__title">Créer un compte</h1>

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          {error && <p className="auth-page__error" role="alert">{error}</p>}
          <Input
            id="name" type="text" label="Nom (optionnel)"
            autoComplete="name" value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="email" type="email" label="Email"
            autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required aria-required="true"
          />
          <Input
            id="password" type="password" label="Mot de passe"
            autoComplete="new-password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required aria-required="true"
          />
          <button type="submit" className="auth-page__submit" disabled={loading}>
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <p className="auth-page__footer-text">
          Déjà inscrit&nbsp;? <Link href="/login">Se connecter</Link>
        </p>
      </div>

      <AuthIllustration />
    </div>
  );
}
