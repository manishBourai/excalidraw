"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <Button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      size="icon"
      title="Toggle theme"
      type="button"
      variant="secondary"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
