import { useState } from "react";
import { fmt, fmtDec } from "./utils/format";
import useHashState from "./hooks/useHashState";
import useKrediHesaplama from "./hooks/useKrediHesaplama";
import Slider from "./components/Slider";
import VerdictBadge from "./components/VerdictBadge";
import ZeroInterestCard from "./components/ZeroInterestCard";
import BankCard from "./components/BankCard";
import DeliveryEffect from "./components/DeliveryEffect";
import PaymentPlanTable from "./components/PaymentPlanTable";
import MethodologyNote from "./components/MethodologyNote";

export default function App() {
  const state = useHashState();
  const {
    krediFiyat, setKrediFiyat,
    pesinatOrani, setPesinatOrani,
    hizmetBedeli, setHizmetBedeli,
    taksitSayisi, setTaksitSayisi,
    krediTeslimAyi, setKrediTeslimAyi,
    yillikEnflasyon, setYillikEnflasyon,
    bankaFaizi, setBankaFaizi,
  } = state;

  const results = useKrediHesaplama(state);
  const [showPlan, setShowPlan] = useState(false);

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
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#d69e2e" }}>
            Kredi Maliyet Analizi
          </h1>
          <p style={{ fontSize: 12, color: "#718096", margin: "6px 0 0" }}>
            "0 Faizli" kredinin efektif faiz oranı vs banka kredisi karşılaştırması
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
                  fontSize: 11, color: "#d69e2e", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16,
                }}
              >
                Kredi Bilgileri
              </div>
              <Slider label="Toplam Tutar" value={krediFiyat} onChange={setKrediFiyat} suffix="₺" min={50000} max={10000000} step={50000} />
              <Slider label="Peşinat Oranı" value={pesinatOrani} onChange={setPesinatOrani} suffix="%" min={0} max={50} />
              <Slider label="Hizmet Bedeli" value={hizmetBedeli} onChange={setHizmetBedeli} suffix="%" min={0} max={20} step={0.5} />
              <Slider label="Taksit Sayısı" value={taksitSayisi} onChange={setTaksitSayisi} suffix=" ay" min={1} max={200} />
              <Slider label="Kredi Teslim Ayı" value={krediTeslimAyi} onChange={setKrediTeslimAyi} suffix=". ay" min={0} max={taksitSayisi} hint="Satıcıya ödemenin yapıldığı ay" />
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
                  fontSize: 11, color: "#718096", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16,
                }}
              >
                Karşılaştırma Parametreleri
              </div>
              <Slider label="Banka Aylık Faiz" value={bankaFaizi} onChange={setBankaFaizi} suffix="%" min={0.5} max={10} step={0.1} hint={`Yıllık efektif: %${fmtDec(results.bankaYillikEfektif, 1)}`} />
              <Slider label="Yıllık Enflasyon" value={yillikEnflasyon} onChange={setYillikEnflasyon} suffix="%" min={5} max={100} />
            </div>
          </div>

          {/* Sağ - Sonuçlar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <VerdictBadge avantajli={avantajli} badgeColor={badgeColor} badgeText={badgeText} />

            <div className="compare-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <ZeroInterestCard results={results} fmt={fmt} fmtDec={fmtDec} />
              <BankCard results={results} bankaFaizi={bankaFaizi} fmt={fmt} fmtDec={fmtDec} />
            </div>

            <DeliveryEffect results={results} krediTeslimAyi={krediTeslimAyi} yillikEnflasyon={yillikEnflasyon} krediFiyat={krediFiyat} fmt={fmt} />

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

            {showPlan && <PaymentPlanTable odemePlani={results.odemePlani} fmt={fmt} />}

            <MethodologyNote />
          </div>
        </div>
      </div>
    </div>
  );
}
