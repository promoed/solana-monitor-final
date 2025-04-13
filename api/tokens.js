export default async function handler(req, res) {
  try {
    const response = await fetch('https://quote-api.jup.ag/v6/tokens');
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Ошибка при получении данных с API' });
    }
    
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}
