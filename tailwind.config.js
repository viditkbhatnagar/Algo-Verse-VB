/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "#0a0a0a",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
        ring: "var(--ring)",
        viz: {
          default: "#475569",
          active: "#6366f1",
          comparing: "#f59e0b",
          swapping: "#ef4444",
          completed: "#22c55e",
          highlighted: "#22d3ee",
          "neuron-input": "#3b82f6",
          "neuron-hidden": "#8b5cf6",
          "neuron-output": "#f97316",
          gradient: "#ec4899",
          centroid: "#f97316",
          boundary: "#22d3ee",
          token: "#6366f1",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
