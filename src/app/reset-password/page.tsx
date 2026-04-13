"use client";
import { useState, type FormEvent, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/services/api";
import Logo from "@/components/layout/Logo";
import AuthIllustration from "@/components/auth/AuthIllustration";

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (!token) {
      setError("Lien invalide ou expiré");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lien invalide ou expiré");
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

        <h1 className="auth-page__title">Nouveau mot de passe</h1>

        {success ? (
          <div className="auth-page__form">
            <p className="auth-page__success" role="status">
              Mot de passe modifié avec succès. Redirection vers la connexion...
            </p>
          </div>
        ) : (
          <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
            {error && <p className="auth-page__error" role="alert">{error}</p>}
            <div className="form-group">
              <label className="form-label" htmlFor="pw">Nouveau mot de passe</label>
              <input id="pw" type="password" className="form-input"
                autoComplete="new-password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                required aria-required="true" minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pw2">Confirmer le mot de passe</label>
              <input id="pw2" type="password" className="form-input"
                autoComplete="new-password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required aria-required="true" minLength={6} />
            </div>
            <button type="submit" className="auth-page__submit" disabled={loading}>
              {loading ? "Envoi..." : "Réinitialiser"}
            </button>
          </form>
        )}

        <p className="auth-page__footer-text">
          <Link href="/login">← Retour à la connexion</Link>
        </p>
      </div>

      <AuthIllustration />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="spinner" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
