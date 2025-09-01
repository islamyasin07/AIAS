import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import SkeletonCard from "../components/SkeletonCard";
import { card, grid, button } from "../ui/utils";
import { listMembers, type Member } from "../services/membersService";

export default function Members() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Member[]>([]);
  const [error, setError] = useState<string>("");

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<
    "all" | "approved" | "pending" | "rejected"
  >("all");
  const [year, setYear] = useState<string>("All");

  async function fetchData() {
    try {
      setLoading(true);
      setError("");
      const res = await listMembers({
        search: q || undefined,
        status: status === "all" ? undefined : status,
        year: year === "All" ? undefined : year,
        page: 1,
        limit: 12,
      });
      setItems(res.items || []);
    } catch (e: any) {
      setError(e.message || "Failed to load members");
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
  }, [q, status, year]);

  const filtered = useMemo(() => items, [items]);

  const badge = (
    status: "approved" | "pending" | "rejected"
  ): React.CSSProperties => {
    let color = "#e5e7eb";
    let bg = "rgba(255,255,255,.06)";

    if (status === "approved") {
      color = "#a7f3d0";
      bg = "rgba(16,185,129,.18)";
    }
    if (status === "pending") {
      color = "#fef08a";
      bg = "rgba(250,204,21,.18)";
    }
    if (status === "rejected") {
      color = "#fecaca";
      bg = "rgba(239,68,68,.18)";
    }

    return {
      fontSize: 12,
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,.18)",
      color,
      background: bg,
      display: "inline-block",
    };
  };

  return (
    <div style={{ padding: "0 14px 24px" }}>
      <SectionHeader title="Members" hint="إدارة/عرض الأعضاء" />

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "space-between",
          margin: "0 14px 12px",
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            placeholder="ابحث باسم العضو…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={input}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            style={inputSel}
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={inputSel}
          >
            {["All", "1st", "2nd", "3rd", "4th"].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            color: "rgba(255,255,255,.8)",
            fontSize: 13,
            alignSelf: "center",
          }}
        >
          المجموع: {loading ? "…" : filtered.length}
        </div>
      </div>

      {error && (
        <p style={{ color: "#fecaca", padding: "0 14px 10px" }}>{error}</p>
      )}

      <div style={grid(260, 16)}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((m) => (
              <article
                key={m.id}
                style={card(true, "dark")}
                className="hoverable"
              >
                <div
                  style={{ color: "#fff", fontWeight: 900, fontSize: 18 }}
                >
                  {m.full_name}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,.78)",
                    marginTop: 6,
                    fontSize: 13,
                  }}
                >
                  Year: {m.year_of_study}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 12,
                  }}
                >
                  {m.membership_status && (
                    <span style={badge(m.membership_status as any)}>
                      {m.membership_status.charAt(0).toUpperCase() +
                        m.membership_status.slice(1)}
                    </span>
                  )}
                  <button style={button("ghost")}>عرض الملف</button>
                </div>
              </article>
            ))}
      </div>
    </div>
  );
}

const commonField: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.14)",
  background: "rgba(255,255,255,.06)",
  color: "#fff",
  outline: "none",
};
const input = commonField;
const inputSel = { ...commonField, minWidth: 140 } as React.CSSProperties;
