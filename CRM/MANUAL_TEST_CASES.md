# Monocle Immigration — Manual Test Cases

> **Goal**: Ensure the unified platform (marketing website + CRM) is stable, secure, user-friendly, and ready for real-world usage.
>
> **Legend**: ✅ Pass | ❌ Fail | ⏭️ Skipped | 🔲 Not Tested

---

## 1. Authentication Testing

### 1.1 Login — Valid Credentials

| #     | Test Case                           | Steps                                                                                              | Expected Result                                                                      | Status  |
| ----- | ----------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------- |
| 1.1.1 | Login with valid email and password | 1. Navigate to `/crm/login` 2. Enter registered email 3. Enter correct password 4. Click "Sign In" | User is redirected to `/crm/dashboard`. No error message shown.                      | ✅ Pass |
| 1.1.2 | Password visibility toggle          | 1. Go to`/crm/login` 2. Enter password 3. Click the show/hide password icon                        | Password text toggles between hidden (dots) and visible (plain text).                | ✅ Pass |
| 1.1.3 | Login button shows loading state    | 1. Enter valid credentials 2. Click "Sign In" 3. Observe button during request                     | Button displays a loading indicator or is disabled while the request is in progress. | ✅ Pass |

### 1.2 Login — Invalid Credentials

| #     | Test Case                     | Steps                                                                                                               | Expected Result                                                         | Status  |
| ----- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------- |
| 1.2.1 | Login with incorrect password | 1. Navigate to `/crm/login` 2. Enter valid email 3. Enter wrong password 4. Click "Sign In"                         | Red error box displays "Invalid credentials". User stays on login page. | ✅ Pass |
| 1.2.2 | Login with non-existent email | 1. Navigate to `/crm/login` 2. Enter an email that doesn't exist in the DB 3. Enter any password 4. Click "Sign In" | Error message displayed (e.g., "Invalid credentials"). No crash.        | ✅ Pass |
| 1.2.3 | Login with empty email        | 1. Leave email field blank 2. Enter a password 3. Click "Sign In"                                                   | Validation error shown. Form does not submit.                           | ✅ Pass |
| 1.2.4 | Login with empty password     | 1. Enter email 2. Leave password blank 3. Click "Sign In"                                                           | Validation error shown. Form does not submit.                           | ✅ Pass |
| 1.2.5 | Login with both fields empty  | 1. Leave both email and password blank 2. Click "Sign In"                                                           | Validation errors shown for both fields.                                | ✅ Pass |

### 1.3 Session Persistence

| #     | Test Case                         | Steps                                                                        | Expected Result                                                          | Status  |
| ----- | --------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------- |
| 1.3.1 | Session survives page refresh     | 1. Login successfully 2. Press F5 or Cmd+R to refresh page                   | User remains authenticated on `/crm/dashboard`. Not redirected to login. | ✅ Pass |
| 1.3.2 | Session survives new tab          | 1. Login in tab A 2. Open new tab B 3. Navigate to `/crm/dashboard` in tab B | User is authenticated in tab B without re-login.                         | ✅ Pass |
| 1.3.3 | Session cookie exists after login | 1. Login successfully 2. Open browser DevTools → Application → Cookies       | `authToken` cookie is present, httpOnly, SameSite=Lax.                   | ✅ Pass |
| 1.3.4 | `/api/auth/me` returns user info  | 1. Login successfully 2. Call `GET /api/auth/me` in browser or DevTools      | Returns `{ userId, email, companyId }` with 200 status.                  | ✅ Pass |

### 1.4 Logout

| #     | Test Case                                  | Steps                                                               | Expected Result                                                    | Status  |
| ----- | ------------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------ | ------- |
| 1.4.1 | Logout from sidebar                        | 1. Login successfully 2. Click "Logout" button at bottom of sidebar | User is redirected to `/crm/login`. `authToken` cookie is cleared. | ✅ Pass |
| 1.4.2 | Cannot access protected route after logout | 1. Logout 2. Manually navigate to `/crm/dashboard`                  | User is redirected to `/crm/login`.                                | ✅ Pass |
| 1.4.3 | `/api/auth/me` returns 401 after logout    | 1. Logout 2. Call `GET /api/auth/me` in DevTools                    | Returns 401 Unauthorized.                                          | ✅ Pass |

### 1.5 Unauthorized Access / Middleware Protection

| #     | Test Case                                 | Steps                                                                                  | Expected Result                               | Status  |
| ----- | ----------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------- | ------- |
| 1.5.1 | Access `/crm/dashboard` without login     | 1. Clear cookies 2. Navigate directly to `/crm/dashboard`                              | Redirected to `/crm/login`.                   | ✅ Pass |
| 1.5.2 | Access `/crm/enquiries` without login     | 1. Clear cookies 2. Navigate directly to `/crm/enquiries`                              | Redirected to `/crm/login`.                   | ✅ Pass |
| 1.5.3 | Access `/crm/applications` without login  | 1. Clear cookies 2. Navigate directly to `/crm/applications`                           | Redirected to `/crm/login`.                   | ✅ Pass |
| 1.5.4 | Access `/applications/[id]` without login | 1. Clear cookies 2. Navigate to any `/applications/<id>` URL                           | Redirected to `/crm/login`.                   | ✅ Pass |
| 1.5.5 | Access API endpoints without auth token   | 1. Clear cookies 2. Call `GET /api/enquiries` via fetch/Postman                        | Returns 401 Unauthorized.                     | ✅ Pass |
| 1.5.6 | Access API with expired/tampered token    | 1. Manually set `authToken` cookie to a garbage string 2. Navigate to `/crm/dashboard` | Redirected to`/crm/login` or error displayed. | ✅ Pass |

---

## 2. Navigation Testing

### 2.1 Sidebar Navigation (Desktop)

