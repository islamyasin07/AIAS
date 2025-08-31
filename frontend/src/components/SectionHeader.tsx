import { Link } from "react-router-dom";

export default function SectionHeader({
  title,
  to,
  hint,
}: { title: string; to?: string; hint?: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "baseline",
        justifyContent: "space-between",
        padding: "0 14px",
        margin: "8px 0 12px",
      }}
    >
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 900 }}>{title}</div>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        {hint && <span style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>{hint}</span>}
        {to && (
          <Link to={to} style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 800 }}>
            عرض الكل →
          </Link>
        )}
      </div>
    </div>
  );
}
