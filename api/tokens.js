export default async function handler(req, res) {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch("https://quote-api.jup.ag/v6/tokens");

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: "Jupiter API error", status: response.status, body: text });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Ошибка прокси:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}