| #     | Test Case                                | Steps                                                 | Expected Result                                                                   | Status  |
| ----- | ---------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------- | ------- |
| 2.1.1 | Navigate to Dashboard                    | 1. Login 2. Click "Dashboard" in sidebar              | Page transitions to `/crm/dashboard`. Dashboard content loads.                    | ✅ Pass |
| 2.1.2 | Navigate to Enquiries                    | 1. Click "Enquiries" in sidebar                       | Page transitions to `/crm/enquiries`. Enquiry table loads.                        | ✅ Pass |
| 2.1.3 | Navigate to Applications                 | 1. Click "Applications" in sidebar                    | Page transitions to `/crm/applications`. Applications table loads.                | ✅ Pass |
| 2.1.4 | Active state highlighting — Dashboard    | 1. Navigate to `/crm/dashboard` 2. Observe sidebar    | "Dashboard" item has red background + left border indicator. Others are unstyled. | ✅ Pass |
| 2.1.5 | Active state highlighting — Enquiries    | 1. Navigate to `/crm/enquiries` 2. Observe sidebar    | "Enquiries" item is highlighted. Others are not.                                  | ✅ Pass |
| 2.1.6 | Active state highlighting — Applications | 1. Navigate to `/crm/applications` 2. Observe sidebar | "Applications" item is highlighted. Others are not.                               | ✅ Pass |
| 2.1.7 | Sidebar logo and company info            | 1. Login 2. Observe sidebar header                    | Logo (36×36), company name, and "CRM Dashboard" subtitle are visible.             | ✅ Pass |
| 2.1.8 | Sidebar version info                     | 1. Scroll to bottom of sidebar                        | Version info section is visible.                                                  | ✅ Pass |

### 2.2 Direct URL Access

| #     | Test Case                         | Steps                                                   | Expected Result                         | Status  |
| ----- | --------------------------------- | ------------------------------------------------------- | --------------------------------------- | ------- |
| 2.2.1 | Direct URL to `/crm/dashboard`    | 1. Type `/crm/dashboard` in address bar while logged in | Dashboard loads correctly.              | ✅ Pass |
| 2.2.2 | Direct URL to `/crm/enquiries`    | 1. Type `/crm/enquiries` directly                       | Enquiries page loads with data.         | ✅ Pass |
| 2.2.3 | Direct URL to `/crm/applications` | 1. Type `/crm/applications` directly                    | Applications page loads with data.      | ✅ Pass |
| 2.2.4 | Direct URL to non-existent route  | 1. Navigate to `/nonexistent`                           | 404 page or redirect (not crash).       | ✅ Pass |
| 2.2.5 | Root path `/`                     | 1. Navigate to `/` while logged in                      | Home page loads with quick-start cards. | ✅ Pass |

### 2.3 Mobile Navigation

| #     | Test Case                              | Steps                                                          | Expected Result                                                                  | Status  |
| ----- | -------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------- |
| 2.3.1 | Mobile header appears on small screens | 1. Resize browser to < 768px width                             | Top header bar with logo + hamburger icon is visible. Desktop sidebar is hidden. | ✅ Pass |
| 2.3.2 | Open mobile sidebar                    | 1. On mobile view 2. Click hamburger icon                      | Slide-in sidebar opens from the left with navigation items + backdrop overlay.   | ✅ Pass |
| 2.3.3 | Close mobile sidebar via X button      | 1. Open mobile sidebar 2. Click X button (top right)           | Sidebar closes.                                                                  | ✅ Pass |
| 2.3.4 | Close mobile sidebar via backdrop      | 1. Open mobile sidebar 2. Tap outside the sidebar (on overlay) | Sidebar closes.                                                                  | ✅ Pass |
| 2.3.5 | Navigate via mobile sidebar            | 1. Open mobile sidebar 2. Tap "Enquiries"                      | Sidebar closes, navigates to `/crm/enquiries`.                                   | ✅ Pass |
| 2.3.6 | Logout from mobile sidebar             | 1. Open mobile sidebar 2. Tap "Logout"                         | User is logged out and redirected to `/crm/login`.                               | ✅ Pass |

---

## 3. Enquiries Module

### 3.1 Create New Enquiry

| #     | Test Case                                | Steps                                                                                                                                                                                           | Expected Result                                                                        | Status  |
| ----- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------- |
| 3.1.1 | Open "New Enquiry" modal                 | 1. Go to `/crm/enquiries` 2. Click "New Enquiry" button                                                                                                                                         | Modal opens with empty form. Title says "Add Enquiry" or similar.                      | ✅ Pass |
| 3.1.2 | Create enquiry with all fields           | 1. Fill: Client Name = "John Doe" 2. Email = "john@example.com" 3. Phone = "+61 400 111 222" 4. Type = "Visa" 5. Notes = "Student visa enquiry" 6. Follow-Up Date = future date 7. Click Submit | Modal closes. Page reloads. "John Doe" appears in the enquiry table with correct data. | ✅ Pass |
| 3.1.3 | Create enquiry with only required fields | 1. Fill: Client Name = "Jane Smith" 2. Type = "General" 3. Leave all other fields blank 4. Submit                                                                                               | Enquiry created successfully. Email, Phone, Notes, Follow-Up show as "—" in table.     | ✅ Pass |
| 3.1.4 | Cancel enquiry creation                  | 1. Open "New Enquiry" modal 2. Fill some fields 3. Click "Cancel"                                                                                                                               | Modal closes. No new enquiry created. Form is cleared.                                 | ✅ Pass |
| 3.1.5 | Verify enquiry appears at top of list    | 1. Create a new enquiry                                                                                                                                                                         | New enquiry appears at the top of the table (sorted by createdAt desc).                | ✅ Pass |

### 3.2 Validate Required Fields (Create Enquiry)

| #     | Test Case                            | Steps                                                                       | Expected Result                                                           | Status  |
| ----- | ------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------- |
| 3.2.1 | Submit with empty Client Name        | 1. Open modal 2. Leave Client Name blank 3. Select a type 4. Submit         | Inline validation error below Client Name field. Form does not submit.    | ✅ Pass |
| 3.2.2 | Submit with no Enquiry Type selected | 1. Open modal 2. Enter Client Name 3. Leave Type as default/blank 4. Submit | Validation error for Enquiry Type. Form does not submit.                  | ✅ Pass |
| 3.2.3 | Submit with invalid email format     | 1. Enter Client Name 2. Enter "not-an-email" in Email 3. Submit             | Inline validation error below Email field (e.g., "Invalid email format"). | ✅ Pass |
| 3.2.4 | Submit with valid email              | 1. Enter "user@domain.com" in Email 2. Fill required fields 3. Submit       | No validation error for email. Enquiry created.                           | ✅ Pass |
| 3.2.5 | Client Name max length (200 chars)   | 1. Enter a 201-character Client Name 2. Submit                              | Server-side validation error. Field limited to max 200 chars.             | ✅ Pass |
| 3.2.6 | Notes max length (2000 chars)        | 1. Enter 2001 chars in Notes 2. Submit                                      | Validation error for notes exceeding 2000 chars.                          | ✅ Pass |

### 3.3 Edit Existing Enquiry

