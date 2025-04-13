export default async function handler(req, res) {
  res.status(200).json([
    { symbol: "TEST", volume: 123.45, growth: 78.9 },
    { symbol: "ABC", volume: 55.5, growth: 120.3 }
  ]);
}