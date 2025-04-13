export default async function handler(req, res) {
  const HELIUS_API_KEY = "ce5f456e-00cf-472f-9817-e26c8a7825cd";
  const now = Math.floor(Date.now() / 1000);
  const oneMinuteAgo = now - 60;

  const orcaProgram = "9WwG2wz7Kz6v7Q3vfs5XpD8TxN4Gc7RZUR2RZbQq3Vjd";

  try {
    const url = `https://api.helius.xyz/v0/transactions?api-key=${HELIUS_API_KEY}`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: { from: oneMinuteAgo, to: now },
        limit: 1000,
        accountType: "token",
        programId: orcaProgram,
        transactionTypes: ["SWAP"]
      })
    };

    const heliusResponse = await fetch(url, options);

    if (!heliusResponse.ok) {
      const text = await heliusResponse.text();
      console.error("❌ Helius error:", heliusResponse.status, text);
      return res.status(heliusResponse.status).json({ error: "Helius error", text });
    }

    const data = await heliusResponse.json();
    const txs = Array.isArray(data) ? data : data.transactions || [];

    const volumeByToken = {};
    txs.forEach(tx => {
      const events = tx.tokenTransfers || [];
      events.forEach(e => {
        if (!e.mint || isNaN(e.amount)) return;
        const token = e.mint;
        const amount = Number(e.amount) / Math.pow(10, e.decimals || 6);
        if (!volumeByToken[token]) volumeByToken[token] = 0;
        volumeByToken[token] += amount;
      });
    });

    const result = Object.entries(volumeByToken)
      .map(([address, volume]) => ({
        address,
        volume,
        symbol: address.slice(0, 4),
        growth: Math.random() * 300 + 50
      }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 100);

    res.status(200).json(result);
  } catch (error) {
    console.error("💥 Fetch or processing error:", error);
    res.status(500).json({ error: "Unhandled error", message: error.message });
  }
}
