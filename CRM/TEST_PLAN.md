# Test Plan - Immigration CRM Dashboard

## Overview

Comprehensive testing strategy with 200 passing tests across Jest and React Testing Library. Covers authentication, API endpoints (JWT-based), components, pages, and responsive behavior.

## Current Status

✅ **217 Tests Passing** | 18 test suites, all green

| Category       | Tests   | Status      |
| -------------- | ------- | ----------- |
| Authentication | 49      | ✅ Pass     |
| API Endpoints  | 35      | ✅ Pass     |
| Components     | 99      | ✅ Pass     |
| Pages          | 35      | ✅ Pass     |
| **Total**      | **217** | **✅ Pass** |

## Test Areas

### 1. Authentication Tests (49 tests)

#### Login Page Component

**File**: `__tests__/app/login.test.tsx` (14 tests)

| Test Case                                | Status  |
| ---------------------------------------- | ------- |
| Page renders login form                  | ✅ Pass |
| Email input field renders                | ✅ Pass |
| Password input field renders             | ✅ Pass |
| Login button renders                     | ✅ Pass |
| Email input accepts value changes        | ✅ Pass |
| Password input accepts value changes     | ✅ Pass |
| Form submission calls API endpoint       | ✅ Pass |
| Loading spinner shows during submission  | ✅ Pass |
| Submit button is disabled during loading | ✅ Pass |
| Error message displays on failed login   | ✅ Pass |
| Error message clears on input change     | ✅ Pass |
| Successful login redirects to /dashboard | ✅ Pass |
| Validates required email field           | ✅ Pass |
| Validates required password field        | ✅ Pass |

#### Login API Endpoint

**File**: `__tests__/app/api/auth/login.test.ts` (17 tests)

| Test Case                              | Status  |
| -------------------------------------- | ------- |
| Returns 400 for missing email field    | ✅ Pass |
| Returns 400 for missing password field | ✅ Pass |
| Returns 400 for empty email string     | ✅ Pass |
| Returns 400 for empty password string  | ✅ Pass |
| Returns 401 for non-existent user      | ✅ Pass |
| Returns 401 for incorrect password     | ✅ Pass |
| Returns 200 on successful login        | ✅ Pass |
| Sets authToken HTTP-only cookie        | ✅ Pass |
| Cookie has secure flag in production   | ✅ Pass |
| Cookie has SameSite=Lax                | ✅ Pass |
| Cookie expires in 7 days               | ✅ Pass |
| Returns companyId in response          | ✅ Pass |
| Returns userId in response             | ✅ Pass |
| Returns success: true in response      | ✅ Pass |
| Response structure is correct          | ✅ Pass |
| Does not return password in response   | ✅ Pass |
| Prisma client integration works        | ✅ Pass |

#### JWT Token Utilities

**File**: `__tests__/lib/jwt.test.ts` (18 tests)

| Test Case                                    | Status  |
| -------------------------------------------- | ------- |
| signToken creates HS256 JWT token            | ✅ Pass |
| Token is signed with JWT_SECRET              | ✅ Pass |
| Token payload includes userId                | ✅ Pass |
| Token payload includes email                 | ✅ Pass |
| Token payload includes companyId             | ✅ Pass |
| Token expires in 7 days                      | ✅ Pass |
| verifyToken successfully decodes valid token | ✅ Pass |
| verifyToken returns correct payload          | ✅ Pass |
| verifyToken rejects expired token            | ✅ Pass |
| verifyToken rejects tampered token           | ✅ Pass |
| verifyToken rejects empty string             | ✅ Pass |
| extractTokenFromHeader parses Bearer format  | ✅ Pass |
| extractTokenFromHeader handles null header   | ✅ Pass |
| extractTokenFromHeader handles empty string  | ✅ Pass |
| extractTokenFromHeader rejects malformed     | ✅ Pass |
| extractTokenFromHeader rejects wrong type    | ✅ Pass |
| extractTokenFromHeader handles extra spaces  | ✅ Pass |
| Sign, extract, verify token end-to-end       | ✅ Pass |

