# 🚀 Guia de Configuração do Supabase

## 1️⃣ Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login (ou crie uma conta)
3. Clique em **"New Project"**
4. Preencha:
   - **Name**: `wurm-analytics`
   - **Database Password**: (crie uma senha forte e GUARDE)
   - **Region**: São Paulo (ou mais próximo)
5. Aguarde ~2 minutos para o projeto ser criado

---

## 2️⃣ Executar Scripts SQL

### 2.1 Schema (Estrutura)

1. No menu lateral, vá em **SQL Editor**
2. Clique em **"New Query"**
3. Copie TODO o conteúdo de `supabase/schema.sql`
4. Cole no editor
5. Clique em **"Run"** (ou `Ctrl+Enter`)
6. ✅ Deve aparecer "Success. No rows returned"

### 2.2 Seed (Dados iniciais)

1. Repita o processo acima com `supabase/seed.sql`
2. ✅ Deve inserir 3 artigos de exemplo

### 2.3 Verificar

1. Vá em **Table Editor**
2. Clique na tabela `articles`
3. Deve ver 3 registros

---

## 3️⃣ Pegar Credenciais da API

1. No menu lateral, vá em **Settings** (engrenagem) → **API**
2. Copie dois valores:

   **Project URL**:

   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon public** (key):

   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
   ```

---

## 4️⃣ Configurar Variáveis Locais

1. Na **raiz do projeto** (`C:\Users\Pichau\ecosystem\analytics`), crie o arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

1. **Substitua** pelos valores reais que você copiou.

---

## 5️⃣ Testar Localmente

```bash
# Reinicie o servidor
Ctrl+C  # parar o servidor atual
npm run dev
```

Acesse `http://localhost:5173` → Deve **carregar os 3 artigos** sem erros no console.

---

## 6️⃣ Criar Conta Admin

### Via SQL Editor

```sql
-- Substitua email/senha pelos seus
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'seu-email@exemplo.com',
  crypt('SuaSenhaSegura123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  ''
);
```

**OU** simplesmente use a UI:

1. Vá em **Authentication** → **Users**
2. Clique em **"Add user"** → **"Create new user"**
3. Preencha email e senha

---

## 7️⃣ Deploy no Cloudflare

### 7.1 Conectar GitHub

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com)
2. Vá em **Pages** → **Create a project**
3. Conecte sua conta GitHub
4. Selecione o repositório `wurm-analytics-journal`

### 7.2 Configurações de Build

- **Build command**: `npm run build`
- **Build output directory**: `dist`

### 7.3 Environment Variables

Adicione as mesmas variáveis:

- `VITE_SUPABASE_URL` = (sua URL)
- `VITE_SUPABASE_ANON_KEY` = (sua chave)

### 7.4 Deploy

Clique em **"Save and Deploy"** 🚀

---

## ✅ Checklist Final

- [ ] Projeto Supabase criado
- [ ] `schema.sql` executado
- [ ] `seed.sql` executado
- [ ] 3 artigos visíveis no Table Editor
- [ ] `.env.local` criado com credenciais
- [ ] Site local funcionando sem erros
- [ ] Usuário admin criado
- [ ] Deploy no Cloudflare com env vars
- [ ] Site público acessível

---

## 🆘 Problemas Comuns

### "Failed to load 'im'"

- Verifique se `.env.local` existe e tem as chaves corretas
- Reinicie o servidor após criar/editar `.env.local`

### "Error: relation 'articles' does not exist"

- Execute `schema.sql` primeiro, depois `seed.sql`

### Página em branco

- Abra DevTools (F12) → Console
- Verifique erros de conexão
