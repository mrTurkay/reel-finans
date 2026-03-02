import { useMemo } from "react";

export default function useKrediHesaplama({
  krediFiyat, pesinatOrani, hizmetBedeli, taksitSayisi,
  krediTeslimAyi, yillikEnflasyon, bankaFaizi,
}) {
  return useMemo(() => {
    const pesinat = krediFiyat * (pesinatOrani / 100);
    const kalanTutar = krediFiyat - pesinat;
    const hizmetTutari = krediFiyat * (hizmetBedeli / 100);
    const ilkOdeme = pesinat + hizmetTutari;
    const aylikTaksit = kalanTutar / taksitSayisi;
    const toplamNominalOdeme = ilkOdeme + kalanTutar;

    const aylikEnflasyon = Math.pow(1 + yillikEnflasyon / 100, 1 / 12) - 1;
    const krediReelDeger = krediFiyat / Math.pow(1 + aylikEnflasyon, krediTeslimAyi);

    // Newton-Raphson IRR solver (sınır korumalı)
    function solveIRR(cashflows, guess) {
      // İlk terim ≤ 0 ise tüm akışlar negatif → geçerli IRR yok
      if (cashflows[0] <= 0) return null;

      let r = guess;
      for (let iter = 0; iter < 300; iter++) {
        let npv = 0;
        let dnpv = 0;
        for (let t = 0; t < cashflows.length; t++) {
          const denom = Math.pow(1 + r, t);
          npv += cashflows[t] / denom;
          dnpv -= (t * cashflows[t]) / Math.pow(1 + r, t + 1);
        }
        if (Math.abs(dnpv) < 1e-20) break;
        const newR = r - npv / dnpv;
        // Iraksama kontrolü
        if (!isFinite(newR) || Math.abs(newR) > 10) return null;
        if (Math.abs(newR - r) < 1e-10) { r = newR; break; }
        r = newR;
      }
      return isFinite(r) ? r : null;
    }

    // --- Nominal IRR ---
    const cfNominal = [kalanTutar - hizmetTutari];
    for (let i = 1; i <= taksitSayisi; i++) {
      cfNominal.push(-aylikTaksit);
    }
    const nominalIRR = solveIRR(cfNominal, 0.01);
    const nominalAylikFaiz = nominalIRR ?? 0;
    const nominalYillikFaiz = nominalIRR !== null
      ? (Math.pow(1 + nominalIRR, 12) - 1) * 100 : null;

    // --- Gerçek efektif faiz ---
    const reelKrediFiyat = krediFiyat / Math.pow(1 + aylikEnflasyon, krediTeslimAyi);
    const cfReel = [reelKrediFiyat - ilkOdeme];
    for (let i = 1; i <= taksitSayisi; i++) {
      cfReel.push(-aylikTaksit);
    }
    const gercekIRR = solveIRR(cfReel, 0.03);
    const gercekAylikFaiz = gercekIRR ?? 0;
    const gercekYillikFaiz = gercekIRR !== null
      ? (Math.pow(1 + gercekIRR, 12) - 1) * 100 : null;

    // Banka karşılaştırması
    const bankaAylik = bankaFaizi / 100;
    const bankaAylikTaksit =
      (kalanTutar * (bankaAylik * Math.pow(1 + bankaAylik, taksitSayisi))) /
      (Math.pow(1 + bankaAylik, taksitSayisi) - 1);
    const bankaToplam = bankaAylikTaksit * taksitSayisi;
    const bankaToplamOdeme = pesinat + bankaToplam;
    const bankaFaizTutari = bankaToplam - kalanTutar;
    const bankaYillikEfektif = (Math.pow(1 + bankaAylik, 12) - 1) * 100;

    // Teslim tarihi etkisi
    const teslimEnflasyonEtkisi = krediFiyat - krediReelDeger;

    // Ödeme planı
    const odemePlani = [];
    let kumulatifNominal = 0;
    let kumulatifReel = 0;

    odemePlani.push({
      ay: 0, label: "Peşin Ödeme",
      nominal: ilkOdeme, reel: ilkOdeme,
      kumulatifNominal: ilkOdeme, kumulatifReel: ilkOdeme,
      isTeslim: krediTeslimAyi === 0,
    });
    kumulatifNominal = ilkOdeme;
    kumulatifReel = ilkOdeme;

    for (let i = 1; i <= taksitSayisi; i++) {
      const reel = aylikTaksit / Math.pow(1 + aylikEnflasyon, i);
      kumulatifNominal += aylikTaksit;
      kumulatifReel += reel;
      odemePlani.push({
        ay: i, label: `Taksit ${i}`,
        nominal: aylikTaksit, reel,
        kumulatifNominal, kumulatifReel,
        isTeslim: i === krediTeslimAyi,
      });
    }

    const fark = toplamNominalOdeme - bankaToplamOdeme;

    return {
      pesinat, kalanTutar, hizmetTutari, ilkOdeme, aylikTaksit,
      toplamNominalOdeme,
      nominalAylikFaiz: nominalAylikFaiz * 100,
      nominalYillikFaiz,
      gercekAylikFaiz: gercekAylikFaiz * 100,
      gercekYillikFaiz,
      irrGecersiz: gercekIRR === null,
      reelKrediFiyat, krediReelDeger, teslimEnflasyonEtkisi,
      bankaAylikTaksit, bankaToplamOdeme, bankaToplam,
      bankaFaizTutari, bankaYillikEfektif,
      fark, odemePlani,
    };
  }, [krediFiyat, pesinatOrani, hizmetBedeli, taksitSayisi, krediTeslimAyi, yillikEnflasyon, bankaFaizi]);
}
