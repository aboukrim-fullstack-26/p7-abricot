"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProjectCard from "@/components/projects/ProjectCard";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import { useAuth } from "@/context/auth-context";
import { useProjects } from "@/hooks/use-queries";

export default function ProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: projects = [], isLoading } = useProjects();
  const [showModal, setShowModal] = useState(false);

  if (authLoading) return <div className="spinner" />;
  if (!user) return null;

  return (
    <>
      <Header />
      <main className="main-content" id="main-content">
        <div className="page-header">
          <div className="page-header__left">
            <h1 className="page-header__title">Mes projets</h1>
            <p className="page-header__subtitle">Gérez vos projets</p>
          </div>
          <div className="page-header__actions">
            <button className="btn btn--primary btn--icon" onClick={() => setShowModal(true)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Créer un projet
            </button>
          </div>
        </div>

        {isLoading ? <div className="spinner" /> : (
          <div className="projects-grid">
            {projects.length === 0 && (
              <p style={{ color: "#9CA3AF", gridColumn: "1/-1", textAlign: "center", padding: 40 }}>
                Aucun projet. Créez votre premier projet !
              </p>
            )}
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </main>
      <Footer />

      <CreateProjectModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
