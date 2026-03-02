export default function MethodologyNote() {
  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #21262d",
        borderRadius: 12,
        padding: 16,
        fontSize: 11.5,
        color: "#718096",
        lineHeight: 1.8,
      }}
    >
      <div style={{ color: "#a0aec0", fontWeight: 700, marginBottom: 6 }}>
        Hesaplama Yöntemi
      </div>
      <strong style={{ color: "#a0aec0" }}>Efektif Faiz:</strong> IRR
      (Internal Rate of Return) yöntemiyle hesaplanır. Hizmet bedeli
      dahil tüm ödemelerin bugünkü değerini kredi tutarına eşitleyen
      aylık faiz oranıdır.
      <br />
      <strong style={{ color: "#a0aec0" }}>Reel Faiz:</strong> Fisher
      denklemi ile enflasyondan arındırılmış gerçek faiz oranı.
      Negatifse, enflasyon faizden yüksek demektir (borçlu lehine).
      <br />
      <strong style={{ color: "#a0aec0" }}>Teslim Tarihi:</strong> Kredi
      tutarının satıcıya ödendiği ay. Bu tarihe kadar geçen sürede
      enflasyon, paranın reel değerini eritir — bu maliyet finans
      şirketi/banka tarafından karşılanır.
      <br />
      <strong style={{ color: "#a0aec0" }}>Banka Karşılaştırması:</strong>{" "}
      Aynı tutar ve vadeyle, girilen aylık faiz oranıyla standart
      annüite (eşit taksit) kredisi hesaplanır.
    </div>
  );
}
