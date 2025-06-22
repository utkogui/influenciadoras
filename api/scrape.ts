import { VercelRequest, VercelResponse } from '@vercel/node';
import { scrapeInstagramProfile } from '../backend/src/scraper';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Habilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Trata requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ error: 'Username não fornecido' });
      }

      const data = await scrapeInstagramProfile(username);
      return res.json(data);
    } catch (error: any) {
      console.error('Erro ao fazer scrape:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
} 