| #     | Test Case                        | Steps                                                                          | Expected Result                                          | Status |
| ----- | -------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------- | ------ |
| 3.3.1 | Open edit modal from action menu | 1. Click "⋯" action button on a row 2. Select "Edit Enquiry"                   | Edit modal opens pre-filled with existing enquiry data.  | 🔲     |
| 3.3.2 | Open edit modal from slide-over  | 1. Open an enquiry's detail slide-over 2. Click "Edit Enquiry" button (footer) | Edit modal opens pre-filled with data.                   | 🔲     |
| 3.3.3 | Edit Client Name                 | 1. Change Client Name from "John Doe" to "John Updated" 2. Submit              | Enquiry updates. Table shows "John Updated".             | 🔲     |
| 3.3.4 | Edit Enquiry Type                | 1. Change type from "Visa" to "Consultation" 2. Submit                         | Badge updates to amber "Consultation" in table.          | 🔲     |
| 3.3.5 | Add a Follow-Up Date             | 1. Edit an enquiry without follow-up 2. Set a date 3. Submit                   | Follow-up date now shows in the table and detail view.   | 🔲     |
| 3.3.6 | Remove a Follow-Up Date          | 1. Edit an enquiry with follow-up 2. Clear the date field 3. Submit            | Follow-up shows as "—" in the table.                     | 🔲     |
| 3.3.7 | Edit preserves unchanged fields  | 1. Edit an enquiry 2. Only change Notes 3. Submit                              | All other fields remain the same. Only Notes is updated. | 🔲     |
| 3.3.8 | Cancel edit                      | 1. Open edit modal 2. Modify a field 3. Click "Cancel"                         | Modal closes. No changes saved. Original data intact.    | 🔲     |

### 3.4 View Enquiry Details (Slide-Over)

| #      | Test Case                                 | Steps                                                   | Expected Result                                                                | Status |
| ------ | ----------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------ | ------ |
| 3.4.1  | Open slide-over by clicking row           | 1. Click on an enquiry row in the table                 | Slide-over panel opens from the right with full details.                       | 🔲     |
| 3.4.2  | Open slide-over via action menu           | 1. Click "⋯" on a row 2. Select "View Details"          | Slide-over opens with the enquiry's details.                                   | 🔲     |
| 3.4.3  | Contact info section                      | 1. Open slide-over for an enquiry with email + phone    | Email shown as clickable `mailto:` link. Phone shown as clickable `tel:` link. | 🔲     |
| 3.4.4  | Enquiry details section                   | 1. Open slide-over                                      | Type badge displayed with correct color. Notes shown if present.               | 🔲     |
| 3.4.5  | Dates section                             | 1. Open slide-over                                      | Follow-Up Date, Created At, Last Updated displayed correctly.                  | 🔲     |
| 3.4.6  | Linked Application — exists               | 1. Open slide-over for enquiry linked to an application | "View Application" button is present and clickable.                            | 🔲     |
| 3.4.7  | Linked Application — none                 | 1. Open slide-over for enquiry without application      | "Create Application" button is present.                                        | 🔲     |
| 3.4.8  | Close slide-over                          | 1. Open slide-over 2. Click "Close" button              | Slide-over closes. Table is visible again.                                     | 🔲     |
| 3.4.9  | Disabled "Send Invoice" button            | 1. Open slide-over 2. Observe the "Send Invoice" button | Button is grayed out / disabled with "Coming soon" indication.                 | 🔲     |
| 3.4.10 | Disabled "Send Retainer Agreement" button | 1. Open slide-over 2. Observe the button                | Button is grayed out / disabled with "Coming soon" indication.                 | 🔲     |

### 3.5 Delete Enquiry

| #     | Test Case                              | Steps                                               | Expected Result                                                      | Status |
| ----- | -------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------- | ------ |
| 3.5.1 | Delete via action menu                 | 1. Click "⋯" on a row 2. Select "Delete"            | Confirmation dialog appears.                                         | 🔲     |
| 3.5.2 | Confirm delete                         | 1. Trigger delete 2. Confirm in the dialog          | Enquiry is removed from the table. Page reloads/updates.             | 🔲     |
| 3.5.3 | Cancel delete                          | 1. Trigger delete 2. Cancel / dismiss the dialog    | Enquiry remains in the table. No changes.                            | 🔲     |
| 3.5.4 | Delete enquiry with linked application | 1. Delete an enquiry that has an application linked | Enquiry is deleted. Verify application behavior (cascade or orphan). | 🔲     |

### 3.6 Enquiry Table Behavior

| #      | Test Case                                 | Steps                                                                                    | Expected Result                                                    | Status |
| ------ | ----------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------ |
| 3.6.1  | Search by client name                     | 1. Type a client name in the search box                                                  | Table filters to show only matching rows.                          | 🔲     |
| 3.6.2  | Search by email                           | 1. Type an email address in search                                                       | Table filters by email match.                                      | 🔲     |
| 3.6.3  | Search by phone                           | 1. Type a phone number in search                                                         | Table filters by phone match.                                      | 🔲     |
| 3.6.4  | Filter by Enquiry Type — Visa             | 1. Select "Visa" in type filter dropdown                                                 | Only visa-type enquiries shown.                                    | 🔲     |
| 3.6.5  | Filter by Enquiry Type — Consultation     | 1. Select "Consultation"                                                                 | Only consultation enquiries shown.                                 | 🔲     |
| 3.6.6  | Filter by Enquiry Type — Documentation    | 1. Select "Documentation"                                                                | Only documentation enquiries shown.                                | 🔲     |
| 3.6.7  | Filter by Enquiry Type — General          | 1. Select "General"                                                                      | Only general enquiries shown.                                      | 🔲     |
| 3.6.8  | Filter by Application Status — Linked     | 1. Select "Linked" in application status filter                                          | Only enquiries with a linked application shown.                    | 🔲     |
| 3.6.9  | Filter by Application Status — Not Linked | 1. Select "Not Linked"                                                                   | Only enquiries without an application shown.                       | 🔲     |
| 3.6.10 | Clear all filters                         | 1. Set search + type filter + application filter 2. Reset all filters to default ("All") | Full enquiry list is displayed again.                              | 🔲     |
| 3.6.11 | Combined filters                          | 1. Set type = "Visa" AND search = "John"                                                 | Only visa enquiries whose name/email/phone match "John" are shown. | 🔲     |
| 3.6.12 | Pagination — page 1 shows max 5 items     | 1. Have > 5 enquiries 2. Observe first page                                              | Max 5 rows visible. Pagination controls shown.                     | 🔲     |
| 3.6.13 | Pagination — go to page 2                 | 1. Click next page / page 2                                                              | Next 5 items shown. Page indicator updates.                        | 🔲     |
| 3.6.14 | Pagination + filters combined             | 1. Apply a filter that returns > 5 results                                               | Pagination adjusts to filtered count.                              | 🔲     |
| 3.6.15 | Empty state — no enquiries                | 1. Remove all enquiries (or filter to 0 results)                                         | Table shows empty state message (no crash).                        | 🔲     |
| 3.6.16 | Enquiry count badge in header             | 1. Observe the enquiry count next to the title                                           | Count matches the total number of enquiries (or filtered count).   | 🔲     |

