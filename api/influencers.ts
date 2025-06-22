import { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../backend/src/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Habilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Trata requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const allInfluencers = await pool.query('SELECT * FROM influencers ORDER BY created_at DESC');
      return res.status(200).json(allInfluencers.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar influenciadoras.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { fullName, instagram, followers, bio, profilePicUrl, profile, notes } = req.body;

      // Validação básica
      if (!fullName || !instagram) {
        return res.status(400).json({ error: 'Nome e Instagram são obrigatórios' });
      }

      // Converte o profile em array se for string
      let profileTags = null;
      if (profile) {
        profileTags = Array.isArray(profile) ? profile : profile.split(',').map(tag => tag.trim());
      }

      const result = await pool.query(
        `INSERT INTO influencers 
         (full_name, instagram, followers, bio, profile_pic_url, profile_tags, notes, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
         RETURNING *`,
        [
          fullName,
          instagram,
          followers || null,
          bio || null,
          profilePicUrl || null,
          profileTags,
          notes || null
        ]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error('Erro ao salvar influenciadora:', error);
      
      if (error.code === '23505') {
        return res.status(400).json({ 
          error: 'Já existe uma influenciadora cadastrada com este Instagram.',
          detail: error.detail,
          code: error.code 
        });
      }
      
      return res.status(500).json({ 
        error: 'Erro ao salvar influenciadora: ' + error.message,
        detail: error.detail,
        code: error.code 
      });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
} 