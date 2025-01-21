import React, { useState } from 'react';

const iklimVerileri = {
  maxSicaklik: [4.1, 6.4, 11.9, 17.2, 21.0, 26.2, 29.8, 29.8, 25.8, 19.6, 12.9, 6.4],
  minSicaklik: [-3.3, -2.3, 0.8, 5.4, 8.9, 12.5, 15.3, 15.1, 10.9, 6.8, 2.5, -0.7],
  nem: [77.1, 75.9, 66.4, 59.6, 59.4, 52.9, 44.1, 42.4, 47.6, 58.3, 69.3, 78.0],
  ruzgarHizi: [181.4, 207.4, 216.0, 207.4, 172.8, 190.1, 216.0, 207.4, 181.4, 181.4, 172.8, 181.4],
  guneslenme: [2.36, 2.83, 4.30, 5.84, 7.88, 10.02, 11.65, 11.25, 9.00, 6.66, 4.46, 2.09],
  yagis: [47.0, 36.3, 36.3, 48.3, 54.6, 37.4, 13.8, 12.4, 19.3, 26.8, 33.4, 49.0],
};

const bitkiVerileri = {
  bugday: {
    ad: "Buğday",
    maliyet: 2500,
    fiyat: 8.5,
    verim: 450,
    sulamaSuresi: "10/15-6/15",
    sulamaRandimani: 0.65,
    Kc: {
      baslangic: 0.3,
      orta: 1.15,
      son: 0.4,
    },
    donemler: {
      baslangic: 30,
      gelisme: 140,
      orta: 40,
      son: 30,
      toplam: 240,
    },
  },
  arpa: {
    ad: "Arpa",
    maliyet: 2300,
    fiyat: 7.5,
    verim: 400,
    sulamaSuresi: "10/15-5/15",
    sulamaRandimani: 0.65,
    Kc: {
      baslangic: 0.3,
      orta: 1.15,
      son: 0.25,
    },
    donemler: {
      baslangic: 30,
      gelisme: 130,
      orta: 40,
      son: 30,
      toplam: 230,
    },
  },
  yulaf: {
    ad: "Yulaf",
    maliyet: 2200,
    fiyat: 7.0,
    verim: 350,
    sulamaSuresi: "10/15-6/15",
    sulamaRandimani: 0.65,
    Kc: {
      baslangic: 0.3,
      orta: 1.15,
      son: 0.25,
    },
    donemler: {
      baslangic: 30,
      gelisme: 140,
      orta: 40,
      son: 30,
      toplam: 240,
    },
  },
  sekerpancari: {
    ad: "Şeker Pancarı",
    maliyet: 8000,
    fiyat: 1.5,
    verim: 7000,
    sulamaSuresi: "3/15-9/15",
    sulamaRandimani: 0.65,
    Kc: {
      baslangic: 0.35,
      orta: 1.2,
      son: 0.7,
    },
    donemler: {
      baslangic: 35,
      gelisme: 60,
      orta: 70,
      son: 40,
      toplam: 205,
    },
  },
  silajlikmisir: {
    ad: "Silajlık Mısır",
    maliyet: 5000,
    fiyat: 1.2,
    verim: 6000,
    sulamaSuresi: "4/15-8/15",
    sulamaRandimani: 0.90,
    Kc: {
      baslangic: 0.3,
      orta: 1.2,
      son: 0.35,
    },
    donemler: {
      baslangic: 20,
      gelisme: 35,
      orta: 40,
      son: 25,
      toplam: 120,
    },
  },
  danemisir: {
    ad: "Dane Mısır",
    maliyet: 5500,
    fiyat: 8.0,
    verim: 1200,
    sulamaSuresi: "4/15-9/15",
    sulamaRandimani: 0.90,
    Kc: {
      baslangic: 0.3,
      orta: 1.2,
      son: 0.35,
    },
    donemler: {
      baslangic: 25,
      gelisme: 40,
      orta: 45,
      son: 30,
      toplam: 140,
    },
  },
  domates: {
    ad: "Domates",
    maliyet: 12000,
    fiyat: 5.0,
    verim: 8000,
    sulamaSuresi: "4/1-9/15",
    sulamaRandimani: 0.90,
    Kc: {
      baslangic: 0.6,
      orta: 1.15,
      son: 0.8,
    },
    donemler: {
      baslangic: 30,
      gelisme: 40,
      orta: 45,
      son: 30,
      toplam: 145,
    },
  },
  salatalik: {
    ad: "Salatalık",
    maliyet: 10000,
    fiyat: 4.0,
    verim: 7000,
    sulamaSuresi: "4/15-9/1",
    sulamaRandimani: 0.90,
    Kc: {
      baslangic: 0.6,
      orta: 1.0,
      son: 0.75,
    },
    donemler: {
      baslangic: 25,
      gelisme: 35,
      orta: 40,
      son: 20,
      toplam: 120,
    },
  },
  biber: {
    ad: "Biber",
    maliyet: 11000,
    fiyat: 6.0,
    verim: 4000,
    sulamaSuresi: "4/15-9/15",
    sulamaRandimani: 0.90,
    Kc: {
      baslangic: 0.6,
      orta: 1.05,
      son: 0.9,
    },
    donemler: {
      baslangic: 30,
      gelisme: 35,
      orta: 40,
      son: 20,
      toplam: 125,
    },
  },
};

