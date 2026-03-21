"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useModeAnimation,
  ThemeAnimationType,
} from "react-theme-switch-animation";

const ThemeToggle = () => {
  const [mounted, setMounted] = React.useState(false);

  // Using the new animation hook with blur circle effect
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
    animationType: ThemeAnimationType.BLUR_CIRCLE,
    duration: 750,
    blurAmount: 3,
    globalClassName: "dark",
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleSwitchTheme}
      aria-label="Toggle theme"
      className="h-9 w-9 rounded-md bg-card hover:bg-accent"
    >
      {!mounted ? (
        <Sun className="h-4 w-4" />
      ) : isDarkMode ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ThemeToggle;
