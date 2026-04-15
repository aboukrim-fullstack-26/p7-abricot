"use client";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Page introuvable</h2>
      <p className={styles.description}>
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/dashboard" className={styles.link}>
        Retour au tableau de bord
      </Link>
    </div>
  );
}