const hesaplaBuharBasinci = (sicaklik, bagilNem) => {
  const es = 0.6108 * Math.exp((17.27 * sicaklik) / (sicaklik + 237.3));
  return es * (bagilNem / 100);
};

const hesaplaETo = (ay) => {
  const Tmax = iklimVerileri.maxSicaklik[ay];
  const Tmin = iklimVerileri.minSicaklik[ay];
  const Tmean = (Tmax + Tmin) / 2;
  const RH = iklimVerileri.nem[ay];
  const u2 = iklimVerileri.ruzgarHizi[ay] * (1000 / 86400);
  const n = iklimVerileri.guneslenme[ay];

  const altitude = 891;
  const latitude = 39.57;
  const day = 15;

  const P = 101.3 * Math.pow((293 - 0.0065 * altitude) / 293, 5.26);
  const gamma = 0.000665 * P;
  const delta = 4098 * (0.6108 * Math.exp(17.27 * Tmean / (Tmean + 237.3))) / Math.pow((Tmean + 237.3), 2);
  const ea = hesaplaBuharBasinci(Tmean, RH);
  const es_Tmax = 0.6108 * Math.exp(17.27 * Tmax / (Tmax + 237.3));
  const es_Tmin = 0.6108 * Math.exp(17.27 * Tmin / (Tmin + 237.3));
  const es = (es_Tmax + es_Tmin) / 2;
  const vpd = es - ea;

  const J = Math.floor((275 * (ay + 1) / 9) - 30 + day);
  const dr = 1 + 0.033 * Math.cos(2 * Math.PI * J / 365);
  const delta_rad = 0.409 * Math.sin(2 * Math.PI * J / 365 - 1.39);
  const phi = latitude * Math.PI / 180;
  const ws = Math.acos(-Math.tan(phi) * Math.tan(delta_rad));
  const Ra = 24 * 60 / Math.PI * 0.082 * dr * (
    ws * Math.sin(phi) * Math.sin(delta_rad) +
    Math.cos(phi) * Math.cos(delta_rad) * Math.sin(ws)
  );
  const N = 24 * ws / Math.PI;
  const Rs = (0.25 + 0.5 * n / N) * Ra;
  const Rns = 0.77 * Rs;
  const sigma = 4.903e-9;
  const Rnl = sigma * ((Math.pow(Tmax + 273.16, 4) + Math.pow(Tmin + 273.16, 4)) / 2) *
    (0.34 - 0.14 * Math.sqrt(ea)) * (1.35 * Rs / (0.75 * Ra) - 0.35);
  const Rn = Rns - Rnl;
  const G = 0;

  const ET0 = (0.408 * delta * (Rn - G) + gamma * (900 / (Tmean + 273)) * u2 * vpd) /
    (delta + gamma * (1 + 0.34 * u2));

  return Math.max(0, ET0);
};

