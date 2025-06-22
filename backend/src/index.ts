import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';
import { scrapeInstagramProfile } from './scraper'
import axios from 'axios'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rota para testar a conexão e criar a tabela
app.get('/setup', async (req: Request, res: Response) => {
  try {
    // Primeiro dropa a tabela se ela existir
    await pool.query('DROP TABLE IF EXISTS influencers;');
    
    // Recria a tabela com a estrutura atualizada
    await pool.query(`
      CREATE TABLE influencers (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        instagram TEXT NOT NULL UNIQUE,
        followers INT,
        bio TEXT,
        profile_pic_url TEXT,
        profile_tags TEXT[],
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_scrape_at TIMESTAMP WITH TIME ZONE
      );
    `);
    res.status(200).send('Tabela "influencers" recriada com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar a tabela.');
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('API da Plataforma de Influenciadoras está no ar!');
});

// Rota para salvar dados de uma influenciadora
app.post('/influencers', async (req, res) => {
  try {
    const { fullName, instagram, followers, bio, profilePicUrl, profile, notes } = req.body;
    console.log('Dados recebidos:', { fullName, instagram, followers, bio, profilePicUrl, profile, notes });

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

    console.log('Influenciadora salva com sucesso:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Erro detalhado ao salvar influenciadora:', error);
    
    // Tratamento específico para erro de chave única (instagram duplicado)
    if (error.code === '23505') {
      return res.status(400).json({ 
        error: 'Já existe uma influenciadora cadastrada com este Instagram.',
        detail: error.detail,
        code: error.code 
      });
    }
    
    res.status(500).json({ 
      error: 'Erro ao salvar influenciadora: ' + error.message,
      detail: error.detail,
      code: error.code 
    });
  }
});

// Rota para buscar todas as influenciadoras
app.get('/influencers', async (req: Request, res: Response) => {
  try {
    const allInfluencers = await pool.query('SELECT * FROM influencers ORDER BY created_at DESC');
    res.status(200).json(allInfluencers.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar influenciadoras.');
  }
});

// Rota para fazer proxy de imagens do Instagram
app.get('/proxy-image', async (req: Request, res: Response) => {
  try {
    const imageUrl = req.query.url as string
    if (!imageUrl) {
      return res.status(400).send('URL da imagem não fornecida')
    }

    const response = await axios.get(imageUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://www.instagram.com/',
      }
    })

    // Encaminha os headers de content-type
    res.set('Content-Type', response.headers['content-type'])
    // Pipe a resposta diretamente para o cliente
    response.data.pipe(res)
  } catch (error) {
    console.error('Erro ao fazer proxy da imagem:', error)
    res.status(500).send('Erro ao carregar imagem')
  }
})

// Rota para fazer scrape de um perfil do Instagram
app.post('/scrape', async (req: Request, res: Response) => {
  try {
    const { username } = req.body
    if (!username) {
      return res.status(400).json({ error: 'Username não fornecido' })
    }

    const data = await scrapeInstagramProfile(username)
    res.json(data)
  } catch (error) {
    console.error('Erro ao fazer scrape:', error)
    res.status(500).json({ error: error.message })
  }
})

// Exporta o app para uso serverless
export default app; 