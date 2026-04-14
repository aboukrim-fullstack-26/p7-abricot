"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/services/api";
import Logo from "@/components/layout/Logo";
import AuthIllustration from "@/components/auth/AuthIllustration";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
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

        {sent ? (
          <p className="auth-page__footer-text">
            Un email de réinitialisation a été envoyé si ce compte existe.
          </p>
        ) : (
          <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
            <Input
              id="email" type="email" label="Votre email"
              autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required aria-required="true"
            />
            <button type="submit" className="auth-page__submit" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>
        )}

        <p className="auth-page__footer-text">
          <Link href="/login">Retour à la connexion</Link>
        </p>
      </div>

      <AuthIllustration />
    </div>
  );
}