### 3.7 Enquiry Type Badges

| #     | Test Case                 | Steps                                    | Expected Result          | Status |
| ----- | ------------------------- | ---------------------------------------- | ------------------------ | ------ |
| 3.7.1 | Visa badge color          | 1. Observe a "Visa" enquiry in the table | Badge is indigo-colored. | 🔲     |
| 3.7.2 | Consultation badge color  | 1. Observe                               | Badge is amber-colored.  | 🔲     |
| 3.7.3 | Documentation badge color | 1. Observe                               | Badge is cyan-colored.   | 🔲     |
| 3.7.4 | General badge color       | 1. Observe                               | Badge is gray-colored.   | 🔲     |

---

## 4. Applications Module

### 4.1 Create Application (Manual)

| #     | Test Case                                    | Steps                                                                                                                                                         | Expected Result                                                                    | Status |
| ----- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------ |
| 4.1.1 | Open "New Application" modal                 | 1. Go to `/crm/applications` 2. Click "New Application" button                                                                                                | Modal opens with empty form. Default Payment = "PENDING", Status = "IN_PROCESS".   | 🔲     |
| 4.1.2 | Create application with all fields           | 1. Fill: Client Full Name, Email, Phone, Application Type, Payment Status = PAID, Current Status = SUBMITTED, Due Date, Assigned Employee ID, Notes 2. Submit | Application created. Appears in table with correct badges/data.                    | 🔲     |
| 4.1.3 | Create application with only required fields | 1. Fill only Client Full Name 2. Submit                                                                                                                       | Application created with defaults (PENDING, IN_PROCESS). Optional fields show "—". | 🔲     |
| 4.1.4 | Submit with empty Client Full Name           | 1. Leave Client Full Name blank 2. Submit                                                                                                                     | Validation error. Form does not submit.                                            | 🔲     |
| 4.1.5 | Submit with invalid email format             | 1. Enter "bad-email" 2. Submit                                                                                                                                | Validation error below email field.                                                | 🔲     |
| 4.1.6 | Submit with valid Drive Folder Link          | 1. Fill required fields 2. Enter "https://drive.google.com/drive/folders/abc" in Drive Folder Link 3. Submit                                                  | Application created. Drive link saved.                                             | 🔲     |
| 4.1.7 | Submit with invalid Drive Folder Link        | 1. Fill required fields 2. Enter "not-a-url" in Drive Folder Link 3. Submit                                                                                   | Validation error: "Please enter a valid URL".                                      | 🔲     |
| 4.1.8 | Submit with empty Drive Folder Link          | 1. Fill required fields 2. Leave Drive Folder Link empty 3. Submit                                                                                            | Application created. Field saved as null.                                          | 🔲     |
| 4.1.9 | Cancel application creation                  | 1. Open modal 2. Fill fields 3. Click "Cancel"                                                                                                                | Modal closes. No application created.                                              | 🔲     |

### 4.2 Create Application from Enquiry

| #     | Test Case                                | Steps                                                                                                            | Expected Result                                                                                                                            | Status |
| ----- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 4.2.1 | Create from enquiry action menu          | 1. Go to `/crm/enquiries` 2. Click "⋯" on an enquiry without a linked application 3. Select "Create Application" | Application is created and user is navigated to application detail page.                                                                   | 🔲     |
| 4.2.2 | Auto-populated fields from enquiry       | 1. Create application from enquiry 2. Observe application details                                                | clientFullName = enquiry's clientName, applicationType = enquiry's type, email/phone/notes copied. Payment = PENDING, Status = IN_PROCESS. | 🔲     |
| 4.2.3 | Create from enquiry slide-over           | 1. Open slide-over for unlinked enquiry 2. Click "Create Application"                                            | Application created. Enquiry now shows "Linked" badge.                                                                                     | 🔲     |
| 4.2.4 | Attempt to create duplicate from enquiry | 1. Enquiry already has a linked application 2. Try to create again via API                                       | Error: enquiry already has an application linked. No duplicate created.                                                                    | 🔲     |
| 4.2.5 | Enquiry badge updates after linking      | 1. Create application from enquiry 2. Go back to enquiries table                                                 | Enquiry row shows green "Linked" badge.                                                                                                    | 🔲     |

### 4.3 View Application Detail

| #      | Test Case                           | Steps                                                | Expected Result                                                                     | Status |
| ------ | ----------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------- | ------ |
| 4.3.1  | Navigate to application detail page | 1. Click "View Details" from application action menu | Navigates to `/crm/applications/[id]`. Detail page loads.                           | 🔲     |
| 4.3.2  | Contact information section         | 1. Observe detail page                               | Email and Phone displayed correctly (or "—" if empty).                              | 🔲     |
| 4.3.3  | Application details section         | 1. Observe                                           | Application type, assigned employee ID, notes shown.                                | 🔲     |
| 4.3.4  | Linked enquiry section — linked     | 1. View app created from enquiry                     | Linked enquiry details shown (name, type, etc.).                                    | 🔲     |
| 4.3.5  | Linked enquiry section — manual     | 1. View manually created app                         | Shows "Created manually" or empty enquiry section.                                  | 🔲     |
| 4.3.6  | Payment & Status badges             | 1. Observe                                           | Payment status badge (orange/green/amber). Current status badge (blue/green/amber). | 🔲     |
| 4.3.7  | Due date urgency — overdue          | 1. View application with past due date               | Due date styled in red / shows urgency.                                             | 🔲     |
| 4.3.8  | Due date urgency — today            | 1. View application due today                        | Due date styled in amber.                                                           | 🔲     |
| 4.3.9  | Due date urgency — upcoming         | 1. View application with future due date             | Due date styled in gray/normal.                                                     | 🔲     |
| 4.3.10 | Back button                         | 1. Click "Back" on detail page                       | Navigates back to `/crm/applications` list.                                         | 🔲     |
| 4.3.11 | Drive Folder Link — with link       | 1. View app with driveFolderLink set                 | "Open Drive Folder" button shown as clickable link, opens in new tab.               | 🔲     |
| 4.3.12 | Drive Folder Link — without link    | 1. View app without driveFolderLink                  | No Drive Folder Link section shown (no empty field displayed).                      | 🔲     |

