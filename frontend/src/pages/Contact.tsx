import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { card, button } from "../ui/utils";

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 600);
  }

  return (
    <div style={{ padding: "0 14px 24px" }}>
      <SectionHeader title="Contact" hint="راسل فريق AIAS" />
      <form onSubmit={submit} style={card(false, "dark")}>
        <div style={{ display: "grid", gap: 12 }}>
          <input placeholder="الاسم الكامل" required style={input} />
          <input placeholder="البريد الإلكتروني" type="email" required style={input} />
          <textarea placeholder="رسالتك…" rows={5} required style={{ ...input, resize: "vertical" }} />
          <button type="submit" disabled={submitting} style={button("ghost")}>
            {submitting ? "جارٍ الإرسال…" : "إرسال"}
          </button>
        </div>
      </form>
    </div>
  );
}

const input: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.14)",
  background: "rgba(255,255,255,.06)",
  color: "#fff",
  outline: "none",
};
