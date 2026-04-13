import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Configuration Vitest pour Abricot
 * - Environnement jsdom pour tester les composants React
 * - Alias @ vers src/ (cohérent avec tsconfig)
 * - Setup file pour étendre Jest DOM matchers
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      exclude: [
        "node_modules/**",
        "tests/**",
        ".next/**",
        "**/*.config.*",
        "**/*.d.ts",
        "src/app/layout.tsx",
        "next-env.d.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
