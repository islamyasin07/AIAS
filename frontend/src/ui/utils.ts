import type React from "react";
import { color, font, space, radius, shadow, layout } from "./tokens";
export const sx = (...styles: Array<React.CSSProperties | undefined | false>) =>
  Object.assign({}, ...styles);

export const container = (padY: number = space.lg): React.CSSProperties => ({
  maxWidth: layout.container,
  margin: "0 auto",
  padding: `${padY}px ${space.md}px`,
});


export const heading = (size: keyof typeof font.size = "2xl"): React.CSSProperties => ({
  fontFamily: font.family,
  fontWeight: font.weight.black,
  fontSize: font.size[size],
  lineHeight: font.leading.tight,
  color: color.text,
});

export const paragraph: React.CSSProperties = {
  fontFamily: font.family,
  fontSize: font.size.base,
  lineHeight: font.leading.normal,
  color: color.textMuted,
};


type CardVariant = "dark" | "surface";


export const card = (
  hoverable: boolean = true,
  variant: CardVariant = "dark"
): React.CSSProperties => {
  const variants: Record<CardVariant, React.CSSProperties> = {
    dark: {
      background: "linear-gradient(180deg, #0f172a, #0e1826)", // داكن ناعم
      border: "1px solid rgba(255,255,255,.06)",
      color: "#fff",
    },
    surface: {
      background: color.surface,
      border: `1px solid ${color.border}`,
      color: color.text,
    },
  };

  return {
    ...variants[variant],
    borderRadius: radius.lg,
    padding: space.md,
    boxShadow: "0 8px 22px rgba(0,0,0,.25)",
    transition: "transform .18s ease, box-shadow .18s ease, background .2s ease",
    ...(hoverable ? { willChange: "transform", cursor: "default" } : {}),
  };
};


type BtnVariant = "primary" | "secondary" | "ghost" | "onDark" | "accent";
export const button = (variant: BtnVariant = "primary"): React.CSSProperties => {
  const base: React.CSSProperties = {
    display: "inline-block",
    padding: "10px 14px",
    borderRadius: radius.md,
    fontFamily: font.family,
    fontWeight: font.weight.bold,
    textDecoration: "none",
    transition: "transform .05s ease, opacity .2s ease, background .2s ease",
    border: "none",
    cursor: "pointer",
  };

  const variants: Record<BtnVariant, React.CSSProperties> = {
    primary:   { background: color.primary,   color: "#fff" },
    secondary: { background: color.secondary, color: "#fff" },
    ghost:     { background: "rgba(255,255,255,.10)", color: "#fff", border: "1px solid rgba(255,255,255,.25)" }, // مناسب للداكن
    onDark:    { background: "#fff",          color: color.secondary },
    accent:    { background: color.accent,    color: "#111" },
  };

  return { ...base, ...variants[variant] };
};


export const navbar: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  background: color.secondary,
  color: "#fff",
  padding: "12px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: font.family,
  borderBottom: "1px solid rgba(255,255,255,.08)",
  boxShadow: "0 6px 18px rgba(0,0,0,.25)",
  backdropFilter: "blur(4px)",
};

export const navLink: React.CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: font.weight.medium,
  padding: "6px 8px",
  borderRadius: radius.sm,
};


export const heroWrap: React.CSSProperties = {
  background: "linear-gradient(135deg, #0f172a, #1e293b)", // أجمل على الداكن
  color: "#fff",
  padding: "72px 0",
  position: "relative",
  overflow: "hidden",
  boxShadow: shadow.md,
};

export const heroTitle: React.CSSProperties = {
  ...heading("3xl"),
  color: "#fff",
};

export const heroText: React.CSSProperties = {
  ...paragraph,
  color: "rgba(255,255,255,.9)",
};


export const grid = (min = 250, gap = space.md): React.CSSProperties => ({
  display: "grid",
  gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
  gap,
  alignItems: "stretch",
});

export const tightGridWrap: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 0,
  borderRadius: radius.lg,
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,.08)",
};

export const tightCell: React.CSSProperties = {
  background: "linear-gradient(180deg, #0f172a, #0e1826)",
  padding: space.md,
  borderRight: "1px solid rgba(255,255,255,.06)",
  borderBottom: "1px solid rgba(255,255,255,.06)",
  color: "#fff",
};
