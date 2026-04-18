# Dashboard Metrics — How the Numbers Work

This document explains what each number on the CRM Dashboard means and how it is calculated.

---

## Summary Cards

### 1. Total Enquiries

- **What it shows:** The total number of enquiries your company has recorded in the system.
- **How it's calculated:** Counts every enquiry belonging to your company — no filters, no exclusions.
- **Sub-text — "_X_ without application":** The number of enquiries that have **not** been converted into an application yet. This helps you see how many leads still need to be followed up on.

### 2. Total Applications

- **What it shows:** The total number of applications your company has in the system.
- **How it's calculated:** Counts every application belonging to your company, regardless of status or payment.
- **Sub-text — "_X_ in process":** The number of applications currently in the **In Process** stage (actively being worked on).

### 3. Pending Payments

- **What it shows:** How many applications have outstanding payments.
- **How it's calculated:** Counts applications where the payment status is either:
  - **Pending** — no payment has been received yet, OR
  - **Partial Payment Done** — some payment has been received, but the full amount is still outstanding.
- Applications that are marked **Paid** are excluded from this count.

### 4. Needs Attention

- **What it shows:** The number of items that require immediate action — things that are overdue or have upcoming follow-ups.
- **How it's calculated:** The sum of:
  - **Overdue applications** — applications with a due date that has already passed, **excluding** applications that have already been submitted (since those are completed).
  - **Upcoming follow-ups** — enquiries with a follow-up date within the **next 7 days** (from today).
- **Important:** This card does **not** include pending payments (those have their own dedicated card). There is no double-counting between the Pending Payments card and the Needs Attention card.
- **Sub-text breakdown:** Shows the exact split — e.g., "2 overdue · 3 follow-ups".

---

## Application Pipeline

The pipeline section shows how your applications are distributed across the three workflow stages. These three numbers will **always add up to your Total Applications** count.

### In Process

- **What it shows:** Applications that are actively being worked on.
- **How it's calculated:** Applications with status **In Process**.

### Pending Info

- **What it shows:** Applications that are waiting for additional information (e.g., missing documents from the client).
- **How it's calculated:** Applications with status **Pending Info**.

### Submitted

- **What it shows:** Applications that have been submitted and are considered complete from the consultancy's side.
- **How it's calculated:** Applications with status **Submitted**.

---

## Key Facts

| Rule                         | Detail                                                                              |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| Pipeline always adds up      | In Process + Pending Info + Submitted = Total Applications                          |
| No double-counting           | Each application appears in exactly one pipeline stage                              |
| Overdue excludes submitted   | Submitted applications are not flagged as overdue                                   |
| Follow-ups are enquiry-level | Follow-up dates come from enquiries, not applications                               |
| All data is company-scoped   | You only see numbers for your own company                                           |
| Real-time                    | All numbers are calculated live from the database every time you load the dashboard |
