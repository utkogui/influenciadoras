import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Função para criar/atualizar a tabela
async function setupDatabase() {
  try {
    // Primeiro, tenta dropar a tabela existente (como estamos em desenvolvimento)
    await pool.query(`
      DROP TABLE IF EXISTS influencers;
    `);

    // Cria a tabela com a estrutura correta
    await pool.query(`
      CREATE TABLE influencers (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        instagram VARCHAR(255) NOT NULL,
        followers INTEGER,
        bio TEXT,
        profile_pic_url TEXT,
        profile TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Executa o setup do banco de dados ao iniciar
setupDatabase();

export default pool; 