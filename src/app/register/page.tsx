"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/api";
import { useAuth } from "@/context/auth-context";
import Logo from "@/components/layout/Logo";
import AuthIllustration from "@/components/auth/AuthIllustration";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setLoading(true);
    try {
      await registerUser(email, password);
      await refreshUser();
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
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

        <h1 className="auth-page__title">Inscription</h1>

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          {error && <p className="auth-page__error" role="alert">{error}</p>}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="form-input"
              autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required aria-required="true" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Mot de passe</label>
            <input id="password" type="password" className="form-input"
              autoComplete="new-password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              required aria-required="true" minLength={6} />
          </div>
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
