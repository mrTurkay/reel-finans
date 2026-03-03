import { useEffect, useState } from "react";

export default function Toast({ message, onDone }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 2200);
    const t2 = setTimeout(() => onDone(), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1a1f2b",
        border: "1px solid rgba(214,158,46,0.3)",
        color: "#d69e2e",
        padding: "10px 20px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        zIndex: 9999,
        animation: fading
          ? "fadeOut 0.6s ease forwards"
          : "fadeInUp 0.3s ease forwards",
        pointerEvents: "none",
      }}
    >
      {message}
    </div>
  );
}
