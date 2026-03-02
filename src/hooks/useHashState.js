import { useState, useRef, useEffect } from "react";

const DEFAULTS = {
  t: 1000000,
  p: 20,
  h: 7,
  n: 60,
  k: 12,
  e: 30,
  b: 3.5,
};

function parseHash() {
  try {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const get = (key) => {
      const val = params.get(key);
      if (val === null) return DEFAULTS[key];
      const num = Number(val);
      return isNaN(num) ? DEFAULTS[key] : num;
    };
    return {
      t: get("t"),
      p: get("p"),
      h: get("h"),
      n: get("n"),
      k: get("k"),
      e: get("e"),
      b: get("b"),
    };
  } catch {
    return DEFAULTS;
  }
}

export default function useHashState() {
  const init = useRef(parseHash()).current;
  const [krediFiyat, setKrediFiyat] = useState(init.t);
  const [pesinatOrani, setPesinatOrani] = useState(init.p);
  const [hizmetBedeli, setHizmetBedeli] = useState(init.h);
  const [taksitSayisi, setTaksitSayisi] = useState(init.n);
  const [krediTeslimAyi, setKrediTeslimAyi] = useState(init.k);
  const [yillikEnflasyon, setYillikEnflasyon] = useState(init.e);
  const [bankaFaizi, setBankaFaizi] = useState(init.b);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("t", krediFiyat);
    params.set("p", pesinatOrani);
    params.set("h", hizmetBedeli);
    params.set("n", taksitSayisi);
    params.set("k", krediTeslimAyi);
    params.set("e", yillikEnflasyon);
    params.set("b", bankaFaizi);
    const newHash = "#" + params.toString();
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, "", newHash);
    }
  }, [
    krediFiyat,
    pesinatOrani,
    hizmetBedeli,
    taksitSayisi,
    krediTeslimAyi,
    yillikEnflasyon,
    bankaFaizi,
  ]);

  return {
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
  };
}
