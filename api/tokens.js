export default async function handler(req, res) {
  try {
    const fetch = (await import('node-fetch')).default;

    const response = await fetch("https://quote-api.jup.ag/v6/tokens");
    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Ответ от Jupiter:", text);
      return res.status(500).json({ error: "Jupiter API error", body: text });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("💥 Ошибка в API /tokens:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