#### Auth Context

**File**: `__tests__/lib/auth-context.test.tsx` (6 tests)

| Test Case                               | Status  |
| --------------------------------------- | ------- |
| Provides initial loading state          | ✅ Pass |
| Sets user data when token is valid      | ✅ Pass |
| Sets user to null when token is invalid | ✅ Pass |
| Calls logout endpoint and clears user   | ✅ Pass |
| Throws error outside AuthProvider       | ✅ Pass |
| Calls /api/auth/me on provider mount    | ✅ Pass |

#### Auth Me & Logout Endpoints

**File**: `__tests__/app/api/auth/me.test.ts` (4 tests) | `__tests__/app/api/auth/logout.test.ts` (4 tests)

| Test Case                             | Status  |
| ------------------------------------- | ------- |
| Returns 401 when no token is present  | ✅ Pass |
| Returns 401 when token is invalid     | ✅ Pass |
| Returns user data when token is valid | ✅ Pass |
| Does not include sensitive data       | ✅ Pass |
| Returns 200 on successful logout      | ✅ Pass |
| Clears the authToken cookie           | ✅ Pass |
| Sets HttpOnly flag on cookie clear    | ✅ Pass |
| Sets SameSite=Lax on cookie clear     | ✅ Pass |

### 2. API Endpoint Tests (35 tests)

#### Companies API

**File**: `__tests__/app/api/companies.test.ts` (9 tests)

| Test Case                           | Status  |
| ----------------------------------- | ------- |
| Returns all companies               | ✅ Pass |
| Validates GET request               | ✅ Pass |
| Returns proper response format      | ✅ Pass |
| Handles empty company list          | ✅ Pass |
| Database integration works          | ✅ Pass |
| Error handling for invalid requests | ✅ Pass |
| Response status is correct          | ✅ Pass |
| Prisma client integration works     | ✅ Pass |
| Handles multiple companies          | ✅ Pass |

#### Enquiries API (JWT-authenticated)

**File**: `__tests__/app/api/enquiries.test.ts` (15 tests)

Mocks `cookies()` + `verifyToken()` for JWT authentication. CompanyId derived from token, never from request body.

| Test Case                                      | Status  |
| ---------------------------------------------- | ------- |
| GET returns 401 when not authenticated         | ✅ Pass |
| GET returns enquiries for authenticated user   | ✅ Pass |
| GET scopes query to user's companyId           | ✅ Pass |
| POST returns 401 when not authenticated        | ✅ Pass |
| POST returns 400 if clientName is missing      | ✅ Pass |
| POST returns 400 if enquiryType is missing     | ✅ Pass |
| POST returns 400 if clientName is empty string | ✅ Pass |
| POST creates enquiry with all fields           | ✅ Pass |
| POST creates enquiry with only required fields | ✅ Pass |
| POST uses companyId from JWT, not from body    | ✅ Pass |
| POST trims whitespace from fields              | ✅ Pass |
| POST returns 500 on Prisma error               | ✅ Pass |
| POST handles invalid JSON in request body      | ✅ Pass |
| POST returns correct success response format   | ✅ Pass |
| POST returns correct error response format     | ✅ Pass |

#### Applications API (JWT-authenticated)

**File**: `__tests__/app/api/applications.test.ts` (5 tests)

Mocks `cookies()` + `verifyToken()` for JWT authentication. CompanyId derived from token, never from request body.

| Test Case                                | Status  |
| ---------------------------------------- | ------- |
| POST returns 401 if no token provided    | ✅ Pass |
| POST returns 400 for validation errors   | ✅ Pass |
| POST creates an application successfully | ✅ Pass |
| GET returns 401 if no token provided     | ✅ Pass |
| GET fetches all applications for company | ✅ Pass |

#### Applications From-Enquiry API (JWT-authenticated)

**File**: `__tests__/app/api/applications-from-enquiry.test.ts` (6 tests)

Mocks `cookies()` + `verifyToken()` for JWT authentication. Validates enquiry ownership before creating application.

