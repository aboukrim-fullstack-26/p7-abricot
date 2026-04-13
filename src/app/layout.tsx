import type { Metadata } from "next";
import "./globals.css";
import "./abricot.css";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/components/ui/Toast";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Abricot — Gestion de projet collaboratif",
  description: "SaaS de gestion de projet innovant pour freelances",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Aller au contenu principal</a>
        <Providers>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
