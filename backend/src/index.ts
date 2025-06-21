import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';
import { scrapeInstagramProfile } from './scraper'

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota para testar a conexão e criar a tabela
app.get('/setup', async (req: Request, res: Response) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS influencers (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        instagram VARCHAR(255) NOT NULL UNIQUE,
        followers INT,
        bio TEXT,
        profile_pic_url VARCHAR(255),
        profile_tags VARCHAR(255)[],
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    res.status(200).send('Tabela "influencers" criada com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar a tabela.');
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('API da Plataforma de Influenciadoras está no ar!');
});

// Rota para criar uma nova influenciadora
app.post('/influencers', async (req: Request, res: Response) => {
  try {
    const { fullName, instagram, profile, notes } = req.body;

    if (!fullName || !instagram) {
      return res.status(400).json({ error: 'Nome completo e Instagram são obrigatórios.' });
    }

    const profileTags = profile ? profile.split(',').map((tag: string) => tag.trim()) : [];

    const newInfluencer = await pool.query(
      `INSERT INTO influencers (full_name, instagram, profile_tags, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [fullName, instagram, profileTags, notes]
    );

    res.status(201).json(newInfluencer.rows[0]);
  } catch (err: any) {
    console.error(err);
    if (err.code === '23505') {
        res.status(409).json({ error: 'Este @Instagram já foi cadastrado.' });
        return;
    }
    res.status(500).send('Erro ao cadastrar influenciadora.');
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

// Rota para fazer o scrape de um perfil do Instagram
app.post('/scrape', async (req: Request, res: Response) => {
  const { instagram } = req.body;
  if (!instagram) {
    res.status(400).json({ error: 'O @instagram é obrigatório.' });
    return;
  }

  try {
    const data = await scrapeInstagramProfile(instagram);
    res.status(200).json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido durante o scraping.';
    res.status(500).json({ error: errorMessage });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
}); 