import React, { useState } from 'react';

const EtoHesaplama = () => {
    const [ay, setAy] = useState(0);
    const [sonuclar, setSonuclar] = useState(null);
    const [iklimVerileri, setIklimVerileri] = useState(null);
    const [ea, setEa] = useState('');
    const [u2, setU2] = useState('');
    const [n, setN] = useState('');
    const [latitude, setLatitude] = useState(39.57); // Ankara'nın enlemi
    const [altitude, setAltitude] = useState(891); // Ankara'nın rakımı
    const [day, setDay] = useState(15); // Ayın 15'i

    // İklim verileri
    const iklimVerileriSabiti = {
        maxSicaklik: [4.1, 6.4, 11.9, 17.2, 21.0, 26.2, 29.8, 29.8, 25.8, 19.6, 12.9, 6.4],
        minSicaklik: [-3.3, -2.3, 0.8, 5.4, 8.9, 12.5, 15.3, 15.1, 10.9, 6.8, 2.5, -0.7],
        nem: [77.1, 75.9, 66.4, 59.6, 59.4, 52.9, 44.1, 42.4, 47.6, 58.3, 69.3, 78.0],
        ruzgarHizi: [181.4, 207.4, 216.0, 207.4, 172.8, 190.1, 216.0, 207.4, 181.4, 181.4, 172.8, 181.4],
        guneslenme: [2.36, 2.83, 4.30, 5.84, 7.88, 10.02, 11.65, 11.25, 9.00, 6.66, 4.46, 2.09],
        yagis: [47.0, 36.3, 36.3, 48.3, 54.6, 37.4, 13.8, 12.4, 19.3, 26.8, 33.4, 49.0]
    };

    function hesaplaBuharBasinci(sicaklik, bagilNem) {
        const es = 0.6108 * Math.exp((17.27 * sicaklik) / (sicaklik + 237.3));
        return es * (bagilNem / 100);
    }

    const hesaplaEToAnkara = () => {
        const TmaxValue = iklimVerileriSabiti.maxSicaklik[ay];
        const TminValue = iklimVerileriSabiti.minSicaklik[ay];
        const latitudeValue = 39.57;
        const altitudeValue = 891;
        const dayValue = 15;
        const RH = iklimVerileriSabiti.nem[ay];
        const u2 = iklimVerileriSabiti.ruzgarHizi[ay] * (1000 / 86400);

        // Ortalama sıcaklık
        const Tmean = (TmaxValue + TminValue) / 2;

        // Atmosferik basınç
        const P = 101.3 * Math.pow((293 - 0.0065 * altitudeValue) / 293, 5.26);

        // Psikrometrik sabiti
        const gamma = 0.000665 * P;

        // Buhar basıncı eğrisi eğimi
        const delta = 4098 * (0.6108 * Math.exp(17.27 * Tmean / (Tmean + 237.3))) / Math.pow((Tmean + 237.3), 2);
    
        // Doygun buhar basıncı
        const es_Tmax = 0.6108 * Math.exp(17.27 * TmaxValue / (TmaxValue + 237.3));
        const es_Tmin =  0.6108 * Math.exp(17.27 * TminValue / (TminValue + 237.3));
        const es = (es_Tmax + es_Tmin) / 2;
        const ea = hesaplaBuharBasinci(Tmean, RH);

        // Buhar basıncı açığı
        const vpd = es - ea;

        // Radyasyon hesaplamaları
        const J = Math.floor((275 * (ay + 1) / 9) - 30 + dayValue);
        const dr = 1 + 0.033 * Math.cos(2 * Math.PI * J / 365);
        const delta_rad = 0.409 * Math.sin(2 * Math.PI * J / 365 - 1.39);
        const phi = latitudeValue * Math.PI / 180;
        const ws = Math.acos(-Math.tan(phi) * Math.tan(delta_rad));
        
        // Atmosfer dışı radyasyon
        const Ra = 24 * 60 / Math.PI * 0.082 * dr * (
            ws * Math.sin(phi) * Math.sin(delta_rad) +
            Math.cos(phi) * Math.cos(delta_rad) * Math.sin(ws)
        );

        // Gün uzunluğu
        const N = 24 * ws / Math.PI;
        const n = iklimVerileriSabiti.guneslenme[ay];
        const nN = n / N;

        // Solar radyasyon
        const Rs = (0.25 + 0.5 * n / N) * Ra;
        

        // Net kısa dalga radyasyonu
        const Rns = 0.77 * Rs;

        // Net uzun dalga radyasyonu
        const sigma = 4.903e-9; // Stefan-Boltzmann sabiti
        const Rnl = sigma * ((Math.pow(TmaxValue + 273.16, 4) + Math.pow(TminValue + 273.16, 4)) / 2) * 
                    (0.34 - 0.14 * Math.sqrt(ea)) * (1.35 * Rs / (0.75 * Ra) - 0.35);

        // Net radyasyon
        const Rn = Rns - Rnl;

        // Toprak ısı akısı (aylık için)
        const G = 0;

        // FAO Penman-Monteith denklemi
        const ET0 = (0.408 * delta * (Rn - G) + gamma * (900 / (Tmean + 273)) * u2 * vpd) / 
        (delta + gamma * (1 + 0.34 * u2));

        // Sonuçları güncelle
        const hesaplananEto = {
            ortalamaSicaklik: Tmean,
            buharBasinciEgrisiEgimi: delta,
            psikrometrikSabit: gamma,
            doygunBuharBasınci: es,
            buharBasinciAcigi: vpd,
            netRadyasyon: Rn,
            referansEvapotranspirasyon: ET0
        };


        setSonuclar(hesaplananEto);
        setIklimVerileri(iklimVerileriSabiti);
    };

    return (
        <div className="container mt-5 pt-5">
            <h2 className="text-center mb-4">ETo Hesaplama (FAO Penman-Monteith)</h2>

            <div className="row">
                <div className="col-md-6">
                    <div className="card-test">
                        <div className="card-test-header">
                            <h5>Ankara İçin ETo Hesaplama</h5>
                        </div>
                        <div className="card-test-body">
                            <div className="form-group mb-3">
                                <label>Ay Seçimi</label>
                                <select className="form-control" id="ay-secimi" value={ay} onChange={(e) => setAy(parseInt(e.target.value))}>
                                    <option value="0">Ocak</option>
                                    <option value="1">Şubat</option>
                                    <option value="2">Mart</option>
                                    <option value="3">Nisan</option>
                                    <option value="4">Mayıs</option>
                                    <option value="5">Haziran</option>
                                    <option value="6">Temmuz</option>
                                    <option value="7">Ağustos</option>
                                    <option value="8">Eylül</option>
                                    <option value="9">Ekim</option>
                                    <option value="10">Kasım</option>
                                    <option value="11">Aralık</option>
                                </select>
                            </div>
                            {/* <div className="form-group mb-3">
                                <label>Maksimum Sıcaklık (°C)</label>
                                <input type="number" className="form -control" value={Tmax} onChange={(e) => setTmax(e.target.value)} />
                            </div>
                            <div className="form-group mb-3">
                                <label>Minimum Sıcaklık (°C)</label>
                                <input type="number" className="form-control" value={Tmin} onChange={(e) => setTmin(e.target.value)} />
                            </div>
                            <div className="form-group mb-3">
                                <label>Buhar Basıncı (ea) (kPa)</label>
                                <input type="number" className="form-control" value={ea} onChange={(e) => setEa(e.target.value)} />
                            </div>
                            <div className="form-group mb-3">
                                <label>Rüzgar Hızı (u2) (m/s)</label>
                                <input type="number" className="form-control" value={u2} onChange={(e) => setU2(e.target.value)} />
                            </div>
                            <div className="form-group mb-3">
                                <label>Gün Sayısı (n)</label>
                                <input type="number" className="form-control" value={n} onChange={(e) => setN(e.target.value)} />
                            </div> */}
                            <div className="alert alert-info">
                                <h6>Sabit Değerler (Ankara):</h6>
                                <ul className="mb-0">
                                    <li>Enlem: {latitude}°</li>
                                    <li>Rakım: {altitude} m</li>
                                    <li>Gün: Ayın 15'i</li>
                                </ul>
                            </div>
                            <button className="btn btn-primary" onClick={hesaplaEToAnkara}>Hesapla</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card-test">
                        <div className="card-test-header">
                            <h5>Sonuçlar</h5>
                        </div>
                        <div className="card-test-body">
                            <div id="sonuclar">
                                {sonuclar && (
                                    <table className="table table-sm">
                                        <tbody>
                                            <tr><td>Ortalama Sıcaklık:</td><td>{sonuclar.ortalamaSicaklik.toFixed(1)} °C</td></tr>
                                            <tr><td>Buhar Basıncı Eğrisi Eğimi (Δ):</td><td>{sonuclar.buharBasinciEgrisiEgimi.toFixed(3)} kPa/°C</td></tr>
                                            <tr><td>Psikrometrik Sabit (γ):</td><td>{sonuclar.psikrometrikSabit.toFixed(3)} kPa/°C</td></tr>
                                            <tr><td>Doygun Buhar Basıncı (es):</td><td>{sonuclar.doygunBuharBasınci.toFixed(3)} kPa</td></tr>
                                            <tr><td>Buhar Basıncı Açığı:</td><td>{sonuclar.buharBasinciAcigi.toFixed(3)} kPa</td></tr>
                                            <tr><td>Net Radyasyon (Rn):</td><td>{sonuclar.netRadyasyon.toFixed(2)} MJ/m²/gün</td></tr>
                                            <tr><td>Referans Evapotranspirasyon (ETo):</td><td>{sonuclar.referansEvapotranspirasyon.toFixed(2)} mm/gün</td></tr>
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card-test mt-3">
                        <div className="card-test-header">
                            <h5>Kullanılan İklim Verileri</h5>
                        </div>
                        <div className="card-test-body">
                            <div id="iklim-verileri">
                                {iklimVerileri && (
                                    <ul className="mb-0">
                                        <li>Maksimum Sıcaklık: {iklimVerileri.maxSicaklik[ay]} °C</li>
                                        <li>Minimum Sıcaklık: {iklimVerileri.minSicaklik[ay]} °C</li>
                                        <li>Nem: {iklimVerileri.nem[ay]} %</li>
                                        <li>Rüzgar Hızı: {iklimVerileri.ruzgarHizi[ay]} m/s</li>
                                        <li>Güneşlenme: {iklimVerileri.guneslenme[ay]} saat</li>
                                        <li>Yağış: {iklimVerileri.yagis[ay]} mm</li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EtoHesaplama;