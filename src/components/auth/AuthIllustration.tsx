import Image from "next/image";

/**
 * Illustration de fond des pages d'authentification (panneau droit).
 * Utilise la vraie photo Figma : scène de bureau flat lay avec laptop,
 * scotch tape, agrafeuse bleue, stylos orange, règle jaune, carnets,
 * et binder clips bleus sur fond gris clair.
 *
 * L'image est marquée aria-hidden car purement décorative.
 */
export default function AuthIllustration() {
  return (
    <div className="auth-page__image" aria-hidden="true">
      <Image
        src="/images/auth-background.jpg"
        alt=""
        fill
        priority
        sizes="(max-width: 900px) 0vw, 50vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );
}
