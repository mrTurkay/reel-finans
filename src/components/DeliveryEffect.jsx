export default function DeliveryEffect({ results, krediTeslimAyi, yillikEnflasyon, krediFiyat, fmt }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(214,158,46,0.06), #161b22)",
        border: "1px solid rgba(214,158,46,0.2)",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#d69e2e",
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        📅 Kredi Teslim Tarihi Etkisi ({krediTeslimAyi}. ay)
      </div>
      <div style={{ fontSize: 12, color: "#a0aec0", lineHeight: 1.7 }}>
        Satıcıya {krediTeslimAyi}. ayda ödeme yapılıyor. Bu sürede %
        {yillikEnflasyon} yıllık enflasyonla, {fmt(krediFiyat)} ₺'nin
        reel değeri{" "}
        <strong style={{ color: "#48bb78" }}>
          {fmt(results.krediReelDeger)} ₺
        </strong>
        'ye düşüyor. Enflasyondan kaynaklı reel değer kaybı:{" "}
        <strong style={{ color: "#48bb78" }}>
          {fmt(results.teslimEnflasyonEtkisi)} ₺
        </strong>
        {krediTeslimAyi > 0 && (
          <span>
            {" "}
            — Bu, satıcının zararı / finans şirketinin asıl maliyeti.
          </span>
        )}
      </div>
    </div>
  );
}
