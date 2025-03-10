import React, { useState, useEffect } from "react";

const App = () => {
    const [troopId, setTroopId] = useState("");
    const [numGirls, setNumGirls] = useState("");
    const [predictions, setPredictions] = useState([]);
    const [troopIds, setTroopIds] = useState([]);
    const [history, setHistory] = useState({});
    const [cookieBreakdown, setCookieBreakdown] = useState([]);
    
    useEffect(() => {
        // Fetch available troop IDs
        fetch("http://127.0.0.1:5000/api/troop_ids")
            .then(res => res.json())
            .then(data => setTroopIds(data))
            .catch(err => console.error("Error fetching troop IDs:", err));
    }, []);

    const handlePredict = async () => {
        if (!troopId || !numGirls) {
            alert("Please enter both Troop ID and Number of Girls.");
            return;
        }

        try {
            // Send troop ID & number of girls to API for prediction
            const res = await fetch("http://127.0.0.1:5000/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    troop_id: troopId,
                    num_girls: numGirls,
                    year: 2024,
                }),
            });
            const data = await res.json();
            setPredictions(data);

            // Fetch historical troop data
            const historyRes = await fetch(`http://127.0.0.1:5000/api/history/${troopId}`);
            const historyData = await historyRes.json();
            setHistory(historyData);

            // Fetch cookie breakdown
            const breakdownRes = await fetch(`http://127.0.0.1:5000/api/cookie_breakdown/${troopId}`);
            const breakdownData = await breakdownRes.json();
            setCookieBreakdown(breakdownData);
        } catch (error) {
            console.error("Error fetching predictions:", error);
            alert("Failed to fetch predictions. Try again.");
        }
    };

    return (
        <div>
            <div className="background"></div>
            <div className="overlay"></div>
            <div className="header">
                <div>
                    <img src="/gs/GSC(2).png" alt="GSCI Logo" />
                    <img src="/gs/KREN.png" alt="KREN Logo" />
                </div>
                <a href="manual.html" className="manual">Manual</a>
            </div>
            <div className="title">Cookie Forecasting Model</div>
            <div className="subtitle">Forecasting Sales, One Cookie at a Time</div>

            <div className="input-container">
                <p>Enter the details below to forecast cookie sales</p>
                <div className="input-box">
                    Enter Troop ID:
                    <input
                        type="text"
                        list="troop-options"
                        value={troopId}
                        onChange={(e) => setTroopId(e.target.value)}
                    />
                    <datalist id="troop-options">
                        {troopIds.map(id => (
                            <option key={id} value={id} />
                        ))}
                    </datalist>
                </div>
                <div className="input-box">
                    Enter Number of Girls Participating:
                    <input
                        type="number"
                        value={numGirls}
                        onChange={(e) => setNumGirls(e.target.value)}
                    />
                </div>
                <button className="predict-button" onClick={handlePredict}>Predict</button>
            </div>

            <div className="predictions">PREDICTIONS</div>
            <div className="cookie-grid">
                {predictions.length > 0 ? (
                    predictions.map((cookie) => (
                        <div key={cookie.cookie_type} className="cookie-box">
                            <img src={cookie.image_url} alt={cookie.cookie_type} />
                            <div className="cookie-info">
                                <strong>{cookie.cookie_type}</strong><br />
                                Predicted Cases: {cookie.predicted_cases} <br />
                                Interval: [{cookie.interval_lower}, {cookie.interval_upper}]
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No predictions yet. Enter troop details above.</p>
                )}
            </div>

            <div className="analytics-title">ANALYTICS</div>
            <div className="analysis-section">
                <div className="analysis-box">
                    <h4>Total Cookie Sales by Year</h4>
                    <pre>{JSON.stringify(history.totalSalesByPeriod, null, 2)}</pre>
                </div>
                <div className="analysis-box">
                    <h4>Number of Girls (Avg) by Year</h4>
                    <pre>{JSON.stringify(history.girlsByPeriod, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
};

export default App;
