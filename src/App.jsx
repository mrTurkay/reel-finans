import { useState, useMemo, useRef } from "react";

const fmt = (n) =>
  new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

const fmtDec = (n, d = 2) =>
  new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(n);

const Slider = ({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step = 1,
  hint,
}) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const inputRef = useRef(null);

  const displayValue =
    suffix === "₺"
      ? `${fmt(value)} ₺`
      : `${fmtDec(value, step < 1 ? 1 : 0)}${suffix}`;

  const startEdit = () => {
    setEditText(String(step < 1 ? value : Math.round(value)));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitEdit = () => {
    setEditing(false);
    const raw = editText.replace(/\./g, "").replace(",", ".");
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      const clamped = Math.min(max, Math.max(min, num));
      const snapped = Math.round(clamped / step) * step;
      onChange(parseFloat(snapped.toFixed(10)));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditing(false);
  };

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 5,
        }}
      >
        <label style={{ fontSize: 12.5, color: "#a0aec0", fontWeight: 500 }}>
          {label}
        </label>
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            style={{
              fontSize: 14,
              color: "#fff",
              fontFamily: "monospace",
              fontWeight: 700,
              background: "#2d3748",
              border: "1px solid #d69e2e",
              borderRadius: 4,
              padding: "1px 6px",
              width: 100,
              textAlign: "right",
              outline: "none",
            }}
          />
        ) : (
          <span
            onClick={startEdit}
            title="Düzenlemek için tıklayın"
            style={{
              fontSize: 14,
              color: "#fff",
              fontFamily: "monospace",
              fontWeight: 700,
              cursor: "pointer",
              borderBottom: "1px dashed #d69e2e",
              paddingBottom: 1,
            }}
          >
            {displayValue}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          height: 5,
          borderRadius: 3,
          WebkitAppearance: "none",
          appearance: "none",
          background: `linear-gradient(to right, #d69e2e 0%, #d69e2e ${pct}%, #2d3748 ${pct}%, #2d3748 100%)`,
          cursor: "pointer",
          outline: "none",
        }}
      />
      {hint && (
        <div style={{ fontSize: 10.5, color: "#4a5568", marginTop: 2 }}>
          {hint}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [krediFiyat, setKrediFiyat] = useState(1000000);
  const [pesinatOrani, setPesinatOrani] = useState(20);
  const [hizmetBedeli, setHizmetBedeli] = useState(7);
  const [taksitSayisi, setTaksitSayisi] = useState(12);
  const [krediTeslimAyi, setKrediTeslimAyi] = useState(12);
  const [yillikEnflasyon, setYillikEnflasyon] = useState(30);
  const [bankaFaizi, setBankaFaizi] = useState(3.5);
  const [showPlan, setShowPlan] = useState(false);

  const results = useMemo(() => {
    const pesinat = krediFiyat * (pesinatOrani / 100);
    const kalanTutar = krediFiyat - pesinat;
    const hizmetTutari = krediFiyat * (hizmetBedeli / 100);
    const ilkOdeme = pesinat + hizmetTutari; // peşin ödenen toplam
    const aylikTaksit = kalanTutar / taksitSayisi;
    const toplamNominalOdeme = ilkOdeme + kalanTutar; // = krediFiyat + hizmetTutari

    // Aylık enflasyon
    const aylikEnflasyon = Math.pow(1 + yillikEnflasyon / 100, 1 / 12) - 1;

    // Kredi teslim ayındaki paranın bugünkü reel değeri
    const krediReelDeger =
      krediFiyat / Math.pow(1 + aylikEnflasyon, krediTeslimAyi);

    // --- IRR hesaplama (Newton-Raphson) ---
    // Nakit akışları: ay 0'da +krediFiyat (krediyi alıyorsun), sonra peşinat ve taksitler çıkış
    // Ama aslında satıcıya ödeme krediTeslimAyi'nda yapılıyor
    // Biz borçlu açısından bakıyoruz:
    // Ay 0: -peşinat
    // Ay 1..taksitSayisi: -aylikTaksit
    // Kredi teslim ayında satıcı parasını alıyor ama bu bizim için değil satıcı için önemli
    // Bizim gerçek nakit akışımız: aldığımız mal/hizmetin değeri vs ödediğimiz paralar

    // Efektif faiz hesabı: toplam ödeme / kredi tutarı üzerinden
    // Basit efektif oran
    const nominalEkMaliyet = toplamNominalOdeme - krediFiyat;
    const nominalEkOran = nominalEkMaliyet / kalanTutar; // kalan tutar üzerinden

    // IRR yaklaşımı - nakit akışları (borçlu açısından)
    // Ay 0: +kalanTutar (kredi alındı) -hizmetTutari (org ücreti peşin ödendi)
    // Ay 1..n: -aylikTaksit
    const cashflows = [];
    cashflows.push(kalanTutar - hizmetTutari); // ay 0: kredi - org ücreti
    for (let i = 1; i <= taksitSayisi; i++) {
      cashflows.push(-aylikTaksit);
    }

    // Newton-Raphson IRR
    let r = 0.02; // başlangıç tahmini aylık
    for (let iter = 0; iter < 200; iter++) {
      let npv = 0;
      let dnpv = 0;
      for (let t = 0; t < cashflows.length; t++) {
        const denom = Math.pow(1 + r, t);
        npv += cashflows[t] / denom;
        dnpv -= (t * cashflows[t]) / Math.pow(1 + r, t + 1);
      }
      const newR = r - npv / dnpv;
      if (Math.abs(newR - r) < 1e-10) {
        r = newR;
        break;
      }
      r = newR;
    }
    const efektifAylikFaiz = r;
    const efektifYillikFaiz = (Math.pow(1 + r, 12) - 1) * 100;

    // Reel efektif faiz (enflasyon düzeltmeli)
    const reelAylikFaiz = (1 + efektifAylikFaiz) / (1 + aylikEnflasyon) - 1;
    const reelYillikFaiz = (Math.pow(1 + reelAylikFaiz, 12) - 1) * 100;

    // Banka karşılaştırması
    const bankaAylik = bankaFaizi / 100;
    let bankaToplam = 0;
    // Banka kredisi: aynı kalanTutar, aynı taksit sayısı, aylık faiz
    const bankaAylikTaksit =
      (kalanTutar * (bankaAylik * Math.pow(1 + bankaAylik, taksitSayisi))) /
      (Math.pow(1 + bankaAylik, taksitSayisi) - 1);
    bankaToplam = bankaAylikTaksit * taksitSayisi;
    const bankaToplamOdeme = pesinat + bankaToplam;
    const bankaFaizTutari = bankaToplam - kalanTutar;
    const bankaYillikEfektif = (Math.pow(1 + bankaAylik, 12) - 1) * 100;

    // Teslim tarihi etkisi - enflasyondan kazanç
    // Satıcı parayı krediTeslimAyi'nda alıyor, sen taksit ödemeye ay 1'den başlıyorsun
    // Aradaki enflasyon farkı senin lehine
    const teslimEnflasyonEtkisi = krediFiyat - krediReelDeger;

    // Ödeme planı
    const odemePlani = [];
    let kumulatifNominal = 0;
    let kumulatifReel = 0;

    odemePlani.push({
      ay: 0,
      label: "Peşin Ödeme",
      nominal: ilkOdeme,
      reel: ilkOdeme,
      kumulatifNominal: ilkOdeme,
      kumulatifReel: ilkOdeme,
      isTeslim: krediTeslimAyi === 0,
    });
    kumulatifNominal = ilkOdeme;
    kumulatifReel = ilkOdeme;

    for (let i = 1; i <= taksitSayisi; i++) {
      const reel = aylikTaksit / Math.pow(1 + aylikEnflasyon, i);
      kumulatifNominal += aylikTaksit;
      kumulatifReel += reel;
      odemePlani.push({
        ay: i,
        label: `Taksit ${i}`,
        nominal: aylikTaksit,
        reel,
        kumulatifNominal,
        kumulatifReel,
        isTeslim: i === krediTeslimAyi,
      });
    }

    // Fark (pozitifse 0 faizli pahalı, negatifse ucuz)
    const fark = toplamNominalOdeme - bankaToplamOdeme;

    return {
      pesinat,
      kalanTutar,
      hizmetTutari,
      ilkOdeme,
      aylikTaksit,
      toplamNominalOdeme,
      nominalEkMaliyet,
      nominalEkOran,
      efektifAylikFaiz: efektifAylikFaiz * 100,
      efektifYillikFaiz,
      reelAylikFaiz: reelAylikFaiz * 100,
      reelYillikFaiz,
      krediReelDeger,
      teslimEnflasyonEtkisi,
      bankaAylikTaksit,
      bankaToplamOdeme,
      bankaToplam,
      bankaFaizTutari,
      bankaYillikEfektif,
      fark,
      odemePlani,
    };
  }, [
    krediFiyat,
    pesinatOrani,
    hizmetBedeli,
    taksitSayisi,
    krediTeslimAyi,
    yillikEnflasyon,
    bankaFaizi,
  ]);

  const avantajli = results.fark < 0;
  const badgeColor = avantajli ? "#48bb78" : "#fc8181";
  const badgeText = avantajli
    ? `0 faizli ${fmt(Math.abs(results.fark))} ₺ daha ucuz`
    : `Banka kredisi ${fmt(Math.abs(results.fark))} ₺ daha ucuz`;

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
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: #d69e2e; cursor: grab; border: 2px solid #0d1117;
          margin-top: -7px;
        }
        input[type=range]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%;
          background: #d69e2e; cursor: grab; border: 2px solid #0d1117;
        }
        input[type=range]:active::-webkit-slider-thumb { cursor: grabbing; }
        input[type=range]:active::-moz-range-thumb { cursor: grabbing; }
        .teslim-row { background: rgba(214,158,46,0.12) !important; }
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              color: "#d69e2e",
            }}
          >
            Kredi Maliyet Analizi
          </h1>
          <p style={{ fontSize: 12, color: "#718096", margin: "6px 0 0" }}>
            "0 Faizli" kredinin efektif faiz oranı vs banka kredisi
            karşılaştırması
          </p>
        </div>

        <div
          className="main-grid"
          style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}
        >
          {/* Sol - Parametreler */}
          <div>
            <div
              style={{
                background: "#161b22",
                border: "1px solid #21262d",
                borderRadius: 12,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#d69e2e",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 16,
                }}
              >
                Kredi Bilgileri
              </div>
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
              <div
                style={{
                  fontSize: 11,
                  color: "#718096",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 16,
                }}
              >
                Karşılaştırma Parametreleri
              </div>
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
          </div>

          {/* Sağ - Sonuçlar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Verdict Badge */}
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

            {/* Karşılaştırma Tablosu */}
            <div
              className="compare-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {/* 0 Faizli */}
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
                    color: "#d69e2e",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 14,
                  }}
                >
                  "0 Faizli" Kredi
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#4a5568",
                          textTransform: "uppercase",
                        }}
                      >
                        Nominal Aylık Faiz
                      </div>
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: 700,
                          color: "#d69e2e",
                          fontFamily: "monospace",
                        }}
                      >
                        %{fmtDec(results.efektifAylikFaiz)}
                      </div>
                      <div style={{ fontSize: 10, color: "#4a5568" }}>
                        Yıllık: %{fmtDec(results.efektifYillikFaiz, 1)}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#4a5568",
                          textTransform: "uppercase",
                        }}
                      >
                        Reel Aylık Faiz
                      </div>
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: 700,
                          color:
                            results.reelAylikFaiz < 0 ? "#48bb78" : "#fc8181",
                          fontFamily: "monospace",
                        }}
                      >
                        %{fmtDec(results.reelAylikFaiz)}
                      </div>
                      <div style={{ fontSize: 10, color: "#4a5568" }}>
                        Yıllık: %{fmtDec(results.reelYillikFaiz, 1)}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "#4a5568", marginTop: 4 }}>
                    Reel = enflasyon düzeltmeli gerçek maliyet
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

              {/* Banka */}
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
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#4a5568",
                        textTransform: "uppercase",
                      }}
                    >
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
                    <div
                      style={{
                        fontSize: 10,
                        color: "#4a5568",
                        textTransform: "uppercase",
                      }}
                    >
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
                    <div
                      style={{
                        fontSize: 10,
                        color: "#4a5568",
                        textTransform: "uppercase",
                      }}
                    >
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
                      <div style={{ color: "#4a5568" }}>Kredi Tutarı</div>
                      <div
                        style={{
                          color: "#a0aec0",
                          fontFamily: "monospace",
                          fontWeight: 600,
                        }}
                      >
                        {fmt(results.kalanTutar)} ₺
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
                        {fmt(results.bankaAylikTaksit)} ₺
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#4a5568" }}>Toplam Ödeme</div>
                      <div
                        style={{
                          color: "#fff",
                          fontFamily: "monospace",
                          fontWeight: 700,
                        }}
                      >
                        {fmt(results.bankaToplamOdeme)} ₺
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teslim Tarihi Etkisi */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(214,158,46,0.06), #161b22)",
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

            {/* Ödeme Planı Toggle */}
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
              <div
                style={{
                  background: "#161b22",
                  border: "1px solid #21262d",
                  borderRadius: 12,
                  padding: 14,
                  maxHeight: 400,
                  overflowY: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 11,
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "1px solid #21262d" }}>
                      {[
                        "Ay",
                        "Nominal",
                        "Reel Değer",
                        "Küm. Nominal",
                        "Küm. Reel",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "8px 4px",
                            color: "#4a5568",
                            fontWeight: 600,
                            textAlign: "right",
                            fontSize: 10,
                            textTransform: "uppercase",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.odemePlani.map((row) => (
                      <tr
                        key={row.ay}
                        className={row.isTeslim ? "teslim-row" : ""}
                        style={{
                          borderBottom: "1px solid rgba(33,38,45,0.5)",
                          background: row.isTeslim
                            ? "rgba(214,158,46,0.08)"
                            : "transparent",
                        }}
                      >
                        <td
                          style={{
                            padding: "5px 4px",
                            color: row.isTeslim ? "#d69e2e" : "#a0aec0",
                            fontFamily: "monospace",
                            fontWeight: row.isTeslim ? 700 : 400,
                          }}
                        >
                          {row.label} {row.isTeslim && "📍"}
                        </td>
                        <td
                          style={{
                            padding: "5px 4px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            color: "#e2e8f0",
                          }}
                        >
                          {fmt(row.nominal)} ₺
                        </td>
                        <td
                          style={{
                            padding: "5px 4px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            color: "#48bb78",
                          }}
                        >
                          {fmt(row.reel)} ₺
                        </td>
                        <td
                          style={{
                            padding: "5px 4px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            color: "#718096",
                          }}
                        >
                          {fmt(row.kumulatifNominal)} ₺
                        </td>
                        <td
                          style={{
                            padding: "5px 4px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            color: "#718096",
                          }}
                        >
                          {fmt(row.kumulatifReel)} ₺
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Açıklama */}
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
              <div
                style={{ color: "#a0aec0", fontWeight: 700, marginBottom: 6 }}
              >
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
              <strong style={{ color: "#a0aec0" }}>
                Banka Karşılaştırması:
              </strong>{" "}
              Aynı tutar ve vadeyle, girilen aylık faiz oranıyla standart
              annüite (eşit taksit) kredisi hesaplanır.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
