const btnStyle = {
  flex: 1,
  background: "rgba(214,158,46,0.08)",
  border: "1px solid rgba(214,158,46,0.2)",
  borderRadius: 8,
  padding: "10px 14px",
  color: "#d69e2e",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
};

export default function ShareButtons({ onShareLink, onShareImage }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button style={btnStyle} onClick={onShareLink}>
        🔗 Link Paylaş
      </button>
      <button style={btnStyle} onClick={onShareImage}>
        📸 Görsel Paylaş
      </button>
    </div>
  );
}