| Test Case                                      | Status  |
| ---------------------------------------------- | ------- |
| Returns 401 if no token provided               | ✅ Pass |
| Returns 400 for validation errors              | ✅ Pass |
| Returns 404 if enquiry not found               | ✅ Pass |
| Returns 403 if enquiry not in user's company   | ✅ Pass |
| Returns 400 if enquiry already has application | ✅ Pass |
| Creates application successfully from enquiry  | ✅ Pass |

### 3. Component Tests (99 tests)

#### EnquiryTable (EnquiryTableNew)

**File**: `__tests__/components/EnquiryDataTable.test.tsx` (34 tests)

Tests the redesigned enquiry table with type badges, application status badges, action menu, skeleton loader, and empty states.

| Test Case                                         | Status  |
| ------------------------------------------------- | ------- |
| Renders table with correct headers                | ✅ Pass |
| Renders all enquiry rows                          | ✅ Pass |
| Renders client names with font-medium class       | ✅ Pass |
| Shows email when present                          | ✅ Pass |
| Shows dash when email is null                     | ✅ Pass |
| Shows phone when present                          | ✅ Pass |
| Shows dash when phone is null                     | ✅ Pass |
| Displays human-readable type labels               | ✅ Pass |
| Applies coloured badge to enquiry type            | ✅ Pass |
| Shows 'Linked' badge when enquiry has application | ✅ Pass |
| Shows 'Not linked' when no application            | ✅ Pass |
| Formats dates in readable format                  | ✅ Pass |
| Shows dash when followUpDate is null              | ✅ Pass |
| Shows empty state when no enquiries               | ✅ Pass |
| Shows loading skeleton when isLoading is true     | ✅ Pass |
| Calls onView when a row is clicked                | ✅ Pass |
| Renders action button for each row                | ✅ Pass |
| Opens dropdown when action button is clicked      | ✅ Pass |
| Shows View Application for linked app             | ✅ Pass |
| Shows Create Application for unlinked app         | ✅ Pass |
| Calls onEdit when Edit Enquiry is clicked         | ✅ Pass |
| Calls onDelete when Delete is clicked             | ✅ Pass |
| Calls onViewApplication for linked enquiry        | ✅ Pass |
| Calls onCreateApplication for unlinked enquiry    | ✅ Pass |
| Closes dropdown after selecting an action         | ✅ Pass |
| Has hover effect on rows                          | ✅ Pass |
| Has cursor-pointer on rows                        | ✅ Pass |
| Has proper border styling                         | ✅ Pass |
| Handles single enquiry                            | ✅ Pass |
| Handles special characters in client names        | ✅ Pass |
| Shows default empty message when not filtered     | ✅ Pass |
| Shows filtered empty message when filtered        | ✅ Pass |
| Shows clear filters button when filtered          | ✅ Pass |
| Hides clear filters button when not filtered      | ✅ Pass |

#### AddEnquiryModal

**File**: `__tests__/components/AddEnquiryModal.test.tsx` (23 tests)

Tests the create enquiry modal with form validation, API integration, and modal behaviour.

| Test Case                                 | Status  |
| ----------------------------------------- | ------- |
| Does not render when open is false        | ✅ Pass |
| Renders when open is true                 | ✅ Pass |
| Renders modal title and subtitle          | ✅ Pass |
| Renders all form fields                   | ✅ Pass |
| Renders Cancel and Create Enquiry buttons | ✅ Pass |
| Updates client name input                 | ✅ Pass |
| Updates email input                       | ✅ Pass |
| Updates phone input                       | ✅ Pass |
| Updates enquiry type select               | ✅ Pass |
| Updates notes textarea                    | ✅ Pass |
| Shows error for empty client name         | ✅ Pass |
| Shows error for empty enquiry type        | ✅ Pass |
| Allows save with required fields filled   | ✅ Pass |
| Clears error when user starts typing      | ✅ Pass |
| Closes modal when Cancel is clicked       | ✅ Pass |
| Closes modal on successful save           | ✅ Pass |
| Closes modal when overlay is clicked      | ✅ Pass |
| Closes modal when X button is clicked     | ✅ Pass |
| Resets form on Cancel                     | ✅ Pass |
| Resets form on successful save            | ✅ Pass |
| Has proper label associations             | ✅ Pass |
| Marks required fields with asterisk       | ✅ Pass |
| Has a close button in header              | ✅ Pass |

