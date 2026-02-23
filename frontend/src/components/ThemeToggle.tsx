"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const THEME_KEY = "vartax-theme";

type ThemeMode = "light" | "dark";

const ThemeToggle = () => {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState<ThemeMode>("light");

  React.useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const resolvedTheme: ThemeMode = storedTheme
      ? storedTheme
      : systemPrefersDark
        ? "dark"
        : "light";

    root.classList.toggle("dark", resolvedTheme === "dark");
    setTheme(resolvedTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem(THEME_KEY, nextTheme);
    setTheme(nextTheme);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="h-9 w-9 rounded-md bg-card hover:bg-accent"
    >
      {!mounted ? (
        <Sun className="h-4 w-4" />
      ) : theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ThemeToggle;
