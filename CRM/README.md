# Monocle Immigration — Unified Platform

A single Next.js application combining a **public marketing website** and a **protected CRM dashboard**, built with TypeScript, Tailwind CSS v4, and Prisma ORM.

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Set environment (create .env)
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"

# Generate Prisma client
npx prisma generate

# Migrate database
npx prisma migrate deploy

# Start development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** — marketing site.  
Open **[http://localhost:3000/crm](http://localhost:3000/crm)** — CRM dashboard.

## 🔐 Authentication

- **JWT-based** login with HTTP-only secure cookies
- **Test credentials**:
  ```
  Email: admin@globalimsolutions.com
  Password: password123
  ```
- **Middleware protection** on `/crm/*` routes (except `/crm/login`)

## 📋 Core Features

| Feature                  | Details                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------- |
| **Authentication**       | JWT + HTTP-only cookies                                                                |
| **Multi-tenant**         | Company-scoped data isolation                                                          |
| **Enquiries Management** | Full CRUD, search/filter, view slide-over, edit modal                                  |
| **Applications**         | Full CRUD, search/filter, view slide-over, edit modal, create from enquiry or manually |
| **Responsive Design**    | Mobile, Tablet, Desktop layouts                                                        |
| **Database**             | PostgreSQL + Prisma ORM                                                                |
| **API**                  | REST endpoints with Zod validation                                                     |
| **Testing**              | Jest + React Testing Library                                                           |

## 📱 Routes

### Marketing (Public)

| Route       | Purpose       |
| ----------- | ------------- |
| `/`         | Homepage      |
| `/about`    | About page    |
| `/services` | Services page |
| `/contact`  | Contact page  |

### CRM (Protected — requires login)

| Route                    | Purpose                 |
| ------------------------ | ----------------------- |
| `/crm/login`             | Authentication page     |
| `/crm/dashboard`         | Main dashboard          |
| `/crm/enquiries`         | Manage client enquiries |
| `/crm/applications`      | Manage applications     |
| `/crm/applications/[id]` | Application detail      |

## 🚀 Database Schema

**Company**: Organization (multi-tenant)
**User**: Team member with JWT auth
**Enquiry**: Client inquiry/request with optional Application link
**Application**: Immigration application, created from Enquiry or manually (includes optional Drive Folder Link for shared team documents)

```
Company 1-N Users
Company 1-N Enquiries
Company 1-N Applications
Enquiry 1-1 Application (optional)
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- __tests__/app/api/applications.test.ts

# Coverage report
npm test -- --coverage
```

- Authentication — Login page, JWT utils, auth context, me, logout
- API Endpoints — Companies, Enquiries (JWT-auth CRUD), Applications
- Components — EnquiryTable, AddEnquiryModal, Sidebar, MobileHeader, etc.
- Pages — Dashboard (stats cards, pipeline, conditional styling), Login

See [TEST_PLAN.md](TEST_PLAN.md) for detailed test coverage.

## 📚 Key Technologies

- **Next.js 14** - App Router, SSR, API routes
- **React 18** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling (CSS-based config)
- **shadcn/ui** - UI component library
- **Prisma 6.19.2** - PostgreSQL ORM (Neon)
- **Zod** - Input validation
- **JWT** - Authentication
- **Geist** - Font family
- **Jest + RTL** - Testing

## 🎨 Design

- **Fixed Sidebar** (240px) on desktop
- **Mobile Hamburger** menu on small screens
- **Red accent** color theme
- **Professional SaaS** UI style
- **Responsive breakpoints**: Mobile < 640px, Tablet 640-768px, Desktop ≥ 768px

## 📖 Important Notes

### Environment Variables

See the [Security](#-security) section for required environment variables.

### Database Seeding

To populate test data:

```bash
npm run prisma:seed
```

Seeds demo data (15 enquiries, 8 applications) linked to the existing company.
Safe to re-run — cleans up previous demo data first.

### Company Scoping

⚠️ **IMPORTANT**: All APIs enforce company scoping:

- CompanyId always derived from JWT token (never from frontend)
- Users can only access their own company's data
- No cross-company data leakage

### JWT Details

- Algorithm: HS256
- Expiration: 7 days
- Storage: HTTP-only secure cookie
- Payload: `{ id, email, companyId, iat }`
- `JWT_SECRET` is required — the app will crash on startup if it's missing (no insecure fallback)

## 🛡️ Security

### HTTP Security Headers (`next.config.js`)

All responses include the following headers:

| Header                      | Value                                      | Purpose                         |
| --------------------------- | ------------------------------------------ | ------------------------------- |
| `X-Content-Type-Options`    | `nosniff`                                  | Prevents MIME-type sniffing     |
| `X-Frame-Options`           | `DENY`                                     | Blocks clickjacking via iframes |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`          | Controls referrer leakage       |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains`      | Enforces HTTPS for 2 years      |
| `X-DNS-Prefetch-Control`    | `on`                                       | Speeds up DNS resolution        |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()` | Disables unused browser APIs    |

### Authentication & Authorization

- JWT tokens are signed with `HS256` and stored as **HTTP-only cookies** (not accessible via JavaScript)
- Middleware on `/crm/*` routes redirects unauthenticated users to login
- Every API route independently verifies the JWT signature — middleware alone is not the security boundary
- `companyId` is always extracted from the JWT (never from the frontend), enforcing **multi-tenant data isolation**

### Input Validation

- All API inputs validated with **Zod schemas** (shared from `lib/validation/`)
- String fields have max-length limits to prevent abuse
- Date of Birth validation uses a fresh `new Date()` per request (not a stale module-level value)

### Database

- `@@index([companyId])` on Enquiry and Application tables for query performance
- All queries are company-scoped via JWT-derived `companyId`
- Prisma ORM prevents SQL injection

### Environment Variables

```
DATABASE_URL=postgresql://user:password@host/db   # Required
JWT_SECRET=your-secret-key-min-32-chars            # Required — app crashes if missing
```

## 🔍 SEO & Discoverability

### Server-Side Rendering for SEO

All marketing pages use a **Server Component → Client Component** split pattern:

- `page.tsx` (Server Component) — exports Next.js `Metadata` and renders the client component
- `*Client.tsx` (Client Component) — contains the interactive UI (`"use client"`)

This ensures Google receives fully-rendered HTML with proper `<title>` and `<meta>` tags on first load, while preserving client-side interactivity.

### Per-Page Metadata

Each marketing page exports unique, keyword-rich metadata via the Next.js Metadata API:

| Page        | Title                                                        |
| ----------- | ------------------------------------------------------------ |
| `/`         | Immigration Consultant in Calgary & Brandon — Consultation   |
| `/services` | Canadian Immigration Services — Study, Work & PR Permits     |
| `/about`    | About Rupinder Bhatti — RCIC Licensed Immigration Consultant |
| `/contact`  | Contact Monocle Immigration — Calgary & Brandon Offices      |

All pages follow the template pattern: `%s | Monocle Immigration`

### Sitemap & Robots

- **`app/sitemap.ts`** — Auto-generates `/sitemap.xml` listing all 4 public pages with priorities and change frequencies
- **`app/robots.ts`** — Auto-generates `/robots.txt` that allows public pages, blocks `/crm/` and `/api/` from crawlers, and points to the sitemap

### Structured Data (JSON-LD)

- **LocalBusiness** (marketing layout) — Business name, two office addresses (Calgary AB + Brandon MB), phone, email, hours, and social media links (LinkedIn, X, Instagram, Facebook)
- **FAQPage** (contact page) — 8 Q&A pairs eligible for Google rich snippets

### Open Graph & Social Cards

All pages include Open Graph metadata (`og:title`, `og:description`, `og:type`, `og:locale`) for proper previews when shared on LinkedIn, Facebook, X, and messaging apps.

### Authentication

- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Enquiries

- `GET /api/enquiries` - List company's enquiries (JWT-scoped)
- `POST /api/enquiries` - Create new enquiry (companyId from JWT)
- `GET /api/enquiries/[id]` - Get enquiry details (with application data)
- `PUT /api/enquiries/[id]` - Update enquiry
- `DELETE /api/enquiries/[id]` - Delete enquiry
- All endpoints enforce company ownership via JWT token

### Applications

- `GET /api/applications` - List company's applications (JWT-scoped)
- `POST /api/applications` - Create application manually (companyId from JWT)
- `POST /api/applications/from-enquiry` - Create from existing enquiry
- `GET /api/applications/[id]` - Get application details (with enquiry data)
- `PUT /api/applications/[id]` - Update application
- `DELETE /api/applications/[id]` - Delete application
- All endpoints enforce company ownership via JWT token

### Companies

- `GET /api/companies` - List all companies (public)

## 🐛 Debugging

Set environment variable to see debug logs:

```bash
DEBUG=* npm run dev
```

Check **Next.js terminal** for server-side Prisma logs.
Check **Browser console** for client-side activity.

## 📝 File Structure

```
app/
├── (marketing)/             # Public marketing website (route group)
│   ├── layout.tsx           # Marketing layout (Header + Footer)
│   ├── page.tsx             # Homepage
│   ├── about/page.tsx
│   ├── services/page.tsx
│   └── contact/page.tsx
├── crm/                     # Protected CRM dashboard
│   ├── layout.tsx           # CRM layout (Sidebar + Auth)
│   ├── page.tsx             # CRM welcome page
│   ├── dashboard/page.tsx
│   ├── enquiries/page.tsx
│   ├── applications/page.tsx
│   ├── applications/[id]/page.tsx
│   └── login/page.tsx
├── api/                     # REST API endpoints
│   ├── auth/                # Login, logout, me
│   ├── companies/
│   ├── enquiries/
│   └── applications/
├── layout.tsx               # Root layout (minimal shell)
├── globals.css              # Tailwind v4 + shadcn theme
└── not-found.tsx

components/
├── marketing/               # Marketing site components
│   ├── Header.tsx
│   └── Footer.tsx
├── ui/                      # shadcn/ui component library
├── applications/            # CRM application components
├── enquiries/               # CRM enquiry components
├── DashboardClient.tsx
├── Sidebar.tsx
├── MobileHeader.tsx
├── MobileSidebar.tsx
├── ClientLayout.tsx
└── ResponsiveLayout.tsx

lib/
├── auth-server.ts     # Server-side auth utilities
├── jwt.ts             # JWT handling
├── validation/        # Zod schemas
└── prisma.ts          # Prisma client
```

## 🙋 Support

1. Check [TEST_PLAN.md](TEST_PLAN.md) for testing details
2. Check [RESPONSIVE_DESIGN.md](RESPONSIVE_DESIGN.md) for layout info
3. Review test files for usage examples
4. Check API route comments for endpoint details

---

**Version**: 2.0 | **Last Updated**: April 2026