### 4.4 Edit Application

| #      | Test Case                             | Steps                                                                | Expected Result                                         | Status |
| ------ | ------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------- | ------ |
| 4.4.1  | Open edit modal from list action menu | 1. Click "⋯" on application row 2. Select "Edit Application"         | Edit modal opens with pre-filled data.                  | 🔲     |
| 4.4.2  | Open edit modal from detail page      | 1. On detail page 2. Click "Edit" button (header or footer)          | Edit modal opens with pre-filled data.                  | 🔲     |
| 4.4.3  | Change Payment Status                 | 1. Edit application 2. Change Payment from PENDING to PAID 3. Submit | Badge updates to green "PAID" in table and detail page. | 🔲     |
| 4.4.4  | Change Current Status                 | 1. Change status from IN_PROCESS to SUBMITTED 2. Submit              | Badge updates to green "SUBMITTED".                     | 🔲     |
| 4.4.5  | Change Due Date                       | 1. Set or change due date 2. Submit                                  | Due date updates in table with correct urgency styling. | 🔲     |
| 4.4.6  | Clear Due Date                        | 1. Remove due date 2. Submit                                         | Due date shows as "—" or empty.                         | 🔲     |
| 4.4.7  | Edit Client Full Name                 | 1. Change name 2. Submit                                             | Name updates across table and detail page.              | 🔲     |
| 4.4.8  | Edit preserves unmodified fields      | 1. Edit 2. Only change Notes 3. Submit                               | All other fields remain unchanged.                      | 🔲     |
| 4.4.9  | Cancel edit                           | 1. Open edit 2. Change fields 3. Cancel                              | No changes saved.                                       | 🔲     |
| 4.4.10 | Add Drive Folder Link via edit        | 1. Edit app 2. Add valid URL to Drive Folder Link 3. Submit          | Link saved. Detail page shows clickable link.           | 🔲     |
| 4.4.11 | Edit with invalid Drive Folder Link   | 1. Edit app 2. Enter "bad-url" in Drive Folder Link 3. Submit        | Validation error shown. Form does not submit.           | 🔲     |
| 4.4.12 | Remove Drive Folder Link via edit     | 1. Edit app 2. Clear Drive Folder Link field 3. Submit               | Link removed. Detail page no longer shows drive link.   | 🔲     |

### 4.5 Delete Application

| #     | Test Case                      | Steps                                              | Expected Result                                                                | Status |
| ----- | ------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------ | ------ |
| 4.5.1 | Delete from action menu (list) | 1. Click "⋯" 2. Select "Delete"                    | Confirmation dialog appears.                                                   | 🔲     |
| 4.5.2 | Delete from detail page        | 1. Open detail page 2. Click "Delete" button       | Confirmation dialog appears.                                                   | 🔲     |
| 4.5.3 | Confirm delete                 | 1. Confirm deletion                                | Application removed. Redirected to list / table updates.                       | 🔲     |
| 4.5.4 | Delete app linked to enquiry   | 1. Delete an application that came from an enquiry | Application deleted. Enquiry's application badge changes back to "Not linked". | 🔲     |

### 4.6 Applications Table Behavior

| #      | Test Case                               | Steps                                                          | Expected Result                                    | Status |
| ------ | --------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------- | ------ |
| 4.6.1  | Search by client name                   | 1. Type a name in the search box                               | Table filters to matching rows.                    | 🔲     |
| 4.6.2  | Search by email                         | 1. Type email                                                  | Filters work correctly.                            | 🔲     |
| 4.6.3  | Search by phone                         | 1. Type phone number                                           | Filters work correctly.                            | 🔲     |
| 4.6.4  | Search by application type              | 1. Type application type keyword                               | Matching rows shown.                               | 🔲     |
| 4.6.5  | Filter by Payment Status — PENDING      | 1. Select "PENDING" in payment filter                          | Only PENDING payment applications shown.           | 🔲     |
| 4.6.6  | Filter by Payment Status — PAID         | 1. Select "PAID"                                               | Only PAID applications shown.                      | 🔲     |
| 4.6.7  | Filter by Payment Status — PARTIAL      | 1. Select "PARTIAL_PAYMENT_DONE"                               | Only partial payment applications shown.           | 🔲     |
| 4.6.8  | Filter by Current Status — IN_PROCESS   | 1. Select "IN_PROCESS"                                         | Only in-process applications shown.                | 🔲     |
| 4.6.9  | Filter by Current Status — SUBMITTED    | 1. Select "SUBMITTED"                                          | Only submitted applications shown.                 | 🔲     |
| 4.6.10 | Filter by Current Status — PENDING_INFO | 1. Select "PENDING_INFO"                                       | Only pending-info applications shown.              | 🔲     |
| 4.6.11 | Filter by Enquiry Status — Linked       | 1. Select "Linked"                                             | Only applications from enquiries shown.            | 🔲     |
| 4.6.12 | Filter by Enquiry Status — Manual       | 1. Select "Manual"                                             | Only manually created applications shown.          | 🔲     |
| 4.6.13 | Filter by Due Date — Overdue            | 1. Select "Overdue"                                            | Only applications with past due dates shown.       | 🔲     |
| 4.6.14 | Filter by Due Date — Today              | 1. Select "Today"                                              | Only applications due today shown.                 | 🔲     |
| 4.6.15 | Filter by Due Date — Upcoming           | 1. Select "Upcoming"                                           | Only applications with future due dates shown.     | 🔲     |
| 4.6.16 | Filter by Due Date — None               | 1. Select "None"                                               | Only applications without a due date shown.        | 🔲     |
| 4.6.17 | Combined filters                        | 1. Set Payment = PENDING, Status = IN_PROCESS, search = "John" | Only matching applications shown.                  | 🔲     |
| 4.6.18 | Clear all filters                       | 1. Apply multiple filters 2. Reset all to default              | Full list restored.                                | 🔲     |
| 4.6.19 | Pagination — max 5 per page             | 1. Have > 5 applications 2. Observe                            | Max 5 rows on page 1. Pagination controls visible. | 🔲     |
| 4.6.20 | Pagination — navigate pages             | 1. Click page 2 or next                                        | Next batch of results shown.                       | 🔲     |
| 4.6.21 | Empty state                             | 1. No applications or filter returns 0                         | Empty state message shown. No crash.               | 🔲     |

