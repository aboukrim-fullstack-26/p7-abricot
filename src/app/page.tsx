"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Page racine — redirige vers le tableau de bord */
export default function Home() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard"); }, [router]);
  return <div className="spinner" />;
}
