export default function ZeroInterestCard({ results, fmt, fmtDec }) {
  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #21262d",
        borderRadius: 12,
        padding: 18,
      }}
    >
      <h3
        style={{
          fontSize: 11,
          color: "#d69e2e",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 14,
          margin: "0 0 14px 0",
        }}
      >
        "0 Faizli" Kredi
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div
            style={{
              fontSize: 10,
              color: "#4a5568",
              textTransform: "uppercase",
            }}
          >
            Gerçek Aylık Maliyet
          </div>
          <div
            style={{
              fontSize: results.irrGecersiz ? 18 : 32,
              fontWeight: 700,
              color: results.irrGecersiz ? "#d69e2e" : "#fc8181",
              fontFamily: "monospace",
            }}
          >
            {results.irrGecersiz
              ? "Hesaplanamıyor"
              : `%${fmtDec(results.gercekAylikFaiz)}`}
          </div>
          <div style={{ fontSize: 10, color: "#4a5568" }}>
            {results.irrGecersiz
              ? "Peşin ödeme reel kredi değerini aşıyor"
              : `Yıllık: %${fmtDec(results.gercekYillikFaiz, 1)}`}
          </div>
          <div style={{ fontSize: 10, color: "#4a5568", marginTop: 2 }}>
            Reel kredi değeri: {fmt(results.reelKrediFiyat)} ₺
          </div>
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#4a5568",
            background: "rgba(214,158,46,0.06)",
            borderRadius: 6,
            padding: "6px 8px",
            lineHeight: 1.5,
          }}
        >
          {fmt(results.reelKrediFiyat)} ₺ reel kredi üzerinden IRR hesabı. Org.
          ücreti + teslim gecikmesi + enflasyon dahil.
        </div>
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #21262d",
            margin: "4px 0",
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            fontSize: 11,
          }}
        >
          <div>
            <div style={{ color: "#4a5568" }}>Peşinat</div>
            <div
              style={{
                color: "#a0aec0",
                fontFamily: "monospace",
                fontWeight: 600,
              }}
            >
              {fmt(results.pesinat)} ₺
            </div>
          </div>
          <div>
            <div style={{ color: "#4a5568" }}>Org. Ücreti (peşin)</div>
            <div
              style={{
                color: "#a0aec0",
                fontFamily: "monospace",
                fontWeight: 600,
              }}
            >
              {fmt(results.hizmetTutari)} ₺
            </div>
          </div>
          <div>
            <div style={{ color: "#4a5568" }}>Toplam İlk Ödeme</div>
            <div
              style={{
                color: "#d69e2e",
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              {fmt(results.ilkOdeme)} ₺
            </div>
          </div>
          <div>
            <div style={{ color: "#4a5568" }}>Aylık Taksit</div>
            <div
              style={{
                color: "#a0aec0",
                fontFamily: "monospace",
                fontWeight: 600,
              }}
            >
              {fmt(results.aylikTaksit)} ₺
            </div>
          </div>
          <div>
            <div style={{ color: "#4a5568" }}>Toplam Maliyet</div>
            <div
              style={{
                color: "#fff",
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              {fmt(results.toplamNominalOdeme)} ₺
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