### 4.7 Application Status Badges

| #     | Test Case                  | Steps   | Expected Result      | Status |
| ----- | -------------------------- | ------- | -------------------- | ------ |
| 4.7.1 | PENDING payment badge      | Observe | Orange badge.        | 🔲     |
| 4.7.2 | PAID payment badge         | Observe | Green/emerald badge. | 🔲     |
| 4.7.3 | PARTIAL_PAYMENT_DONE badge | Observe | Amber badge.         | 🔲     |
| 4.7.4 | IN_PROCESS status badge    | Observe | Blue badge.          | 🔲     |
| 4.7.5 | SUBMITTED status badge     | Observe | Green/emerald badge. | 🔲     |
| 4.7.6 | PENDING_INFO status badge  | Observe | Amber badge.         | 🔲     |

---

## 5. Data Consistency (Enquiry ↔ Application)

| #   | Test Case                                         | Steps                                                                                        | Expected Result                                                    | Status |
| --- | ------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------ |
| 5.1 | Application from enquiry copies data correctly    | 1. Create enquiry with all fields 2. Create application from it 3. Check application detail  | Client name, type, email, phone, notes match the original enquiry. | 🔲     |
| 5.2 | Enquiry shows "Linked" after creating application | 1. Create application from enquiry 2. Check enquiries table                                  | Enquiry row has green "Linked" badge.                              | 🔲     |
| 5.3 | Application detail shows linked enquiry info      | 1. View application created from enquiry                                                     | Linked Enquiry section displays enquiry name, type.                | 🔲     |
| 5.4 | "View Enquiry" action on linked application       | 1. In applications table 2. Click "⋯" on linked app 3. Select "View Enquiry"                 | Navigates to the correct enquiry (or opens detail).                | 🔲     |
| 5.5 | "View Application" action on linked enquiry       | 1. In enquiries table 2. Click "⋯" on linked enquiry 3. Select "View Application"            | Navigates to `/crm/applications/[id]` for the correct application. | 🔲     |
| 5.6 | Editing enquiry does NOT auto-update application  | 1. Create app from enquiry 2. Edit the enquiry's name 3. Check application                   | Application retains original copied data (not auto-synced).        | 🔲     |
| 5.7 | Company isolation                                 | 1. Login as User A (Company A) 2. Create enquiry 3. Login as User B (Company B, if testable) | User B cannot see User A's enquiries or applications.              | 🔲     |

---

## 6. UI/UX Testing

### 6.1 Table Layout Consistency

| #     | Test Case                         | Steps                                                     | Expected Result                                                                               | Status |
| ----- | --------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------ |
| 6.1.1 | Enquiry table columns aligned     | 1. Go to `/crm/enquiries`                                 | All columns are aligned, headers match data columns. No overflow or truncation unless styled. | 🔲     |
| 6.1.2 | Application table columns aligned | 1. Go to `/crm/applications`                              | Same alignment standards met.                                                                 | 🔲     |
| 6.1.3 | Consistent badge styling          | 1. Compare badge styles across enquiries and applications | Badges are consistently sized, colored, and positioned.                                       | 🔲     |
| 6.1.4 | Action menu positioning           | 1. Click "⋯" on multiple rows                             | Dropdown menu is correctly positioned, not clipped by viewport.                               | 🔲     |
| 6.1.5 | Table row hover state             | 1. Hover over table rows                                  | Rows show a subtle hover highlight.                                                           | 🔲     |

### 6.2 Modal/Drawer Behavior

| #     | Test Case                      | Steps                                                    | Expected Result                                                         | Status |
| ----- | ------------------------------ | -------------------------------------------------------- | ----------------------------------------------------------------------- | ------ |
| 6.2.1 | Modal backdrop                 | 1. Open any modal (Add/Edit Enquiry or Application)      | Dark backdrop/overlay visible behind the modal.                         | 🔲     |
| 6.2.2 | Modal closes on backdrop click | 1. Open modal 2. Click outside modal on backdrop         | Modal closes (or does not, depending on design — verify consistency).   | 🔲     |
| 6.2.3 | Slide-over animation           | 1. Click on an enquiry row                               | Slide-over panel slides in from the right smoothly.                     | 🔲     |
| 6.2.4 | Slide-over backdrop            | 1. Open slide-over                                       | Backdrop visible, clicking it closes the slide-over.                    | 🔲     |
| 6.2.5 | Modal scroll on small screen   | 1. Resize to small screen 2. Open modal with many fields | Modal content is scrollable without cutting off form fields or buttons. | 🔲     |
| 6.2.6 | Modal form reset on close      | 1. Open Add modal 2. Fill fields 3. Close 4. Re-open     | Form is reset/cleared on re-open.                                       | 🔲     |

### 6.3 Button States

| #     | Test Case                          | Steps                                                  | Expected Result                                                        | Status |
| ----- | ---------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------- | ------ |
| 6.3.1 | Primary button hover               | 1. Hover over "New Enquiry" / "New Application" button | Visual hover feedback (e.g., color darken).                            | 🔲     |
| 6.3.2 | Submit button loading state        | 1. Submit a form 2. Observe button during API call     | Button shows loading indicator or is disabled to prevent double-click. | 🔲     |
| 6.3.3 | Disabled invoice button            | 1. Open enquiry slide-over                             | "Send Invoice" is visually disabled (grayed, no pointer cursor).       | 🔲     |
| 6.3.4 | Disabled retainer agreement button | 1. Open enquiry slide-over                             | "Send Retainer Agreement" is visually disabled.                        | 🔲     |
| 6.3.5 | Logout button styling              | 1. Observe sidebar logout button                       | Clearly identifiable as logout action (red text, icon, etc.).          | 🔲     |

### 6.4 Alignment and Spacing

