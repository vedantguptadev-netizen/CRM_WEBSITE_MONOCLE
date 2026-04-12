# Immigration CRM Dashboard

A professional, fully responsive CRM built with Next.js, TypeScript, Tailwind CSS, and Prisma ORM.

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Set environment (create .env.local)
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"

# Migrate database
npx prisma migrate deploy

# Start development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

## 🔐 Authentication

- **JWT-based** login with HTTP-only secure cookies
- **Test credentials**:
  ```
  Email: admin@globalimsolutions.com
  Password: password123
  ```
- **Middleware protection** on all routes except `/login`

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

| Route           | Purpose                 |
| --------------- | ----------------------- |
| `/login`        | Authentication page     |
| `/dashboard`    | Main dashboard          |
| `/enquiries`    | Manage client enquiries |
| `/applications` | Manage applications     |

## 🚀 Database Schema

**Company**: Organization (multi-tenant)
**User**: Team member with JWT auth
**Enquiry**: Client inquiry/request with optional Application link
**Application**: Immigration application, created from Enquiry or manually

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
- **Tailwind CSS** - Styling
- **Prisma 6.19.2** - PostgreSQL ORM
- **Zod** - Input validation
- **JWT** - Authentication
- **Jest + RTL** - Testing

## 🎨 Design

- **Fixed Sidebar** (240px) on desktop
- **Mobile Hamburger** menu on small screens
- **Red accent** color theme
- **Professional SaaS** UI style
- **Responsive breakpoints**: Mobile < 640px, Tablet 640-768px, Desktop ≥ 768px

## 📖 Important Notes

### Environment Variables

```
DATABASE_URL=postgresql://user:password@host/db
JWT_SECRET=your-secret-key-min-32-chars
```

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

## 🔍 API Endpoints

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
├── api/
│   ├── auth/            # Authentication endpoints
│   ├── companies/       # Company endpoints
│   ├── enquiries/       # Enquiry endpoints
│   └── applications/    # Application endpoints
├── applications/        # Application pages
├── dashboard/          # Dashboard page
├── enquiries/          # Enquiry pages
└── login/              # Login page

components/
├── applications/
│   ├── ApplicationTableNew.tsx      # Data table with badges, actions, skeleton
│   ├── ApplicationsPageClient.tsx   # Page orchestrator (search, filter, pagination)
│   ├── AddApplicationModal.tsx      # Create application modal
│   ├── EditApplicationModal.tsx     # Edit application modal
│   └── ApplicationDetailClient.tsx  # Full detail page (/applications/[id])
├── enquiries/
│   ├── EnquiryTableNew.tsx      # Data table with badges, actions, skeleton
│   ├── EnquiryPageClient.tsx    # Page orchestrator (search, filter, pagination)
│   ├── AddEnquiryModal.tsx      # Create enquiry modal
│   ├── EditEnquiryModal.tsx     # Edit enquiry modal
│   └── ViewEnquirySlideOver.tsx # Enquiry detail slide-over panel
├── DashboardClient.tsx   # Dashboard client component (stats + pipeline)
├── Sidebar.tsx           # Desktop sidebar
├── MobileHeader.tsx      # Mobile header
└── ResponsiveLayout.tsx  # Responsive controller

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

**Version**: 1.1 | **Last Updated**: April 2026
