# Configuração do Banco de Dados em Produção (Supabase)

## 1. Crie seu banco no Supabase
- Acesse https://app.supabase.com/
- Crie um projeto e anote a senha do banco

## 2. Use a seguinte string de conexão:

```
postgresql://postgres:Matilha0108!@#@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 3. Configure a variável de ambiente `DATABASE_URL` no Render com essa string.

## 4. Execute o script SQL no Supabase para criar a tabela `influencers`.

## 5. Pronto! Não use mais localhost. 