import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import SkeletonCard from "../components/SkeletonCard";
import { card, grid, button } from "../ui/utils";
import { listResources, type Resource } from "../services/resourcesService";

const TYPES = ["all", "video", "document", "course", "link"];
const DEFAULT_CATS = ["All"];

export default function Resources() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Resource[]>([]);
  const [error, setError] = useState<string>("");

  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [cat, setCat] = useState<string>("All");
  const [cats, setCats] = useState<string[]>(DEFAULT_CATS);

  async function fetchData() {
    try {
      setLoading(true); setError("");
      const res = await listResources({
        search: q || undefined,
        type,
        category: cat,
        page: 1,
        limit: 12,
      });
      setItems(res.items || []);

      const uniq = Array.from(new Set(res.items?.map(r => r.category).filter(Boolean))) as string[];
      setCats(["All", ...uniq]);
    } catch (e:any) {
      setError(e.message || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ fetchData();  }, []);
  useEffect(()=>{
    const t = setTimeout(fetchData, 250); 
    return ()=>clearTimeout(t);
 
  }, [q, type, cat]);

  const data = useMemo(()=> items, [items]);

  const chip: React.CSSProperties = {
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.18)",
    background: "rgba(255,255,255,.06)",
    color: "#fff",
    display: "inline-block",
  };

  return (
    <div style={{ padding: "0 14px 24px" }}>
      <SectionHeader title="Resources" hint="ابحث وتصفّح حسب النوع والتصنيف" />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between", margin: "0 14px 14px" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="ابحث عن مورد…"
            style={field}
          />
          <select value={type} onChange={(e)=>setType(e.target.value)} style={selectField}>
            {TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
          </select>
          <select value={cat} onChange={(e)=>setCat(e.target.value)} style={selectField}>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ color: "rgba(255,255,255,.8)", fontSize: 13, alignSelf: "center" }}>
          المجموع: {loading ? "…" : data.length}
        </div>
      </div>

      {error && <p style={{color:"#fecaca", padding:"0 14px 10px"}}>{error}</p>}

      <div style={grid(260, 16)}>
        {loading
          ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
          : data.map((r) => (
              <article key={r.id} style={card(true, "dark")} className="hoverable">
                <div style={{ color: "#fff", fontWeight: 900, fontSize: 18, marginBottom: 6 }}>
                  {r.title}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={chip}>{(r.type || "link").toUpperCase()}</span>
                  {r.category && <span style={chip}>{r.category}</span>}
                </div>

                <div style={{ marginTop: 12 }}>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" style={button("ghost") as React.CSSProperties}>
                      تصفّح
                    </a>
                  ) : (
                    <button disabled style={button("ghost")}>لا يوجد رابط</button>
                  )}
                </div>
              </article>
            ))}
      </div>
    </div>
  );
}

const baseField: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.14)",
  background: "rgba(255,255,255,.06)",
  color: "#fff",
  outline: "none",
};

const field = baseField;
const selectField = { ...baseField, minWidth: 140 } as React.CSSProperties;
