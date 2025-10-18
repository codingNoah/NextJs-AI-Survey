"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme; // user's choice
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  // 1) Don’t touch window/localStorage on the server
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // 2) Hydrate from localStorage after mount (client only)
  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(storageKey) as Theme | null;
        if (stored) setTheme(stored);
      }
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  // 3) Compute the *effective* theme (resolves "system" to "light"/"dark")
  const effectiveTheme = useMemo<Exclude<Theme, "system">>(() => {
    if (typeof window === "undefined") {
      // during SSR just assume light to avoid class mismatch
      return "light";
    }
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }, [theme]);

  // 4) Apply the class to <html> and react to system changes if theme === "system"
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(effectiveTheme);

    if (theme !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const sys = mql.matches ? "dark" : "light";
      root.classList.remove("light", "dark");
      root.classList.add(sys);
    };
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [theme, effectiveTheme]);

  // 5) Persist the chosen theme (not the resolved one) after mount
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      /* ignore */
    }
  }, [theme, storageKey, mounted]);

  const value = useMemo(
    () => ({
      theme,
      setTheme, // setter already updates state; persistence handled in effect
    }),
    [theme]
  );

  // Optional: avoid flash/hydration mismatch
  if (!mounted) return null;

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeProviderContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
