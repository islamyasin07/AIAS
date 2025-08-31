import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmailPassword } from "../services/authService"; 
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { doLogin } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await loginWithEmailPassword(email, password);
      doLogin(res);                       
      console.log("TOKEN:", res.token);   
      navigate("/");
    } catch (err: any) {
      console.error("Login FAIL:", err);
      setError(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 360,
          padding: 24,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          background: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,.06)",
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          AIAS Login
        </h2>

        {error && (
          <p style={{ color: "#dc2626", marginBottom: 8, fontSize: 14 }}>
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 12,
            border: "1px solid #d1d5db",
            borderRadius: 6,
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 16,
            border: "1px solid #d1d5db",
            borderRadius: 6,
          }}
        />

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            background: submitting ? "#1d4ed8" : "#2563eb",
            color: "#fff",
            padding: "10px",
            borderRadius: 6,
            border: "none",
            cursor: submitting ? "not-allowed" : "pointer",
            fontWeight: 600,
            opacity: submitting ? 0.85 : 1,
          }}
        >
          {submitting ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
