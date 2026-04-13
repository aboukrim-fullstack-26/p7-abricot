# Abricot.co — Frontend Next.js

SaaS de gestion de projet collaboratif pour freelances.

## Stack technique

| Technologie | Version | Justification |
|---|---|---|
| **Next.js** | 16 (App Router) | Framework recommandé par les spécifications, SSR/SSG natif, routing fichier |
| **React** | 19 | Bibliothèque UI avec hooks et context API |
| **TypeScript** | 5.x | Typage statique, détection d'erreurs au développement, meilleure maintenabilité |
| **Tailwind CSS** | 4.x | Classes utilitaires + CSS custom des maquettes pour cohérence visuelle |
| **ESLint** | 9.x | Linting et qualité de code |

## Architecture du projet

```
frontend/
├── app/                    # Pages (App Router Next.js)
│   ├── layout.tsx          # Layout racine (AuthProvider, ToastProvider, polices)
│   ├── page.tsx            # Redirection vers /dashboard
│   ├── globals.css         # Reset CSS, utilitaires, responsive
│   ├── abricot.css         # Design system porté des maquettes
│   ├── login/page.tsx      # Page de connexion
│   ├── register/page.tsx   # Page d'inscription
│   ├── dashboard/page.tsx  # Tableau de bord (3 vues : kanban, liste, projets)
│   ├── projects/
│   │   ├── page.tsx        # Liste des projets (grille)
│   │   └── [id]/page.tsx   # Détail projet (tâches, commentaires, contributeurs)
│   ├── profile/page.tsx    # Profil utilisateur + changement mot de passe
│   └── not-found.tsx       # Page 404
├── components/             # Composants réutilisables
│   ├── Navbar.tsx          # Barre de navigation avec menu avatar
│   ├── Footer.tsx          # Pied de page
│   ├── Modal.tsx           # Modale accessible (Escape, overlay click)
│   └── Toast.tsx           # Notifications toast (Provider + hook)
├── lib/                    # Logique métier et utilitaires
│   ├── api.ts              # Service API (toutes les routes backend)
│   ├── auth.tsx            # AuthProvider (contexte React, JWT, redirection)
│   ├── types.ts            # Types TypeScript partagés
│   └── utils.ts            # Utilitaires (formatDate, getInitials, labels)
├── .env.local              # Variables d'environnement
├── next.config.ts          # Configuration Next.js
├── tailwind.config.ts      # Configuration Tailwind
├── tsconfig.json           # Configuration TypeScript
└── package.json            # Dépendances
```

## Installation et lancement

### Prérequis
- Node.js 18+ et npm
- Le backend Abricot en fonctionnement sur `http://localhost:3000`

### Étapes

```bash
# 1. Installer les dépendances
cd frontend
npm install

# 2. Configurer l'URL du backend (par défaut : http://localhost:3000)
# Modifier .env.local si besoin :
# NEXT_PUBLIC_API_URL=http://localhost:3000

# 3. Lancer le serveur de développement
npm run dev
# → Ouvre http://localhost:3001 (ou le port disponible)

# 4. Build de production
npm run build
npm start
```

## Fonctionnalités implémentées

### Authentification et gestion des utilisateurs
- **Inscription** avec email, mot de passe et nom
- **Connexion** avec gestion d'erreurs (mauvais identifiants, compte inexistant)
- **Token JWT** stocké en `sessionStorage` (évite localStorage pour les données sensibles)
- **Protection des routes** : redirection automatique vers /login si non authentifié
- **Profil utilisateur** : modification du nom, email et mot de passe
- **Déconnexion** avec suppression du token

### Gestion des projets
- **Création** de projet avec nom, description
- **Liste des projets** en grille avec progression (% tâches terminées)
- **Détail du projet** avec liste des tâches, contributeurs
- **Modification/Suppression** de projet (réservé aux administrateurs)
- **Ajout/Retrait de contributeurs** par email

### Gestion des tâches
- **Création** de tâche avec titre, description, échéance, statut
- **Modification** de tâche (titre, description, échéance, statut)
- **Suppression** de tâche avec confirmation
- **Statuts** : À faire, En cours, Terminée
- **Filtrage** par statut et recherche textuelle

### Commentaires
- **Ajout** de commentaire sur une tâche (Enter pour envoyer)
- **Suppression** de ses propres commentaires
- **Accordéon** pour afficher/masquer les commentaires
- **Date relative** (il y a X jours)

### Tableau de bord (3 vues)
- **Vue Kanban** : colonnes À faire / En cours / Terminées
- **Vue Liste** : tâches assignées triées par priorité avec recherche
- **Vue Projets** : projets avec tâches assignées

### Accessibilité (WCAG 2.1 AA)
- **Balises ARIA** : `role`, `aria-label`, `aria-expanded`, `aria-current`, `aria-modal`, `aria-required`, `aria-live`
- **Navigation au clavier** : focus visible, modales fermables avec Escape, éléments interactifs accessibles au clavier
- **Skip link** : lien "Aller au contenu principal" en haut de page
- **Labels** : tous les champs de formulaire ont un `<label>` associé via `htmlFor`
- **Textes alternatifs** : SVG décoratifs marqués `aria-hidden="true"`
- **Contraste** : respect des ratios de contraste AA (texte sombre sur fond clair)
- **Rôles sémantiques** : `<nav>`, `<main>`, `<footer>`, `role="dialog"`, `role="tablist"`, `role="tab"`, `role="alert"`

### Design responsive
- **Desktop** : layout complet avec navbar centrée, grilles multi-colonnes
- **Tablette** (≤768px) : navbar simplifiée, grilles 1 colonne, toolbar tâches empilée
- **Mobile** (≤480px) : tâches en colonne, boutons pleine largeur

## Sécurité
- Token JWT en `sessionStorage` (non persisté entre sessions navigateur)
- Routes protégées côté client (middleware AuthProvider)
- Pas de données sensibles exposées dans l'URL
- Headers `Authorization: Bearer <token>` sur chaque requête API

## Qualité du code
- TypeScript strict avec 0 erreurs de compilation
- Composants fonctionnels React avec hooks
- Nommage explicite des fonctions et composants
- Séparation des responsabilités (api / auth / types / composants / pages)
- Code commenté quand nécessaire
- Gestion d'erreurs sur toutes les requêtes API avec feedback utilisateur (toasts)

## Points techniques notables
- **Context API** pour l'état d'authentification global (pas de prop drilling)
- **useCallback/useEffect** optimisés pour éviter les re-renders inutiles
- **Pattern de chargement** : spinner pendant le fetch, états vides gérés
- **Modales** : composant réutilisable avec gestion Escape et clic overlay
- **Formulaires** : validation côté client + gestion d'erreurs backend
