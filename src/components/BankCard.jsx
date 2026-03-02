export default function BankCard({ results, bankaFaizi, fmt, fmtDec }) {
  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #21262d",
        borderRadius: 12,
        padding: 18,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#63b3ed",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 14,
        }}
      >
        Banka Kredisi
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: "#4a5568", textTransform: "uppercase" }}>
            Aylık Faiz
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#63b3ed",
              fontFamily: "monospace",
            }}
          >
            %{fmtDec(bankaFaizi)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#4a5568", textTransform: "uppercase" }}>
            Yıllık Efektif Faiz
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#e2e8f0",
              fontFamily: "monospace",
            }}
          >
            %{fmtDec(results.bankaYillikEfektif, 1)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#4a5568", textTransform: "uppercase" }}>
            Faiz Tutarı
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#fc8181",
              fontFamily: "monospace",
            }}
          >
            {fmt(results.bankaFaizTutari)} ₺
          </div>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #21262d", margin: "4px 0" }} />
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
            <div style={{ color: "#a0aec0", fontFamily: "monospace", fontWeight: 600 }}>
              {fmt(results.pesinat)} ₺
            </div>
          </div>
          <div>
            <div style={{ color: "#4a5568" }}>Kredi Tutarı</div>
            <div style={{ color: "#a0aec0", fontFamily: "monospace", fontWeight: 600 }}>
              {fmt(results.kalanTutar)} ₺
            </div>
          </div>
          <div>
            <div style={{ color: "#4a5568" }}>Aylık Taksit</div>
            <div style={{ color: "#a0aec0", fontFamily: "monospace", fontWeight: 600 }}>
              {fmt(results.bankaAylikTaksit)} ₺
            </div>
          </div>
          <div>
            <div style={{ color: "#4a5568" }}>Toplam Ödeme</div>
            <div style={{ color: "#fff", fontFamily: "monospace", fontWeight: 700 }}>
              {fmt(results.bankaToplamOdeme)} ₺
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
