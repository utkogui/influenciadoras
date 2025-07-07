# Deploy no Render

## 1. Criar conta no Render
- Acesse: https://render.com
- Faça login com GitHub
- Clique em "New" → "Web Service"

## 2. Conectar repositório
- Selecione o repositório `influenciadoras`
- Escolha a branch `main`

## 3. Configurar o serviço
- **Name:** `plataforma-influenciadoras`
- **Environment:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

## 4. Configurar variáveis de ambiente
- **NODE_ENV:** `production`
- **DATABASE_URL:** `postgres://postgres.yzgaekxevdfxnabuoxao:m1Y4zWP8zI2YGeMw@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x`

## 5. Deploy
- Clique em "Create Web Service"
- Aguarde o build e deploy

## 6. Configurar banco de dados
Após o deploy, execute o script SQL no Supabase:
```sql
-- Criação da tabela influencers
CREATE TABLE IF NOT EXISTS influencers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    instagram VARCHAR(255) UNIQUE NOT NULL,
    followers INTEGER,
    bio TEXT,
    profile_pic_url TEXT,
    profile_tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_influencers_instagram ON influencers(instagram);
CREATE INDEX IF NOT EXISTS idx_influencers_created_at ON influencers(created_at);

-- Função para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger
CREATE TRIGGER update_influencers_updated_at 
    BEFORE UPDATE ON influencers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Dados de exemplo
INSERT INTO influencers (full_name, instagram, followers, bio, profile_pic_url, profile_tags, notes) VALUES
('Maria Silva', 'maria_silva', 50000, 'Influenciadora de moda e lifestyle', 'https://example.com/maria.jpg', ARRAY['moda', 'lifestyle'], 'Contato preferencial via WhatsApp'),
('João Santos', 'joao_santos', 75000, 'Especialista em tecnologia e reviews', 'https://example.com/joao.jpg', ARRAY['tecnologia', 'reviews'], 'Disponível para parcerias'),
('Ana Costa', 'ana_costa', 120000, 'Beleza e maquiagem', 'https://example.com/ana.jpg', ARRAY['beleza', 'maquiagem'], 'Engajamento alto');
```

## 7. Testar
- Acesse a URL fornecida pelo Render
- Teste as funcionalidades de cadastro e visualização 