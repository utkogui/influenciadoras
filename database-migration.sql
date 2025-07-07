-- Script de migração para criar a tabela influencers
-- Execute este script no PostgreSQL local

-- Conectar ao banco: psql -U postgres -d influenciadoras -f database-migration.sql

-- Criar a tabela influencers
CREATE TABLE IF NOT EXISTS influencers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    instagram VARCHAR(255) UNIQUE NOT NULL,
    followers INTEGER,
    bio TEXT,
    profile_pic_url TEXT,
    profile_tags TEXT[], -- Array de tags
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_influencers_instagram ON influencers(instagram);
CREATE INDEX IF NOT EXISTS idx_influencers_created_at ON influencers(created_at);

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_influencers_updated_at 
    BEFORE UPDATE ON influencers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO influencers (full_name, instagram, followers, bio, profile_pic_url, profile_tags, notes) VALUES
('Maria Silva', 'maria_silva', 50000, 'Influenciadora de moda e lifestyle', 'https://example.com/maria.jpg', ARRAY['moda', 'lifestyle'], 'Contato preferencial via WhatsApp'),
('João Santos', 'joao_santos', 75000, 'Especialista em tecnologia e reviews', 'https://example.com/joao.jpg', ARRAY['tecnologia', 'reviews'], 'Disponível para parcerias'),
('Ana Costa', 'ana_costa', 120000, 'Beleza e maquiagem', 'https://example.com/ana.jpg', ARRAY['beleza', 'maquiagem'], 'Engajamento alto');

-- Verificar se a tabela foi criada
SELECT 'Tabela influencers criada com sucesso!' as status; 