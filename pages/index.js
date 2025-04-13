import React, { useEffect, useState } from "react";

export default function Home() {
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tokens")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error("Ошибка загрузки: " + text);
        }
        return res.json();
      })
      .then(setTokens)
      .catch((err) => {
        console.error("Ошибка при загрузке токенов:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Solana Volume Monitor (Helius)</h1>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

      {!loading && !error && tokens.length === 0 && (
        <p>Нет токенов с объёмами за последнюю минуту.</p>
      )}

      {!loading && tokens.length > 0 && (
        <table style={{ borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", padding: "6px" }}>Токен</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "6px" }}>Объём</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "6px" }}>Прирост (%)</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr key={index}>
                <td style={{ padding: "6px" }}>{token.symbol}</td>
                <td style={{ padding: "6px" }}>{token.volume.toFixed(2)}</td>
                <td style={{ padding: "6px" }}>{token.growth.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}