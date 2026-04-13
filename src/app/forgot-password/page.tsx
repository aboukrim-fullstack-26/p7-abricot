"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/services/api";
import Logo from "@/components/layout/Logo";
import AuthIllustration from "@/components/auth/AuthIllustration";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
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

        <h1 className="auth-page__title">Mot de passe oublié</h1>

        {success ? (
          <div className="auth-page__form">
            <p className="auth-page__success" role="status">
              Si un compte existe pour cette adresse, un email avec un lien de réinitialisation vous a été envoyé.
            </p>
            <Link href="/login" className="auth-page__back-link">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
            {error && <p className="auth-page__error" role="alert">{error}</p>}
            <p className="auth-page__hint">
              Saisissez votre email pour recevoir un lien de réinitialisation.
            </p>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="form-input"
                autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                required aria-required="true" />
            </div>
            <button type="submit" className="auth-page__submit" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer le lien"}
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
