import { Pool } from 'pg';

// Em ambientes serverless como a Vercel, as variáveis de ambiente
// são injetadas diretamente, então o `dotenv` não é necessário.
// import dotenv from 'dotenv';
// dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool; 