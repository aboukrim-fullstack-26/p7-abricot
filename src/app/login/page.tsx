"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/api";
import { useAuth } from "@/context/auth-context";
import Logo from "@/components/layout/Logo";
import AuthIllustration from "@/components/auth/AuthIllustration";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
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
      await login(email, password);
      await refreshUser();
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
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

        <h1 className="auth-page__title">Connexion</h1>

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          {error && <p className="auth-page__error" role="alert">{error}</p>}
          <Input
            id="email" type="email" label="Email"
            autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required aria-required="true"
          />
          <Input
            id="password" type="password" label="Mot de passe"
            autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required aria-required="true"
          />
          <Link href="/forgot-password" className="auth-page__forgot">
            Mot de passe oublié&nbsp;?
          </Link>
          <button type="submit" className="auth-page__submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="auth-page__footer-text">
          Pas encore inscrit&nbsp;? <Link href="/register">S&apos;inscrire</Link>
        </p>
      </div>

      <AuthIllustration />
    </div>
  );
}