| #     | Test Case                              | Steps                                       | Expected Result                                                             | Status |
| ----- | -------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------- | ------ |
| 6.4.1 | Desktop main content padding           | 1. Login on desktop 2. Observe content area | Content has proper padding (p-6 sm:p-8 md:p-12). Not flush against sidebar. | 🔲     |
| 6.4.2 | Mobile content does not overlap header | 1. Resize to mobile 2. Observe content      | Content starts below the mobile header (pt-16). No overlap.                 | 🔲     |
| 6.4.3 | Sidebar width consistency              | 1. Navigate between pages                   | Sidebar remains consistently 240px wide. Content area adjusts.              | 🔲     |
| 6.4.4 | Form field alignment in modals         | 1. Open Add/Edit modals                     | Labels and inputs are properly aligned and evenly spaced.                   | 🔲     |

---

## 7. Permissions & Security

| #    | Test Case                                     | Steps                                                                                          | Expected Result                                                                            | Status |
| ---- | --------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------ |
| 7.1  | Protected API — no token                      | 1. Use Postman/curl: `GET /api/enquiries` without `authToken` cookie                           | 401 Unauthorized response.                                                                 | 🔲     |
| 7.2  | Protected API — invalid token                 | 1. Set `authToken` cookie to random string 2. Call `GET /api/enquiries`                        | 401 Unauthorized response.                                                                 | 🔲     |
| 7.3  | Cross-company data access (API)               | 1. Get a valid token for Company A 2. Try to `GET /api/enquiries/[id]` for Company B's enquiry | 403 Forbidden response. Data not returned.                                                 | 🔲     |
| 7.4  | Cross-company application access              | 1. Same as above for `/api/applications/[id]` belonging to another company                     | 403 Forbidden.                                                                             | 🔲     |
| 7.5  | Cross-company delete attempt                  | 1. Try `DELETE /api/enquiries/[id]` for another company's enquiry                              | 403 Forbidden. Enquiry not deleted.                                                        | 🔲     |
| 7.6  | Cross-company edit attempt                    | 1. Try `PUT /api/enquiries/[id]` for another company's data                                    | 403 Forbidden. Data not modified.                                                          | 🔲     |
| 7.7  | Auth cookie is httpOnly                       | 1. Login 2. In browser console: `document.cookie`                                              | `authToken` is NOT accessible via JavaScript (httpOnly).                                   | 🔲     |
| 7.8  | No sensitive data in frontend source          | 1. View page source / network tab                                                              | No passwords, JWT secrets, or database URLs exposed.                                       | 🔲     |
| 7.9  | Login endpoint rate limiting (if implemented) | 1. Send 50+ rapid login attempts with wrong credentials                                        | Rate limiting or account lockout triggers (if implemented). Otherwise note as improvement. | 🔲     |
| 7.10 | SQL injection in search/filter                | 1. Enter SQL injection strings in search box (e.g., `'; DROP TABLE enquiry; --`)               | No error. Data is safely queried via Prisma (parameterized).                               | 🔲     |
| 7.11 | XSS in client name field                      | 1. Create enquiry with name: `<script>alert('xss')</script>`                                   | Script is not executed. Text is safely escaped in the UI.                                  | 🔲     |
| 7.12 | XSS in notes field                            | 1. Create enquiry with notes containing HTML/script tags                                       | HTML is rendered as text, not executed.                                                    | 🔲     |

---

## 8. Error Handling

| #   | Test Case                           | Steps                                                                | Expected Result                                                           | Status |
| --- | ----------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------ |
| 8.1 | API failure on enquiry create       | 1. Simulate server error (e.g., disconnect DB) 2. Submit new enquiry | Error message displayed to user. Form does not lose data.                 | 🔲     |
| 8.2 | API failure on application create   | 1. Simulate error 2. Submit new application                          | Error message displayed.                                                  | 🔲     |
| 8.3 | Network failure during login        | 1. Disable network 2. Attempt login                                  | Clear error message shown (e.g., "Network error" or "Failed to connect"). | 🔲     |
| 8.4 | 404 for non-existent enquiry ID     | 1. Navigate to `/api/enquiries/nonexistent-id`                       | 404 response with message.                                                | 🔲     |
| 8.5 | 404 for non-existent application ID | 1. Navigate to `/crm/applications/nonexistent-id`                    | "Application Not Found" message displayed.                                | 🔲     |
| 8.6 | Validation errors display clearly   | 1. Submit form with multiple validation errors                       | All errors shown inline below respective fields.                          | 🔲     |
| 8.7 | Server error (500) handling         | 1. Trigger unexpected server error via malformed request             | 500 response returned with generic message (no stack trace exposed).      | 🔲     |

---

## 9. Edge Cases

| #    | Test Case                              | Steps                                                                          | Expected Result                                                                    | Status |
| ---- | -------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ------ |
| 9.1  | Very long client name (200 chars)      | 1. Enter a 200-character client name 2. Submit                                 | Accepted. Displays properly in table (maybe truncated with ellipsis).              | 🔲     |
| 9.2  | Special characters in name             | 1. Enter "O'Brien-Smith & Co." as client name                                  | Accepted. Displays correctly without encoding issues.                              | 🔲     |
| 9.3  | Unicode characters                     | 1. Enter "日本語テスト" as client name                                         | Accepted and displayed correctly.                                                  | 🔲     |
| 9.4  | Very long notes (2000 chars)           | 1. Enter a 2000-character notes field 2. Submit                                | Accepted. Displays in slide-over/detail view.                                      | 🔲     |
| 9.5  | Empty submission after clearing fields | 1. Open Add modal 2. Type in name then delete it 3. Submit                     | Validation error for empty required fields.                                        | 🔲     |
| 9.6  | Rapid double-click on "Submit"         | 1. Fill form 2. Double-click submit quickly                                    | Only one record created (not duplicated). Button should disable after first click. | 🔲     |
| 9.7  | Rapid double-click on "Delete"         | 1. Click delete 2. Confirm rapidly twice                                       | Only one delete processed. No errors from trying to delete non-existent record.    | 🔲     |
| 9.8  | Page refresh during modal open         | 1. Open Add Enquiry modal 2. Press F5/Cmd+R                                    | Page refreshes. Modal closes. No data saved (no partial record).                   | 🔲     |
| 9.9  | Browser back button during modal       | 1. Open modal 2. Press browser Back                                            | Modal closes or page navigates back. No crash.                                     | 🔲     |
| 9.10 | Multiple tabs — concurrent edits       | 1. Open same enquiry in two tabs 2. Edit in Tab A, save 3. Edit in Tab B, save | Last save wins. No error (or stale data warning if implemented).                   | 🔲     |
| 9.11 | Whitespace-only client name            | 1. Enter " " (spaces only) as client name 2. Submit                            | Validation error (name is trimmed and considered empty).                           | 🔲     |
| 9.12 | Follow-up date in the past             | 1. Set a follow-up date to yesterday 2. Submit                                 | Accepted (no restriction). Date displays correctly.                                | 🔲     |
| 9.13 | Very far future due date               | 1. Set due date to year 2099                                                   | Accepted and displayed correctly.                                                  | 🔲     |
| 9.14 | Navigate away during API call          | 1. Submit form 2. Immediately click sidebar link                               | No errors on navigation. Record either created or not (no partial state).          | 🔲     |

