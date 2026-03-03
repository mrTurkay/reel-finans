import { useState, useRef, useCallback, useEffect } from "react";
import { fmt, fmtDec } from "./utils/format";
import useHashState from "./hooks/useHashState";
import useKrediHesaplama from "./hooks/useKrediHesaplama";
import useShare from "./hooks/useShare";
import Slider from "./components/Slider";
import ZeroInterestCard from "./components/ZeroInterestCard";
import BankCard from "./components/BankCard";
import DeliveryEffect from "./components/DeliveryEffect";
import PaymentPlanTable from "./components/PaymentPlanTable";
import InfoModal from "./components/InfoModal";
import ShareButtons from "./components/ShareButtons";
import Toast from "./components/Toast";

export default function App() {
  const state = useHashState();
  const {
    krediFiyat,
    setKrediFiyat,
    pesinatOrani,
    setPesinatOrani,
    hizmetBedeli,
    setHizmetBedeli,
    taksitSayisi,
    setTaksitSayisi,
    krediTeslimAyi,
    setKrediTeslimAyi,
    yillikEnflasyon,
    setYillikEnflasyon,
    bankaFaizi,
    setBankaFaizi,
  } = state;

  const results = useKrediHesaplama(state);
  const [showPlan, setShowPlan] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [toast, setToast] = useState(null);
  const compareRef = useRef(null);
  const showToast = useCallback((msg) => setToast(msg), []);
  const { shareLink, shareImage } = useShare(showToast, results, krediFiyat, taksitSayisi);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Hide scroll hint on scroll
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 200) setShowScrollHint(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dynamic document.title for SEO + browser tab
  useEffect(() => {
    const base = `${fmt(krediFiyat)} ₺ ${taksitSayisi} Ay`;
    const rate = results.irrGecersiz
      ? ""
      : ` | Gerçek Faiz %${fmtDec(results.gercekAylikFaiz)}`;
    document.title = `${base}${rate} — Reel Finans Hesaplayıcı`;

    // Update OG meta dynamically (helps WhatsApp/Telegram JS renderers)
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${base}${rate} — Reel Finans`;
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = `${fmt(krediFiyat)} ₺ tutarında ${taksitSayisi} ay vadeli konut tasarruf finansmanının gerçek maliyeti. Banka kredisi karşılaştırması ve enflasyon analizi.`;
  }, [krediFiyat, taksitSayisi, results.gercekAylikFaiz, results.irrGecersiz]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: "#e2e8f0",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "24px 12px",
      }}
    >
      <main style={{ maxWidth: 920, margin: "0 auto" }}>
        {/* Header */}
        <header
          style={{
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <img
            src="/logo.png"
            alt="Reel Finans"
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              objectFit: "contain",
            }}
          />
          <div>
            <h1
              style={{
                fontSize: 18,
                fontWeight: 700,
                margin: 0,
                color: "#d69e2e",
                letterSpacing: "0.02em",
              }}
            >
              Reel Finans
            </h1>
            <p style={{ fontSize: 10.5, color: "#718096", margin: "2px 0 0" }}>
              Kredi ve Tasarruf Analizi
            </p>
          </div>
          <button
            onClick={() => setShowInfo(true)}
            title="Bu uygulama ne işe yarar?"
            style={{
              marginLeft: "auto",
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(214,158,46,0.1)",
              border: "1px solid rgba(214,158,46,0.25)",
              color: "#d69e2e",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              padding: 0,
            }}
          >
            i
          </button>
        </header>

        {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

        <div
          className="main-grid"
          style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}
        >
          {/* Sol - Parametreler */}
          <section>
            <div
              style={{
                background: "#161b22",
                border: "1px solid #21262d",
                borderRadius: 12,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontSize: 11,
                  color: "#d69e2e",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 16,
                  margin: "0 0 16px 0",
                }}
              >
                Kredi Bilgileri
              </h2>
              <Slider
                label="Toplam Tutar"
                value={krediFiyat}
                onChange={setKrediFiyat}
                suffix="₺"
                min={50000}
                max={10000000}
                step={50000}
              />
              <Slider
                label="Peşinat Oranı"
                value={pesinatOrani}
                onChange={setPesinatOrani}
                suffix="%"
                min={0}
                max={50}
              />
              <Slider
                label="Hizmet Bedeli"
                value={hizmetBedeli}
                onChange={setHizmetBedeli}
                suffix="%"
                min={0}
                max={20}
                step={0.5}
              />
              <Slider
                label="Taksit Sayısı"
                value={taksitSayisi}
                onChange={setTaksitSayisi}
                suffix=" ay"
                min={1}
                max={200}
              />
              <Slider
                label="Kredi Teslim Ayı"
                value={krediTeslimAyi}
                onChange={setKrediTeslimAyi}
                suffix=". ay"
                min={0}
                max={taksitSayisi}
                hint="Satıcıya ödemenin yapıldığı ay"
              />
            </div>

            <div
              style={{
                background: "#161b22",
                border: "1px solid #21262d",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <h2
                style={{
                  fontSize: 11,
                  color: "#718096",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 16,
                  margin: "0 0 16px 0",
                }}
              >
                Karşılaştırma Parametreleri
              </h2>
              <Slider
                label="Banka Aylık Faiz"
                value={bankaFaizi}
                onChange={setBankaFaizi}
                suffix="%"
                min={0.5}
                max={10}
                step={0.1}
                hint={`Yıllık efektif: %${fmtDec(results.bankaYillikEfektif, 1)}`}
              />
              <Slider
                label="Yıllık Enflasyon"
                value={yillikEnflasyon}
                onChange={setYillikEnflasyon}
                suffix="%"
                min={5}
                max={100}
              />
            </div>
          </section>

          {/* Sağ - Sonuçlar */}
          <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h2 className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
              Karşılaştırma Sonuçları
            </h2>
            <div
              ref={compareRef}
              className="compare-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <ZeroInterestCard results={results} fmt={fmt} fmtDec={fmtDec} />
              <BankCard
                results={results}
                bankaFaizi={bankaFaizi}
                fmt={fmt}
                fmtDec={fmtDec}
              />
            </div>

            <ShareButtons
              onShareLink={shareLink}
              onShareImage={() => shareImage(compareRef)}
            />

            <DeliveryEffect
              results={results}
              krediTeslimAyi={krediTeslimAyi}
              yillikEnflasyon={yillikEnflasyon}
              krediFiyat={krediFiyat}
              fmt={fmt}
            />

            <button
              onClick={() => setShowPlan(!showPlan)}
              style={{
                background: "rgba(214,158,46,0.08)",
                border: "1px solid rgba(214,158,46,0.2)",
                borderRadius: 8,
                padding: "10px 14px",
                color: "#d69e2e",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {showPlan ? "▲ Ödeme Planını Gizle" : "▼ Detaylı Ödeme Planı"}
            </button>

            {showPlan && (
              <PaymentPlanTable odemePlani={results.odemePlani} fmt={fmt} />
            )}
          </section>
        </div>

      </main>

      {showScrollHint && (
        <div
          className="scroll-hint"
          onClick={() => {
            document.getElementById("seo-content")?.scrollIntoView({ behavior: "smooth" });
            setShowScrollHint(false);
          }}
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            animation: "bounce 2s infinite",
            opacity: 0.7,
            transition: "opacity 0.3s",
          }}
        >
          <span style={{ fontSize: 11, color: "#718096", letterSpacing: "0.05em" }}>
            Detaylı Bilgi
          </span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: "#d69e2e" }}>
            <path d="M10 4v10m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-6px); }
        }
        @media (max-width: 768px) {
          .scroll-hint { display: none !important; }
        }
      `}</style>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
