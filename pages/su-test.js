import React, { useState } from 'react';

const EtoHesaplama = () => {
    const [inputs, setInputs] = useState({
        Tmax: '',
        Tmin: '',
        ea: '',
        u2: '',
        n: '',
        latitude: '',
        altitude: '',
        day: '',
        month: '',
    });
    const [results, setResults] = useState(null);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const hesaplaETo = () => {
        const { Tmax, Tmin, ea, u2, n, latitude, altitude, day, month } = inputs;

        const Tmean = (parseFloat(Tmax) + parseFloat(Tmin)) / 2;

        const P = 101.3 * Math.pow((293 - 0.0065 * parseFloat(altitude)) / 293, 5.26);
        const gamma = 0.000665 * P;
        const delta =
            (4098 * (0.6108 * Math.exp((17.27 * Tmean) / (Tmean + 237.3)))) /
            Math.pow(Tmean + 237.3, 2);

        const es_Tmax = 0.6108 * Math.exp((17.27 * parseFloat(Tmax)) / (parseFloat(Tmax) + 237.3));
        const es_Tmin = 0.6108 * Math.exp((17.27 * parseFloat(Tmin)) / (parseFloat(Tmin) + 237.3));
        const es = (es_Tmax + es_Tmin) / 2;
        const vpd = es - parseFloat(ea);

        const J = Math.floor((275 * parseInt(month) / 9) - 30 + parseInt(day));
        const dr = 1 + 0.033 * Math.cos((2 * Math.PI * J) / 365);
        const delta_rad = 0.409 * Math.sin((2 * Math.PI * J) / 365 - 1.39);
        const phi = (parseFloat(latitude) * Math.PI) / 180;
        const ws = Math.acos(-Math.tan(phi) * Math.tan(delta_rad));

        const Ra =
            (24 * 60) /
            Math.PI *
            0.082 *
            dr *
            (ws * Math.sin(phi) * Math.sin(delta_rad) +
                Math.cos(phi) * Math.cos(delta_rad) * Math.sin(ws));

        const N = (24 * ws) / Math.PI;
        const Rs = (0.25 + 0.5 * parseFloat(n) / N) * Ra;
        const Rns = 0.77 * Rs;
        const sigma = 4.903e-9;
        const Rnl =
            sigma *
            ((Math.pow(parseFloat(Tmax) + 273.16, 4) +
                Math.pow(parseFloat(Tmin) + 273.16, 4)) /
                2) *
            (0.34 - 0.14 * Math.sqrt(parseFloat(ea))) *
            (1.35 * Rs / (0.75 * Ra) - 0.35);

        const Rn = Rns - Rnl;
        const G = 0;
        const ET0 =
            (0.408 * delta * (Rn - G) +
                gamma * (900 / (Tmean + 273)) * parseFloat(u2) * vpd) /
            (delta + gamma * (1 + 0.34 * parseFloat(u2)));

        setResults({
            Tmean: Tmean.toFixed(2),
            delta: delta.toFixed(3),
            gamma: gamma.toFixed(3),
            es: es.toFixed(3),
            vpd: vpd.toFixed(3),
            Rn: Rn.toFixed(2),
            ET0: ET0.toFixed(2),
        });
    };

    return (
        <div className="container mt-5 pt-5">
            <h2 className="text-center mb-4">ETo Hesaplama (FAO Penman-Monteith)</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="card-test">
                        <div className="card-test-body">
                            <h5>Girdileri Girin</h5>
                            {['Tmax', 'Tmin', 'ea', 'u2', 'n', 'latitude', 'altitude', 'day', 'month'].map((field) => (
                                <div className="form-group mb-3" key={field}>
                                    <label>{field}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name={field}
                                        value={inputs[field]}
                                        onChange={handleChange}
                                    />
                                </div>
                            ))}
                            <button className="btn btn-primary" onClick={hesaplaETo}>
                                Hesapla
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    {results && (
                        <div className="card-test">
                            <div className="card-test-body">
                                <h5>Sonuçlar</h5>
                                <table className="table table-bordered">
                                    <tbody>
                                        {Object.entries(results).map(([key, value]) => (
                                            <tr key={key}>
                                                <td>{key}</td>
                                                <td>{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EtoHesaplama;