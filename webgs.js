import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // Make sure to create and import the styles

const cookies = [
  { name: "Adventurefuls", image: "/ADVEN.png" },
  { name: "Do-Si-Dos", image: "/DOSI.png" },
  { name: "Lemon-Ups", image: "/LMNUP.png" },
  { name: "Samoas", image: "/SAM.png" },
  { name: "Tagalongs", image: "/TAG.png" },
  { name: "Thin Mints", image: "/THIN.png" },
  { name: "Toffee-Tastic", image: "/TFTAS.png" },
  { name: "Trefoils", image: "/TREF.png" },
  { name: "S'mores", image: "/SMORE.png" }
];

const HomePage = () => {
  const [troopId, setTroopId] = useState("");
  const [numGirls, setNumGirls] = useState("");
  const [predictions, setPredictions] = useState([]);

  const predictSales = async () => {
    if (!troopId || !numGirls) {
      alert("Please enter both Troop ID and Number of Girls.");
      return;
    }

    try {
      // Simulated API call - Replace with your actual Flask API
      const res = await fetch("http://127.0.0.1:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ troop_id: troopId, num_girls: numGirls })
      });

      const data = await res.json();

      // Updating predictions dynamically
      setPredictions(
        cookies.map((cookie) => ({
          ...cookie,
          predictedCases: data[cookie.name]?.predicted_cases || "--",
          interval: `[${data[cookie.name]?.interval_lower || "--"}, ${data[cookie.name]?.interval_upper || "--"}]`
        }))
      );
    } catch (error) {
      console.error("Error fetching predictions:", error);
      alert("Error fetching predictions. Please check your API.");
    }
  };

  return (
    <div>
      <div className="background"></div>
      <div className="overlay"></div>
      <div className="header">
        <div>
          <img src="/GSC(2).png" alt="GSCI Logo" />
          <img src="/KREN.png" alt="KREN Logo" />
        </div>
        <Link to="/manual" className="manual">Manual</Link>
      </div>
      <div className="title">Cookie Forecasting Model</div>
      <div className="subtitle">Forecasting Sales, One Cookie at a Time</div>

      <div className="input-container">
        <p>Enter the details below to forecast cookie sales</p>
        <div className="input-box">
          Enter Troop ID: <input type="text" value={troopId} onChange={(e) => setTroopId(e.target.value)} />
        </div>
        <div className="input-box">
          Enter Number of Girls Participating: <input type="text" value={numGirls} onChange={(e) => setNumGirls(e.target.value)} />
        </div>
        <button className="predict-button" onClick={predictSales}>Predict</button>
      </div>

      <div className="predictions">PREDICTIONS</div>
      
      <div className="cookie-grid">
        {predictions.map((cookie) => (
          <div key={cookie.name} className="cookie-box">
            <img src={cookie.image} alt={cookie.name} />
            <div className="cookie-info">
              <strong>{cookie.name}</strong><br />
              Predicted Cases: {cookie.predictedCases}<br />
              Interval: {cookie.interval}
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-title">ANALYTICS</div>
      
      <div className="analysis-section">
        <div className="analysis-box">Analytics Box 1</div>
        <div className="analysis-box">Analytics Box 2</div>
      </div>
    </div>
  );
};

export default HomePage;
