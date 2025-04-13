export default async function handler(req, res) {
  try {
    const mockData = [
      { symbol: "WIF", address: "WIF123", volume: 10234.56, growth: 356.8 },
      { symbol: "BONK", address: "BONK456", volume: 5432.10, growth: 178.3 },
      { symbol: "JTO", address: "JTO789", volume: 2300.00, growth: 90.1 }
    ];
    res.status(200).json(mockData);
  } catch (error) {
    console.error("Ошибка:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
}