---

## 10. Responsiveness

| #    | Test Case                         | Steps                                          | Expected Result                                                                  | Status |
| ---- | --------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------- | ------ |
| 10.1 | Desktop layout (≥ 1024px)         | 1. View on full desktop screen                 | Sidebar fixed left (240px). Content fills remaining space. Tables readable.      | 🔲     |
| 10.2 | Tablet layout (768px–1023px)      | 1. Resize to tablet width                      | Desktop sidebar may still display (≥ md). Content adjusts. Tables remain usable. | 🔲     |
| 10.3 | Mobile layout (< 768px)           | 1. Resize to mobile width                      | Desktop sidebar hidden. Mobile header + hamburger visible. Content full width.   | 🔲     |
| 10.4 | Table readability on mobile       | 1. View enquiries/applications table on mobile | Table is horizontally scrollable or columns stack. Data is accessible.           | 🔲     |
| 10.5 | Modal on mobile                   | 1. Open Add/Edit modal on mobile screen        | Modal fills available space, form is scrollable, buttons reachable.              | 🔲     |
| 10.6 | Slide-over on mobile              | 1. Open enquiry detail on mobile               | Slide-over is usable, covers full width or nearly so. Can close it.              | 🔲     |
| 10.7 | Application detail page on mobile | 1. Open `/crm/applications/[id]` on mobile     | Layout stacks from 3-col to 2-col to 1-col. All info visible.                    | 🔲     |
| 10.8 | Dashboard on mobile               | 1. Open `/crm/dashboard` on mobile             | Stat cards stack vertically. No horizontal overflow.                             | 🔲     |
| 10.9 | Login page on mobile              | 1. Open`/crm/login` on mobile                  | Form is centered, inputs are full width, submit button accessible.               | 🔲     |

---

## 11. Performance

| #    | Test Case                      | Steps                                               | Expected Result                                                          | Status |
| ---- | ------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------ | ------ |
| 11.1 | Enquiries table load time      | 1. Navigate to `/crm/enquiries` with 50+ records    | Table renders within 2–3 seconds. No visible jank.                       | 🔲     |
| 11.2 | Applications table load time   | 1. Navigate to `/crm/applications` with 50+ records | Same under 2–3 seconds.                                                  | 🔲     |
| 11.3 | Slide-over open speed          | 1. Click on an enquiry row                          | Slide-over opens immediately with smooth animation.                      | 🔲     |
| 11.4 | Filter responsiveness          | 1. Change filter dropdown                           | Table updates instantly (client-side filtering).                         | 🔲     |
| 11.5 | Search debounce/responsiveness | 1. Type quickly in search box                       | Table filters smoothly without noticeable lag.                           | 🔲     |
| 11.6 | Pagination transition          | 1. Click between pages                              | Page transition is instant. No loading delay for client-side pagination. | 🔲     |
| 11.7 | Modal open/close speed         | 1. Open and close modals repeatedly                 | Opens and closes instantly with no delay or flicker.                     | 🔲     |
| 11.8 | Page transitions (sidebar nav) | 1. Click between Dashboard, Enquiries, Applications | Pages load within 1–2 seconds. No blank screen.                          | 🔲     |

---

## 12. Dashboard

| #    | Test Case                   | Steps                                          | Expected Result                                                                                          | Status |
| ---- | --------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------ |
| 12.1 | Dashboard loads after login | 1. Login 2. Observe `/crm/dashboard`           | Page header, stat cards visible. No errors.                                                              | 🔲     |
| 12.2 | Stat cards display          | 1. Observe the 3 stat cards                    | "Total Enquiries", "Active Applications", "Pending Actions" cards visible (may show "—" as placeholder). | 🔲     |
| 12.3 | Dashboard does not crash    | 1. Navigate to `/crm/dashboard` multiple times | Page renders consistently without errors.                                                                | 🔲     |

---

## 13. Home Page (`/`)

| #    | Test Case                           | Steps                                    | Expected Result                                    | Status |
| ---- | ----------------------------------- | ---------------------------------------- | -------------------------------------------------- | ------ |
| 13.1 | Marketing homepage loads            | 1. Navigate to `/`                       | Marketing website homepage with Header and Footer. | 🔲     |
| 13.2 | About page loads                    | 1. Navigate to `/about`                  | About page renders with marketing layout.          | 🔲     |
| 13.3 | Services page loads                 | 1. Navigate to `/services`               | Services page renders with marketing layout.       | 🔲     |
| 13.4 | Contact page loads                  | 1. Navigate to `/contact`                | Contact page renders with marketing layout.        | 🔲     |
| 13.5 | Marketing pages have no CRM sidebar | 1. Visit `/`, `/about`, `/services`      | No CRM sidebar visible. Marketing Header + Footer. | 🔲     |
| 13.6 | CRM welcome page loads              | 1. Navigate to `/crm` while logged in    | CRM welcome page with quick-start cards rendered.  | 🔲     |
| 13.7 | Quick-start cards are clickable     | 1. Click on a quick-start card on `/crm` | Navigates to the intended CRM route (if linked).   | 🔲     |

---

## Summary

| Module              | Total Tests | Pass | Fail | Not Tested |
| ------------------- | ----------- | ---- | ---- | ---------- |
| 1. Authentication   | 17          |      |      |            |
| 2. Navigation       | 19          |      |      |            |
| 3. Enquiries        | 36          |      |      |            |
| 4. Applications     | 41          |      |      |            |
| 5. Data Consistency | 7           |      |      |            |
| 6. UI/UX            | 19          |      |      |            |
| 7. Security         | 12          |      |      |            |
| 8. Error Handling   | 7           |      |      |            |
| 9. Edge Cases       | 14          |      |      |            |
| 10. Responsiveness  | 9           |      |      |            |
| 11. Performance     | 8           |      |      |            |
| 12. Dashboard       | 3           |      |      |            |
| 13. Home Page       | 2           |      |      |            |
| **TOTAL**           | **194**     |      |      |            |