const hesaplaSuIhtiyaci = (bitkiSecimi, toprakTipi = 'orta') => {
  const bitki = bitkiVerileri[bitkiSecimi];

  const [ekimAy, ekimGun] = bitki.sulamaSuresi.split('-')[0].split('/').map(Number);
  const [hasatAy, hasatGun] = bitki.sulamaSuresi.split('-')[1].split('/').map(Number);

  const efektifYagisKatsayisi = {
    hafif: 0.55,
    orta: 0.70,
    agir: 0.85,
  };

  const randimaDuzeltmeKatsayisi = {
    hafif: 0.9,
    orta: 1.0,
    agir: 1.1,
  };

  let toplamSuIhtiyaci = 0;

  for (let ay = 0; ay < 12; ay++) {
    const ayNo = ay + 1;

    let isYetistirmeDonemi = false;
    if (ekimAy > hasatAy) {
      isYetistirmeDonemi = (ayNo >= ekimAy || ayNo <= hasatAy);
    } else {
      isYetistirmeDonemi = (ayNo >= ekimAy && ayNo <= hasatAy);
    }

    if (isYetistirmeDonemi) {
      const ETo = hesaplaETo(ay);
      const Kc = hesaplaKc(bitkiSecimi, ayNo, ekimAy);
      const ETc = ETo * Kc;
      const gunSayisi = new Date(2024, ay + 1, 0).getDate();
      const aylikETc = ETc * gunSayisi;

      const efektifYagis = iklimVerileri.yagis[ay] *
        efektifYagisKatsay [toprakTipi];

      const suIhtiyaci = Math.max(0, aylikETc - efektifYagis);

      const duzeltilmisRandiman = bitki.sulamaRandimani *
        randimaDuzeltmeKatsayisi[toprakTipi];

      toplamSuIhtiyaci += suIhtiyaci / duzeltilmisRandiman;
    }
  }

  return toplamSuIhtiyaci;
};

const hesaplaKc = (bitkiSecimi, ayNo, ekimAy) => {
  const bitki = bitkiVerileri[bitkiSecimi];
  let gunSayisi;

  if (ayNo >= ekimAy) {
    gunSayisi = (ayNo - ekimAy) * 30 + 15;
  } else {
    gunSayisi = ((12 - ekimAy) + ayNo) * 30 + 15;
  }

  const donemler = bitki.donemler;

  if (gunSayisi <= donemler.baslangic) {
    return bitki.Kc.baslangic;
  } else if (gunSayisi <= donemler.baslangic + donemler.gelisme) {
    const gelismeSureci = (gunSayisi - donemler.baslangic) / donemler.gelisme;
    return bitki.Kc.baslangic + (bitki.Kc.orta - bitki.Kc.baslangic) * gelismeSureci;
  } else if (gunSayisi <= donemler.baslangic + donemler.gelisme + donemler.orta) {
    return bitki.Kc.orta;
  } else {
    return bitki.Kc.son;
  }
};

const App = () => {
  const [bitkiSecimi, setBitkiSecimi] = useState('bugday');
  const [toprakTipi, setToprakTipi] = useState('orta');
  const [suIhtiyaci, setSuIhtiyaci] = useState(0);

  const handleCalculate = () => {
    const ihtiyac = hesaplaSuIhtiyaci(bitkiSecimi, toprakTipi);
    setSuIhtiyaci(ihtiyac);
  };

  return (
    <div>
      <h1>Sulama Hesaplama Uygulaması</h1>
      <div>
        <label>Bitki Seçimi:</label>
        <select value={bitkiSecimi} onChange={(e) => setBitkiSecimi(e.target.value)}>
          {Object.keys(bitkiVerileri).map((key) => (
            <option key={key} value={key}>{bitkiVerileri[key].ad}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Toprak Tipi:</label>
        <select value={toprakTipi} onChange={(e) => setToprakTipi(e.target.value)}>
          <option value="hafif">Hafif</option>
          <option value="orta">Orta</option>
          <option value="agir">Ağır</option>
        </select>
      </div>
      <button onClick={handleCalculate}>Su İhtiyacını Hesapla</button>
      <div>
        <h2>Yıllık Su İhtiyacı: {Math.round(suIhtiyaci).toLocaleString()} m³/da</h2>
      </div>
    </div>
  );
};

export default hesaplaETo;