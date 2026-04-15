"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useCreateTask } from "@/hooks/use-queries";
import styles from "./AiCreateTaskModal.module.css";

interface AiCreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export default function AiCreateTaskModal({ isOpen, onClose, projectId, projectName }: AiCreateTaskModalProps) {
  const { showToast } = useToast();
  const createTask = useCreateTask(projectId);

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTasks, setAiTasks] = useState<{ title: string; description: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  function handleClose() {
    setAiTasks([]); setAiPrompt(""); onClose();
  }

  async function handleGenerate() {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));

    const prompt = aiPrompt.toLowerCase();
    const taskBanks: Record<string, { title: string; description: string }[]> = {
      auth: [
        { title: "Connexion utilisateur", description: "Implémenter le formulaire de connexion avec validation email/mot de passe." },
        { title: "Inscription", description: "Créer le formulaire d'inscription avec vérification des champs obligatoires." },
        { title: "Réinitialisation mot de passe", description: "Ajouter un flux de récupération de mot de passe par email." },
        { title: "Gestion des sessions JWT", description: "Mettre en place la gestion des tokens JWT avec refresh automatique." },
      ],
      api: [
        { title: "Endpoints CRUD", description: "Développer les endpoints Create, Read, Update, Delete pour les ressources principales." },
        { title: "Validation des requêtes", description: "Ajouter un middleware de validation des données entrantes avec des schémas." },
        { title: "Gestion des erreurs API", description: "Centraliser le traitement des erreurs avec des codes HTTP appropriés." },
        { title: "Documentation Swagger", description: "Générer la documentation interactive de l'API avec Swagger/OpenAPI." },
      ],
      front: [
        { title: "Intégration maquettes", description: "Convertir les maquettes Figma en composants React réutilisables." },
        { title: "Responsive design", description: "Adapter l'interface pour mobile, tablette et desktop avec des media queries." },
        { title: "Système de navigation", description: "Mettre en place le routage avec des transitions fluides entre les pages." },
        { title: "Formulaires interactifs", description: "Créer les formulaires avec validation en temps réel et messages d'erreur." },
      ],
      test: [
        { title: "Tests unitaires", description: "Écrire les tests unitaires pour les fonctions et composants principaux." },
        { title: "Tests d'intégration", description: "Vérifier le bon fonctionnement des flux complets (API + base de données)." },
        { title: "Tests end-to-end", description: "Automatiser les parcours utilisateurs critiques avec Cypress ou Playwright." },
      ],
      deploy: [
        { title: "Configuration Docker", description: "Créer les Dockerfiles et le docker-compose pour l'environnement de développement." },
        { title: "Pipeline CI/CD", description: "Configurer l'intégration continue avec tests automatisés et déploiement." },
        { title: "Mise en production", description: "Déployer l'application sur l'environnement de production avec monitoring." },
      ],
      default: [
        { title: `Analyse des besoins — ${projectName}`, description: "Recueillir et documenter les exigences fonctionnelles du projet." },
        { title: "Conception technique", description: "Rédiger le document d'architecture technique et les choix technologiques." },
        { title: "Développement fonctionnalité principale", description: "Implémenter la fonctionnalité cœur décrite dans les spécifications." },
        { title: "Revue de code", description: "Organiser une revue de code en pair programming pour valider la qualité." },
        { title: "Livraison et documentation", description: "Préparer les livrables finaux avec la documentation utilisateur." },
      ],
    };

    let selected: { title: string; description: string }[];
    if (prompt.includes("auth") || prompt.includes("connexion") || prompt.includes("login") || prompt.includes("inscription")) selected = taskBanks.auth;
    else if (prompt.includes("api") || prompt.includes("endpoint") || prompt.includes("backend") || prompt.includes("rest")) selected = taskBanks.api;
    else if (prompt.includes("front") || prompt.includes("interface") || prompt.includes("ui") || prompt.includes("maquette") || prompt.includes("design")) selected = taskBanks.front;
    else if (prompt.includes("test") || prompt.includes("qualité") || prompt.includes("qa")) selected = taskBanks.test;
    else if (prompt.includes("deploy") || prompt.includes("docker") || prompt.includes("ci") || prompt.includes("prod") || prompt.includes("devops")) selected = taskBanks.deploy;
    else selected = taskBanks.default;

    const shuffled = [...selected].sort(() => Math.random() - 0.5);
    setAiTasks(shuffled.slice(0, Math.min(shuffled.length, 3 + Math.floor(Math.random() * 3))));
    setAiLoading(false);
  }

  async function handleAddTasks() {
    try {
      for (const t of aiTasks) {
        await createTask.mutateAsync({ title: t.title, description: t.description });
      }
      showToast(`${aiTasks.length} tâche(s) ajoutée(s)`);
      handleClose();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Erreur", "error");
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay is-open"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Création de tâches par IA"
    >
      <div className={`modal ${styles.modal}`}>
        <div className={`modal__header ${styles.header}`}>
          <div className={styles.headerInner}>
            <svg viewBox="0 0 20 20" fill="none" width="22" height="22" aria-hidden="true">
              <path d="M10 2l2 5 5 1.5-5 2L10 16l-2-5.5-5-2L8 7 10 2z" fill="#D3580B"/>
            </svg>
            <h2 className={styles.headerTitle}>Créer des tâches avec l&apos;IA</h2>
          </div>
          <button className="btn-close" onClick={handleClose} aria-label="Fermer">
            <svg viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className={styles.body}>
          {aiTasks.length === 0 && !aiLoading && (
            <p className={styles.emptyState}>
              Décrivez les tâches que vous souhaitez créer et l&apos;IA les génèrera pour vous.
            </p>
          )}
          {aiLoading && (
            <div className={styles.loadingState}>
              <div className="spinner" />
              <p className={styles.loadingText}>Génération en cours...</p>
            </div>
          )}
          {aiTasks.length > 0 && (
            <div>
              <div className={styles.resultHeader}>
                <svg viewBox="0 0 20 20" fill="none" width="18" height="18" aria-hidden="true">
                  <path d="M10 2l2 5 5 1.5-5 2L10 16l-2-5.5-5-2L8 7 10 2z" fill="#D3580B"/>
                </svg>
                <h3 className={styles.resultTitle}>Vos tâches...</h3>
              </div>
              {aiTasks.map((t, i) => (
                <div key={i} className={styles.taskItem}>
                  <div className={styles.taskItemTitle}>{t.title}</div>
                  <div className={styles.taskItemDesc}>{t.description}</div>
                  <button
                    className={styles.taskItemDelete}
                    onClick={() => setAiTasks((prev) => prev.filter((_, j) => j !== i))}
                  >
                    ✕ Supprimer
                  </button>
                </div>
              ))}
              <div className={styles.addAllWrapper}>
                <button className="btn btn--primary" onClick={handleAddTasks} disabled={createTask.isPending}>
                  {createTask.isPending ? "Ajout..." : `+ Ajouter les ${aiTasks.length} tâche(s)`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.inputBar}>
            <input
              type="text"
              className={styles.promptInput}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Décrivez les tâches que vous souhaitez ajouter..."
              onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
              aria-label="Prompt IA"
              disabled={aiLoading}
            />
            <button
              onClick={handleGenerate}
              disabled={!aiPrompt.trim() || aiLoading}
              className={`${styles.sendBtn} ${aiPrompt.trim() && !aiLoading ? styles["sendBtn--active"] : styles["sendBtn--inactive"]}`}
              aria-label="Envoyer"
            >
              <svg viewBox="0 0 14 14" fill="none" width="16" height="16" aria-hidden="true">
                <path d="M7 12V2M3 6l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
