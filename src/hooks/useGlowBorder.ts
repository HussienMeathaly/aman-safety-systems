import { useEffect, useRef, useCallback } from "react";

export function useGlowBorder<T extends HTMLElement>(accentColor = "hsl(0, 78%, 50%)") {
  const ref = useRef<T>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(-x, y);
    el.style.setProperty("--rotation", `${angle}rad`);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const glowStyle: React.CSSProperties = {
    "--rotation": "4.2rad",
    "--glow-accent": accentColor,
    borderColor: "transparent",
    backgroundImage: `linear-gradient(hsl(var(--card)), hsl(var(--card))), linear-gradient(calc(var(--rotation, 4.2rad)), var(--glow-accent) 0%, hsl(var(--card)) 30%, transparent 80%)`,
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
  } as React.CSSProperties;

  return { ref, glowStyle };
}
