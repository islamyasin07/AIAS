import { useEffect, useRef, useState } from "react";

export default function Preloader() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const enabled = localStorage.getItem("musicEnabled") === "1";
    if (enabled) {
      tryPlay();
    }
  
  }, []);

  async function tryPlay() {
    try {
      if (audioRef.current) {
        audioRef.current.muted = false;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch {
      setIsPlaying(false);
    }
  }

  async function toggleMusic() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem("musicEnabled", "0");
    } else {
      audioRef.current.muted = false;
      await audioRef.current.play();
      setIsPlaying(true);
      localStorage.setItem("musicEnabled", "1");
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <img
          src="/juicewrld.jpg"
          alt="Juice WRLD"
          style={{
            width: 96,
            height: 96,
            borderRadius: 9999,
            objectFit: "cover",
            boxShadow: "0 8px 20px rgba(0,0,0,.12)",
          }}
          onError={(e) =>
            ((e.target as HTMLImageElement).style.display = "none")
          }
        />

        {/**/}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "4px solid #e5e7eb",
            borderTopColor: "#111827",
            animation: "spin 1s linear infinite",
          }}
        />

        <p style={{ color: "#6b7280", fontSize: 14, letterSpacing: 0.3 }}>
          Loading…
        </p>

        {/* مشغل الصوت */}
        <audio ref={audioRef} src="/juicewrld.mp3" loop preload="auto" muted />

        {/* زر التحكم بالموسيقى */}
        <button
          onClick={toggleMusic}
          style={{
            marginTop: 8,
            padding: "8px 14px",
            borderRadius: 9999,
            background: isPlaying ? "#dc2626" : "#111827", 
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isPlaying ? "⏸️ Pause music" : "▶️ Play music"}
        </button>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
