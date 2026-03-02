export default function VerdictBadge({ avantajli, badgeColor, badgeText }) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${avantajli ? "rgba(72,187,120,0.08)" : "rgba(252,129,129,0.08)"}, #161b22)`,
        border: `1px solid ${avantajli ? "rgba(72,187,120,0.3)" : "rgba(252,129,129,0.3)"}`,
        borderRadius: 12,
        padding: "14px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: badgeColor }}>
        {badgeText}
      </div>
      <div style={{ fontSize: 11, color: "#718096", marginTop: 4 }}>
        Nominal toplam ödeme farkı (aynı tutar, aynı vade)
      </div>
    </div>
  );
}
