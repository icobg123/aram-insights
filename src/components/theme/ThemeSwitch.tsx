"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ThemeSwitchSkeleton } from "./ThemeSwitchSkeleton";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

const ICON_SIZE = 20;

interface ThemeSwitchProps {
  className?: string;
}

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ThemeSwitchSkeleton />;
  }

  const isLightTheme = resolvedTheme === "light";

  const handleThemeToggle = () => {
    setTheme(isLightTheme ? "forest" : "light");
  };

  return (
    <label
      className={cn("btn btn-circle btn-ghost swap swap-rotate", className)}
    >
      {/* this hidden checkbox controls the state */}
      <input
        type="checkbox"
        checked={isLightTheme}
        onChange={handleThemeToggle}
        aria-label="Toggle theme"
      />

      <Sun size={ICON_SIZE} className="swap-on" />

      {/* moon icon */}
      <Moon size={ICON_SIZE} className="swap-off" />
    </label>
  );
}
