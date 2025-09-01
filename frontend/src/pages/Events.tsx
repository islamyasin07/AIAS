import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import SkeletonCard from "../components/SkeletonCard";
import { card, grid, button } from "../ui/utils";
import { listEvents, registerToEvent, type EventItem } from "../services/eventsService";

const STATUSES = ["all", "published", "full", "completed"];

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<EventItem[]>([]);
  const [error, setError] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  async function fetchData() {
    try {
      setLoading(true);
      setError("");
      const res = await listEvents({
        search: q || undefined,
        status: status as any,
        from: from || undefined,
        to: to || undefined,
        page: 1,
        limit: 12,
      });
      const arr: EventItem[] = Array.isArray(res?.items) ? res.items : [];
      console.log("events api →", res);
      setItems(arr);
    } catch (e: any) {
      console.error("events fetch error:", e);
      setError(e.message || "Failed to load events");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchData, 250);
    return () => clearTimeout(t);
  }, [q, status, from, to]);

  const data = useMemo(() => items ?? [], [items]);

  const fmtDate = (d: any) => {
    if (!d) return "";
    if (typeof d === "object" && d._seconds) {
      const ms = d._seconds * 1000 + Math.floor((d._nanoseconds || 0) / 1e6);
      return new Date(ms).toLocaleString();
    }
    try {
      const dt = new Date(d);
      if (!isNaN(dt.getTime())) return dt.toLocaleString();
      return String(d);
    } catch {
      return String(d);
    }
  };

  const badge = (s?: string): React.CSSProperties => {
    const ok = s === "published";
    const full = s === "full";
    const done = s === "completed";
    const bg = full
      ? "rgba(239,68,68,.18)"
      : done
      ? "rgba(147,197,253,.18)"
      : ok
      ? "rgba(16,185,129,.18)"
      : "rgba(255,255,255,.06)";
    const col = full ? "#fecaca" : done ? "#bfdbfe" : ok ? "#a7f3d0" : "#e5e7eb";
    return {
      fontSize: 12,
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,.18)",
      background: bg,
      color: col,
      display: "inline-block",
    };
  };

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

  return (
    <div style={{ padding: "0 14px 24px" }}>
      <SectionHeader title="Events" hint="سجّل وشارك" />

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "space-between",
          margin: "0 14px 14px",
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن فعالية…"
            style={field}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={selectField}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={selectField}
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={selectField}
          />
        </div>
        <div
          style={{
            color: "rgba(255,255,255,.8)",
            fontSize: 13,
            alignSelf: "center",
          }}
        >
          المجموع: {loading ? "…" : data.length}
        </div>
      </div>

      {error && <p style={{ color: "#fecaca", padding: "0 14px 10px" }}>{error}</p>}

      <div style={grid(280, 16)}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : data.length === 0
          ? (
            <div style={card(false)}>
              <div style={{ color: "#fff" }}>لا توجد فعاليات حالياً.</div>
            </div>
          )
          : data.map((ev, i) => {
              const title = (ev as any)?.title ?? `Event #${i + 1}`;
              const date = (ev as any)?.date ?? "";
              const location = (ev as any)?.location ?? "";
              const statusVal = (ev as any)?.status ?? "published";
              const capacity =
                typeof (ev as any)?.capacity === "number" ? (ev as any).capacity : undefined;
              const url = (ev as any)?.url;

              return (
                <article
                  key={(ev as any)?.id ?? i}
                  style={card(true, "dark")}
                  className="hoverable"
                >
                  <div style={{ color: "#fff", fontWeight: 900, fontSize: 18 }}>
                    {title}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,.78)",
                      marginTop: 6,
                      fontSize: 13,
                    }}
                  >
                    {fmtDate(date)} {location ? `• ${location}` : ""}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      marginTop: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={badge(statusVal)}>
                      {String(statusVal).toUpperCase()}
                    </span>
                    {typeof capacity === "number" && (
                      <span style={{ color: "rgba(255,255,255,.7)", fontSize: 12 }}>
                        Capacity: {capacity}
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: 12 }}>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        style={button("ghost") as React.CSSProperties}
                      >
                        تفاصيل
                      </a>
                    ) : (
                      <button
                        style={button("ghost")}
                        onClick={async () => {
                          try {
                            setMsg("");
                            const res = await registerToEvent((ev as any)?.id);
                            if (res.ok) {
                              setMsg("✅ تم تسجيلك في الفعالية بنجاح");
                            } else if (res.waitlisted) {
                              setMsg("ℹ️ الفعالية ممتلئة، أُضيفت لقائمة الانتظار");
                            }
                          } catch (e: any) {
                            const msg = e?.response?.data?.error || e?.response?.data?.message || e.message;
                            if (msg === "ALREADY_REGISTERED") {
                              setMsg("⚠️ أنت مسجّل بالفعل في هذه الفعالية");
                            } else if (msg === "EVENT_NOT_OPEN") {
                              setMsg("❌ التسجيل لهذه الفعالية مغلق");
                            } else if (msg === "EVENT_NOT_FOUND") {
                              setMsg("❌ الفعالية غير موجودة");
                            } else {
                              setMsg("❌ فشل التسجيل: " + msg);
                            }
                          }
                        }}
                      >
                        {statusVal === "full" ? "انضم للاحتياط" : "سجّل الآن"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
      </div>

      {msg && (
        <div style={{ color: "#fff", marginTop: 20, fontSize: 14 }}>
          {msg}
        </div>
      )}
    </div>
  );
}
