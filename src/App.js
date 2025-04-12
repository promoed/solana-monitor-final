import React, { useEffect, useState } from "react";

export default function App() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const VOLUME_THRESHOLD = 2.0;

  const fetchTokens = async () => {
    try {
      const response = await fetch("/api/tokens");
      if (!response.ok) throw new Error("API request failed");

      const result = await response.json();
      const tokensData = result.tokens.map(token => {
        const volumeChange = Math.random() * 3;
        const spike = volumeChange > VOLUME_THRESHOLD;

        return {
          ...token,
          volumeChange,
          spike
        };
      });

      setTokens(tokensData);
      setLoading(false);
    } catch (err) {
      console.error("Ошибка при загрузке токенов:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Solana Volume Monitor (через proxy)</h1>
      {loading && <p>Загрузка данных...</p>}
      {error && <p style={{ color: 'red' }}>Ошибка при загрузке токенов.</p>}
      {!loading && !error && tokens.length === 0 && <p>Нет токенов для отображения.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {tokens.map(token => (
          <div key={token.address} style={{
            border: token.spike ? '2px solid red' : '1px solid #ccc',
            borderRadius: '8px',
            padding: '12px'
          }}>
            <h2 style={{ marginBottom: '8px' }}>{token.symbol}</h2>
            {token.spike && <p style={{ color: 'red', fontWeight: 'bold' }}>🚀 Псевдо-рост +{(token.volumeChange * 100).toFixed(0)}%</p>}
            <p>Цена: ${token.price?.toFixed(6)}</p>
            <p>Имя токена: {token.name}</p>
            <p>Адрес: {token.address.slice(0, 6)}...{token.address.slice(-4)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}