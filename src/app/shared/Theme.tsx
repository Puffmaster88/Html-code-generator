"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "violet" | "system";
const THEMES: Theme[] = ["light", "dark", "violet", "system"];

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

function getSystem(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("theme") as Theme | null;
      if (fromUrl && THEMES.includes(fromUrl)) {
        setTheme(fromUrl);
        return;
      }
      const saved = localStorage.getItem("theme") as Theme | null;
      if (saved && THEMES.includes(saved)) setTheme(saved);
      else setTheme(getSystem());
    } catch {}
  }, []);

  const effective = useMemo(() => (theme === "system" ? getSystem() : theme), [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", effective);
    try { localStorage.setItem("theme", theme); } catch {}
  }, [effective, theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handle = () => document.documentElement.setAttribute("data-theme", getSystem());
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "j" || e.key.toLowerCase() === "t")) {
        e.preventDefault();
        setTheme(t => THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme(t => THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]) }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
