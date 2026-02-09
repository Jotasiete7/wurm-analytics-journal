# Wurm Analytics

> Editorial journal for Wurm Online game mechanics research and statistical analysis.

## 🌐 Live Site

[Coming Soon - Cloudflare Pages]

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: TailwindCSS 4 + Custom CSS Variables
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router v7
- **Markdown**: react-markdown

## 📁 Project Structure

```
├── public/           # Static assets (logo, etc.)
├── src/
│   ├── components/   # Reusable UI (Sidebar, VoteControl, etc.)
│   ├── contexts/     # React Context (Auth, Language)
│   ├── layouts/      # Page layouts
│   ├── pages/        # Routes
│   │   ├── Admin/    # CMS (Dashboard, Editor, Login)
│   │   └── ...
│   ├── services/     # API layer (Supabase)
│   └── content/      # Type definitions
├── supabase/
│   ├── schema.sql    # Database structure
│   └── seed.sql      # Sample data
└── ...
```

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Jotasiete7/wurm-analytics-journal.git
cd wurm-analytics-journal
npm install
```

### 2. Supabase Setup

**See [`SETUP_SUPABASE.md`](./SETUP_SUPABASE.md)** for complete guide.

TL;DR:

1. Create Supabase project
2. Run `supabase/schema.sql` and `supabase/seed.sql`
3. Copy `.env.local.example` → `.env.local`
4. Add your Supabase URL and keys

### 3. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 📝 Features

### Public

- **Bilingual**: English/Portuguese content
- **Article System**: Categories (Analysis, Statistics, Investigation, Guide)
- **Voting**: Community endorsements
- **View Tracking**: Engagement metrics
- **Responsive**: Mobile-friendly design

### Admin (CMS)

- **Dashboard**: Article management
- **Editor**: Bilingual content creation
- **Authentication**: Email/password via Supabase

## 🎨 Design Philosophy

- **Editorial** minimalism
- **Monospace** accents (JetBrains Mono)
- **Gold Matte** (`#C5A059`) brand color
- **Deep Black** (`#050505`) background
- **High contrast** typography

## 📦 Build

```bash
npm run build
```

Output: `dist/`

## 🌍 Deploy

### Cloudflare Pages

1. Connect GitHub repo
2. Build settings:
   - **Command**: `npm run build`
   - **Output**: `dist`
3. Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 📄 License

MIT

## 🙏 Credits

Part of the **A Guilda** ecosystem.
