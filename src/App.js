import React, { useEffect, useState } from "react";

export default function App() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/tokens");
      const data = await response.json();
      setTokens(data);
    } catch (err) {
      console.error("Ошибка при загрузке данных:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Solana Volume Monitor (Helius)</h1>
      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>Ошибка при загрузке данных</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
        {tokens.map((token, index) => (
          <div key={index} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "12px" }}>
            <h3>{token.symbol}</h3>
            <p>Объём: ${token.volume.toFixed(2)}</p>
            <p>Рост: +{token.growth.toFixed(1)}%</p>
            <a href={`https://birdeye.so/token/${token.address}`} target="_blank" rel="noopener noreferrer">📈 Смотреть график</a>
          </div>
        ))}
      </div>
    </div>
  );
}