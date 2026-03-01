"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const DARK_DEFAULTS = {
  text: "#e2e8f0",
  textSecondary: "#94a3b8",
  bgSubtle: "#1e293b",
  border: "#334155",
  nodeStroke: "#334155",
};

export function useThemeColors() {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState(DARK_DEFAULTS);

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    setColors({
      text: style.getPropertyValue("--viz-text").trim() || DARK_DEFAULTS.text,
      textSecondary:
        style.getPropertyValue("--viz-text-secondary").trim() ||
        DARK_DEFAULTS.textSecondary,
      bgSubtle:
        style.getPropertyValue("--viz-bg-subtle").trim() ||
        DARK_DEFAULTS.bgSubtle,
      border:
        style.getPropertyValue("--viz-border").trim() || DARK_DEFAULTS.border,
      nodeStroke:
        style.getPropertyValue("--viz-node-stroke").trim() ||
        DARK_DEFAULTS.nodeStroke,
    });
  }, [resolvedTheme]);

  return colors;
}
