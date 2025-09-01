import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import { font } from "../ui/tokens";
import { button } from "../ui/utils";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div style={page}>
      <div style={bgGrad} />
      <div style={{ ...blob, top: -80, left: -40, background: "rgba(59,130,246,.16)" }} />
      <div style={{ ...blob, bottom: -90, right: -60, background: "rgba(249,115,22,.14)" }} />

      <section style={{ padding: "44px 14px 18px" }}>
        <div style={heroCard} className="fade-in-up">
          <div style={heroGrid}>
            <div style={{ display: "grid", gap: 14 }}>
              <h1 style={heroTitle}>AIAS – An-Najah Chapter</h1>
              <p style={heroSub}>منصّة طلاب العمارة — موارد، فعاليات، مجتمع، وفرص.</p>

              {user ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 12,
                    padding: 12,
                    background: "rgba(255,255,255,.08)",
                    borderRadius: 12,
                  }}
                >
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="Profile"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #2563eb",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>
                      {user.full_name || user.email}
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)" }}>
                      تم تسجيل الدخول
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    تسجيل خروج
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link to="/events" style={btnAccent}>
                    استكشف الفعاليات
                  </Link>
                  <Link to="/resources" style={btnGhostDark}>
                    تصفّح الموارد
                  </Link>
                </div>
              )}
            </div>

            <div style={heroMedia}>
              <div className="hero-pics">
                <img className="pic p1" src="/juicewrld.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{css}</style>
    </div>
  );
}
function Header({ title, to }: { title: string; to: string }) {
  return (
    <div style={row}>
      <h2 style={listH}>{title}</h2>
      <Link to={to} style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 800 }}>
        عرض الكل →
      </Link>
    </div>
  );
}

const page: CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  background: "linear-gradient(180deg,#0b1220 0%,#0f172a 60%,#0a0f1c 100%)",
};
const bgGrad: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background: "radial-gradient(800px 400px at 15% -10%,rgba(255,255,255,.06),transparent 60%)",
};
const blob: CSSProperties = { position: "absolute", width: 360, height: 360, borderRadius: "50%", filter: "blur(70px)" };

const heroCard: CSSProperties = {
  margin: "0 auto",
  maxWidth: 1100,
  padding: 28,
  borderRadius: 20,
  background: "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04))",
  border: "1px solid rgba(255,255,255,.12)",
  boxShadow: "0 30px 80px rgba(0,0,0,.35)",
  backdropFilter: "blur(8px)",
};
const heroGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr",
  gap: 24,
  alignItems: "center",
};
const heroTitle: CSSProperties = { fontFamily: font.family, fontWeight: font.weight.black, fontSize: 38, color: "#fff" };
const heroSub: CSSProperties = { color: "rgba(255,255,255,.85)", fontSize: 16 };
const heroMedia: CSSProperties = {
  position: "relative",
  height: 240,
  borderRadius: 16,
  overflow: "hidden",
  border: "none",
  background: "transparent",
};

const row: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 14px",
  margin: "8px 0 10px",
};
const listH: CSSProperties = { color: "#fff", fontSize: 20, fontWeight: 900, margin: 0 };

const btnAccent = { ...button("accent"), boxShadow: "0 6px 20px rgba(249,115,22,.35)" };
const btnGhostDark = { ...button("onDark"), border: "1px solid rgba(255,255,255,.28)" };

