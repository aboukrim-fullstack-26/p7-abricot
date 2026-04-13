"use client";
import { useState, useEffect, type FormEvent } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/auth-context";
import { updateProfile, updatePassword } from "@/services/api";
import { useToast } from "@/components/ui/Toast";

/**
 * Page "Mon compte" — refonte fidèle à la maquette Figma.
 * Une seule carte blanche centrée avec :
 * - Titre "Mon compte" + sous-titre "{prénom nom}"
 * - 4 inputs en colonne : Nom, Prénom, Email, Mot de passe (masqué ●●●●)
 * - Bouton noir "Modifier les informations"
 *
 * Le mot de passe peut être modifié dans la même vue : si l'utilisateur
 * tape un nouveau mot de passe, on lui demande son mot de passe actuel
 * via un mini-prompt avant validation.
 */
export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      // Le backend stocke un seul "name" — on le découpe en prénom + nom
      const parts = (user.name || "").trim().split(/\s+/);
      setPrenom(parts[0] || "");
      setNom(parts.slice(1).join(" ") || "");
      setEmail(user.email);
      setPassword("");
    }
  }, [user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Mise à jour du profil (nom, email)
      const fullName = [prenom, nom].filter(Boolean).join(" ");
      const profileChanged =
        fullName !== (user?.name || "") || email !== user?.email;

      if (profileChanged) {
        await updateProfile({ name: fullName, email });
      }

      // 2. Mise à jour du mot de passe si saisi
      if (password.trim()) {
        if (password.length < 6) {
          showToast("Le mot de passe doit contenir au moins 6 caractères", "error");
          setSubmitting(false);
          return;
        }
        const current = window.prompt("Pour changer votre mot de passe, saisissez votre mot de passe actuel :");
        if (!current) { setSubmitting(false); return; }
        await updatePassword(current, password);
        setPassword("");
      }

      await refreshUser();
      showToast("Informations mises à jour", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Erreur lors de la mise à jour", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || !user) {
    return <><Header /><div className="spinner" /></>;
  }

  const fullDisplayName = [prenom, nom].filter(Boolean).join(" ") || user.email;

  return (
    <>
      <Header />
      <main className="main-content" id="main-content">
        <div className="moncompte-card">
          <div className="moncompte-card__header">
            <h1 className="moncompte-card__title">Mon compte</h1>
            <p className="moncompte-card__subtitle">{fullDisplayName}</p>
          </div>

          <form className="moncompte-card__form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="nom">Nom</label>
              <input id="nom" type="text" className="form-input"
                value={nom} onChange={(e) => setNom(e.target.value)}
                autoComplete="family-name" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prenom">Prénom</label>
              <input id="prenom" type="text" className="form-input"
                value={prenom} onChange={(e) => setPrenom(e.target.value)}
                autoComplete="given-name" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="form-input"
                value={email} onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" required aria-required="true" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Mot de passe</label>
              <div className="moncompte-card__password-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="●●●●●●●●●●●"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  aria-describedby="pw-hint"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="moncompte-card__password-toggle"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
              <p id="pw-hint" className="form-hint">
                Laissez vide pour conserver votre mot de passe actuel
              </p>
            </div>

            <button type="submit" className="moncompte-card__button" disabled={submitting}>
              {submitting ? "Enregistrement..." : "Modifier les informations"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
