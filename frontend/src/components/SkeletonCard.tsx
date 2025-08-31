export default function SkeletonCard() {
    return (
      <div
        style={{
          borderRadius: 16,
          padding: 18,
          background: "linear-gradient(180deg, #0f172a, #0e1826)",
          border: "1px solid rgba(255,255,255,.06)",
        }}
        className="skeleton"
      >
        <div style={{ height: 16, width: "50%", background: "rgba(255,255,255,.1)", borderRadius: 8 }} />
        <div style={{ height: 12, width: "70%", background: "rgba(255,255,255,.08)", borderRadius: 8, marginTop: 10 }} />
        <div style={{ height: 36, width: 110, background: "rgba(255,255,255,.08)", borderRadius: 10, marginTop: 14 }} />
        <style>{`
          .skeleton > div { animation: pulse 1.2s ease-in-out infinite; }
          @keyframes pulse { 0%,100%{opacity:.45} 50%{opacity:.9} }
        `}</style>
      </div>
    );
  }
  