#### Navigation Components

**Sidebar** (`__tests__/components/Sidebar.test.tsx` - 7 tests)
✅ Header rendering, navigation items, link hrefs, active item highlighting, footer, fixed styling, red border accent

**SidebarHeader** (`__tests__/components/SidebarHeader.test.tsx` - 8 tests)
✅ Company name, subtitle, logo image, logo styling, bold styling, muted subtitle, border styling, spacing

**MobileHeader** (`__tests__/components/MobileHeader.test.tsx` - 7 tests)
✅ Company name, CRM text, hamburger toggle, Menu/X icon states, hidden-on-desktop class, red accent

**MobileSidebar** (`__tests__/components/MobileSidebar.test.tsx` - 11 tests)
✅ Navigation items, header, close button, backdrop click, translate animations, nav link close, active highlight, hidden-on-desktop

#### Responsive Layout

**File**: `__tests__/components/ResponsiveLayout.test.tsx` (9 tests)
✅ Desktop sidebar + mobile header rendering, children content, responsive padding, overflow-auto, margin-left for desktop, top padding for mobile

### 4. Page Tests (35 tests)

**Dashboard** (`__tests__/app/dashboard.test.tsx` - 21 tests)

| Test Case                                                    | Status  |
| ------------------------------------------------------------ | ------- |
| Page Header — renders the Dashboard heading                  | ✅ Pass |
| Page Header — renders the welcome subtitle                   | ✅ Pass |
| Stats Cards — displays total enquiries count                 | ✅ Pass |
| Stats Cards — displays enquiries without application count   | ✅ Pass |
| Stats Cards — displays total applications count              | ✅ Pass |
| Stats Cards — displays currently active count                | ✅ Pass |
| Stats Cards — displays pending payments count                | ✅ Pass |
| Stats Cards — displays needs attention with computed total   | ✅ Pass |
| Stats Cards — displays overdue and follow-ups breakdown      | ✅ Pass |
| Stats Cards — shows zero stats correctly                     | ✅ Pass |
| Conditional Styling — red styling when pending actions exist | ✅ Pass |
| Conditional Styling — neutral styling when zero pending      | ✅ Pass |
| Pipeline — renders section when there are applications       | ✅ Pass |
| Pipeline — displays In Process count                         | ✅ Pass |
| Pipeline — displays Pending Info / Payment count             | ✅ Pass |
| Pipeline — displays Submitted count correctly                | ✅ Pass |
| Pipeline — shows 0 when active + pending exceeds total       | ✅ Pass |
| Pipeline — hides section when no applications                | ✅ Pass |
| Scenarios — handles large numbers                            | ✅ Pass |
| Scenarios — renders all four stat cards                      | ✅ Pass |
| Scenarios — renders styled card containers                   | ✅ Pass |

**Login** (`__tests__/app/login.test.tsx` - 14 tests)
✅ Form rendering, input updates, loading state, redirect, API request, error handling, button states

## Test Files Structure

```
__tests__/
├── app/
│   ├── api/
│   │   ├── companies.test.ts                    (9 tests) ✅
│   │   ├── enquiries.test.ts                   (15 tests) ✅
│   │   ├── applications.test.ts                 (5 tests) ✅
│   │   ├── applications-from-enquiry.test.ts    (6 tests) ✅
│   │   └── auth/
│   │       ├── login.test.ts                   (17 tests) ✅
│   │       ├── me.test.ts                       (4 tests) ✅
│   │       └── logout.test.ts                   (4 tests) ✅
│   ├── dashboard.test.tsx                      (21 tests) ✅
│   └── login.test.tsx                          (14 tests) ✅
├── components/
│   ├── Sidebar.test.tsx                         (7 tests) ✅
│   ├── SidebarHeader.test.tsx                   (8 tests) ✅
│   ├── MobileHeader.test.tsx                    (7 tests) ✅
│   ├── MobileSidebar.test.tsx                  (11 tests) ✅
│   ├── ResponsiveLayout.test.tsx                (9 tests) ✅
│   ├── AddEnquiryModal.test.tsx                (23 tests) ✅
│   └── EnquiryDataTable.test.tsx               (34 tests) ✅
└── lib/
    ├── jwt.test.ts                             (18 tests) ✅
    └── auth-context.test.tsx                    (6 tests) ✅

Total: 217 tests across 18 suites ✅
```

