export default function InfoModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#161b22",
          border: "1px solid #21262d",
          borderRadius: 16,
          padding: "28px 28px 24px",
          maxWidth: 480,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Kapat butonu */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            color: "#718096",
            fontSize: 20,
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Başlık */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#d69e2e" }}>
            Bu uygulama ne işe yarar?
          </div>
          <div style={{ fontSize: 11.5, color: "#718096", marginTop: 4 }}>
            Reel Finans — Kredi ve Tasarruf Analizi
          </div>
        </div>

        {/* Maddeler */}
        <div style={{ fontSize: 13, color: "#c9d1d9", lineHeight: 1.8 }}>
          <Item emoji="🎯" title="Amaç">
            "0 faizli" diye sunulan kredilerin gerçek maliyetini ortaya çıkarır
            ve banka kredisiyle yan yana karşılaştırır.
          </Item>

          <Item emoji="🔍" title="Gizli maliyetleri gösterir">
            Hizmet bedeli, geç teslim ve enflasyon gibi gizli kalemleri hesaba katar.
            Böylece "0 faiz" denen kredinin gerçek aylık faiz oranını bulursunuz.
          </Item>

          <Item emoji="🏦" title="Banka kredisi karşılaştırması">
            Aynı tutar ve vadeyle bir banka kredisi alsaydınız toplam ne öderdiniz?
            Hangisi daha ucuz, kaç TL fark var — hepsini gösterir.
          </Item>

          <Item emoji="📉" title="Enflasyon etkisi">
            Teslim tarihi gecikmesinde paranın ne kadar değer kaybettiğini hesaplar.
            Bu kayıp aslında finans şirketinin üstlendiği maliyettir.
          </Item>

          <Item emoji="📋" title="Detaylı ödeme planı">
            Her ay ne kadar ödeyeceğinizi hem nominal hem de bugünkü reel değeriyle
            tablo halinde gösterir.
          </Item>

          <Item emoji="⚙️" title="Kolay kullanım">
            Sliderları sürükleyin veya değerlere tıklayıp elle girin.
            Ayarlarınız URL'de saklanır — linki paylaşarak başkalarına gösterebilirsiniz.
          </Item>
        </div>

        {/* Hesaplama Yöntemi */}
        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: "1px solid #21262d",
            fontSize: 12.5,
            color: "#a0aec0",
            lineHeight: 1.8,
          }}
        >
          <div style={{ fontWeight: 700, color: "#d69e2e", fontSize: 13, marginBottom: 10 }}>
            Hesaplama Yöntemi
          </div>
          <Item emoji="📐" title="Efektif Faiz">
            IRR (Internal Rate of Return) yöntemiyle hesaplanır. Hizmet bedeli
            dahil tüm ödemelerin bugünkü değerini kredi tutarına eşitleyen
            aylık faiz oranıdır.
          </Item>
          <Item emoji="📊" title="Reel Faiz">
            Fisher denklemi ile enflasyondan arındırılmış gerçek faiz oranı.
            Negatifse, enflasyon faizden yüksek demektir (borçlu lehine).
          </Item>
          <Item emoji="📅" title="Teslim Tarihi">
            Kredi tutarının satıcıya ödendiği ay. Bu tarihe kadar geçen sürede
            enflasyon, paranın reel değerini eritir — bu maliyet finans
            şirketi/banka tarafından karşılanır.
          </Item>
          <Item emoji="🏦" title="Banka Karşılaştırması">
            Aynı tutar ve vadeyle, girilen aylık faiz oranıyla standart
            annüite (eşit taksit) kredisi hesaplanır.
          </Item>
        </div>

        {/* Alt not */}
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: "1px solid #21262d",
            fontSize: 11,
            color: "#4a5568",
            lineHeight: 1.6,
          }}
        >
          Bu araç bilgilendirme amaçlıdır, yatırım tavsiyesi değildir.
        </div>
      </div>
    </div>
  );
}

function Item({ emoji, title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 600, color: "#e2e8f0", marginBottom: 2 }}>
        {emoji} {title}
      </div>
      <div style={{ color: "#a0aec0", fontSize: 12.5 }}>{children}</div>
    </div>
  );
}
