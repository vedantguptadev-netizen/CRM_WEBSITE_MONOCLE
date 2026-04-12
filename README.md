# Monocle Immigration

Unified Next.js application combining a **public marketing website** and a **protected CRM dashboard**.

## Structure

```
CRM/              # Single Next.js 14 app
├── Marketing     # Public site at / (homepage, about, services, contact)
└── CRM           # Protected dashboard at /crm/* (login, dashboard, enquiries, applications)
```

## Getting Started

```bash
cd CRM
npm install
cp .env.example .env   # Add your DATABASE_URL and JWT_SECRET
npx prisma generate
npx prisma migrate deploy
npm run dev
```

- **Marketing site**: http://localhost:3000
- **CRM dashboard**: http://localhost:3000/crm

See [CRM/README.md](CRM/README.md) for full documentation.