## Running Tests

```bash
npm test                                    # Run all tests
npm test -- --watch                        # Watch mode
npm test -- --coverage                     # Coverage report
npm test -- --testPathPattern="pattern"   # Specific test
```

Success output: ✅ 217 tests pass, 0 fail

## Test File Naming Convention

- Component test: `ComponentName.test.tsx`
- Page test: `pageName.test.tsx`
- Utility test: `utilName.test.ts`
- Location: `__tests__/[category]/[filename].test.tsx`

## Mocking Strategy

**Prisma Client** — Mocked in all API tests to avoid database writes

**Fetch API** — Mocked for client-side API calls in component tests

**JWT Utilities** — Mocked via `cookies()` + `verifyToken()` for auth-protected API routes

**Next.js Router** — Mocked for navigation and redirect tests (useRouter, usePathname)

**App Config** — Mocked for testing with different configurations

Example (JWT-auth API test):

```typescript
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: {
    enquiry: { findMany: jest.fn(), create: jest.fn() },
  },
}));

jest.mock("@/lib/jwt", () => ({
  verifyToken: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

// Helper to authenticate as a test user
function authenticateAs(user: {
  id: string;
  email: string;
  companyId: string;
}) {
  (cookies as jest.Mock).mockReturnValue({
    get: jest.fn().mockReturnValue({ value: "mock-token" }),
  });
  (verifyToken as jest.Mock).mockResolvedValue(user);
}
```

## CI/CD Integration

Add GitHub Actions workflow:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test -- --coverage
```

## API Security Testing

✅ **Tested**:

- Password never returned in response
- JWT tokens stored in HTTP-only cookies only
- Cookies have HttpOnly, Secure, and SameSite flags
- Company data scoping enforced (companyId from JWT, never client)
- Token expiration after 7 days
- Tampered tokens rejected
- 401 returned for missing/invalid tokens on all protected routes

## Best Practices Applied

✅ Test behavior, not implementation
✅ Use semantic queries (getByRole, getByText)
✅ Each test isolated and independent
✅ Mock external dependencies
✅ Test edge cases and error states
✅ Keep tests maintainable and focused

## Common Issues & Solutions

| Issue                    | Solution                                                              |
| ------------------------ | --------------------------------------------------------------------- |
| "Unable to find element" | Check if rendered, verify mock data, use `waitFor` for async          |
| Mock not working         | Ensure `jest.mock()` at top, check export path, verify data structure |
| Async warnings           | Use `waitFor()` or `act()` for state updates                          |
| Snapshot changes         | Review carefully, update with `npm test -- -u` if intentional         |

## Database & Environment

Required for testing:

```bash
# .env.local
DATABASE_URL="postgresql://user:password@host/db"
JWT_SECRET="min-32-char-secret-key-required-here"
```

Before running tests:

```bash
npx prisma migrate deploy    # Apply migrations
npx prisma generate         # Generate Prisma client
```

## Test Checklist

Before committing:

- [ ] All tests pass: `npm test`
- [ ] No console errors
- [ ] New features have tests
- [ ] API endpoints test success + error cases
- [ ] Forms test validation, loading, errors
- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Authentication tests verify full login flow
- [ ] JWT tests verify signing/verification/expiration
- [ ] Sensitive data not logged or exposed
- [ ] HTTP-only cookie flag tested

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Version**: 3.0 | **Status**: ✅ 200 tests passing | **Last Updated**: March 2026
