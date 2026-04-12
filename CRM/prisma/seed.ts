import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Helpers ────────────────────────────────────────────────────

/** Returns a Date offset from now by the given number of days */
function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(12, 0, 0, 0);
  return d;
}

/** Returns a Date offset in the past by the given number of days */
function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(12, 0, 0, 0);
  return d;
}

// ─── Seed Data ──────────────────────────────────────────────────

interface EnquirySeed {
  clientName: string;
  email: string;
  phone: string;
  enquiryType: string;
  notes: string;
  followUpDate: Date | null;
  createdAt: Date;
}

const enquiryData: EnquirySeed[] = [
  {
    clientName: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    phone: "+91-98765-43210",
    enquiryType: "Study Permit",
    notes:
      "Accepted to University of Toronto, MSc Computer Science. Needs GIC guidance and SDS stream eligibility check.",
    followUpDate: daysFromNow(2),
    createdAt: daysAgo(12),
  },
  {
    clientName: "Fatima Al-Rashidi",
    email: "fatima.alrashidi@example.com",
    phone: "+971-50-987-6543",
    enquiryType: "Express Entry",
    notes:
      "CRS score 472, NOC 21232 Software Developer. 4 years experience. IELTS CLB 9. Waiting for next draw.",
    followUpDate: daysFromNow(5),
    createdAt: daysAgo(10),
  },
  {
    clientName: "Wei Zhang",
    email: "wei.zhang@example.com",
    phone: "+86-138-0013-8000",
    enquiryType: "Work Permit",
    notes:
      "LMIA-based work permit for restaurant manager position in Calgary. Employer has positive LMIA.",
    followUpDate: daysFromNow(1),
    createdAt: daysAgo(8),
  },
  {
    clientName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91-99887-76655",
    enquiryType: "Family Sponsorship",
    notes:
      "Sponsoring parents and grandparents. PR card holder since 2022. Meets income requirements.",
    followUpDate: daysFromNow(7),
    createdAt: daysAgo(15),
  },
  {
    clientName: "Carlos Rodriguez",
    email: "carlos.r@example.com",
    phone: "+52-55-1234-5678",
    enquiryType: "Visitor Visa",
    notes:
      "Tourist visa for 3-week vacation. Has US B1/B2 visa. Strong ties to home country.",
    followUpDate: null,
    createdAt: daysAgo(20),
  },
  {
    clientName: "Olga Petrov",
    email: "olga.petrov@example.com",
    phone: "+7-916-123-4567",
    enquiryType: "PGWP",
    notes:
      "Completing 2-year diploma at Seneca College in May. Needs PGWP application guidance before study permit expires.",
    followUpDate: daysFromNow(3),
    createdAt: daysAgo(5),
  },
  {
    clientName: "Samuel Okafor",
    email: "samuel.okafor@example.com",
    phone: "+234-801-234-5678",
    enquiryType: "LMIA",
    notes:
      "Employer in Edmonton needs LMIA for truck driver (NOC 73300). Median wage confirmed. Recruitment efforts documented.",
    followUpDate: daysFromNow(4),
    createdAt: daysAgo(7),
  },
  {
    clientName: "Yuki Tanaka",
    email: "yuki.tanaka@example.com",
    phone: "+81-90-1234-5678",
    enquiryType: "Citizenship",
    notes:
      "PR since 2021. Has 1,200+ days physical presence. Needs help with citizenship test prep and application.",
    followUpDate: daysFromNow(14),
    createdAt: daysAgo(3),
  },
  {
    clientName: "Maria Santos",
    email: "maria.santos@example.com",
    phone: "+55-11-98765-4321",
    enquiryType: "Super Visa",
    notes:
      "Parents visiting from Brazil. Son is Canadian citizen. Need proof of medical insurance and invitation letter.",
    followUpDate: daysFromNow(6),
    createdAt: daysAgo(9),
  },
  {
    clientName: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    phone: "+20-100-123-4567",
    enquiryType: "Study Permit",
    notes:
      "Conditional acceptance from UBC for BBA program. Needs study plan and financial proof preparation.",
    followUpDate: daysFromNow(10),
    createdAt: daysAgo(6),
  },
  {
    clientName: "Elena Dubois",
    email: "elena.dubois@example.com",
    phone: "+33-6-12-34-56-78",
    enquiryType: "Express Entry",
    notes:
      "French-speaking candidate. CRS 445 with Francophone mobility bonus. NOC 11202 Auditor. 6 years experience.",
    followUpDate: null,
    createdAt: daysAgo(25),
  },
  {
    clientName: "Raj Patel",
    email: "raj.patel@example.com",
    phone: "+91-94265-12345",
    enquiryType: "Work Permit",
    notes:
      "Open work permit for spouse of study permit holder at University of Alberta. Needs work permit extension.",
    followUpDate: daysFromNow(8),
    createdAt: daysAgo(4),
  },
  {
    clientName: "Ji-Yeon Kim",
    email: "jiyeon.kim@example.com",
    phone: "+82-10-9876-5432",
    enquiryType: "Visitor Visa",
    notes:
      "Business visitor attending tech conference in Vancouver. Needs proper invitation and business itinerary.",
    followUpDate: daysFromNow(0),
    createdAt: daysAgo(2),
  },
  {
    clientName: "Miguel Torres",
    email: "miguel.torres@example.com",
    phone: "+57-310-123-4567",
    enquiryType: "Family Sponsorship",
    notes:
      "Sponsoring spouse from Colombia. Common-law relationship. Gathering cohabitation proof and photos.",
    followUpDate: daysFromNow(12),
    createdAt: daysAgo(18),
  },
  {
    clientName: "Amara Diallo",
    email: "amara.diallo@example.com",
    phone: "+221-77-123-45-67",
    enquiryType: "LMIA",
    notes:
      "Employer in Winnipeg hiring agricultural worker (NOC 85100). Seasonal LMIA stream. Housing arranged.",
    followUpDate: daysFromNow(9),
    createdAt: daysAgo(11),
  },
];

// Status assignments — gives a good mix for the demo
const statusAssignments = [
  "new", // Arjun
  "contacted", // Fatima
  "in_progress", // Wei
  "contacted", // Priya
  "closed", // Carlos
  "in_progress", // Olga
  "new", // Samuel
  "contacted", // Yuki
  "new", // Maria Santos
  "new", // Ahmed
  "closed", // Elena
  "in_progress", // Raj
  "contacted", // Ji-Yeon
  "in_progress", // Miguel
  "new", // Amara
];

// Applications to create — linked to specific enquiries by index
interface ApplicationSeed {
  enquiryIndex: number;
  applicationType: string;
  currentStatus: string;
  paymentStatus: string;
  dueDate: Date | null;
  notes: string;
  createdAt: Date;
}

const applicationData: ApplicationSeed[] = [
  {
    enquiryIndex: 0, // Arjun — Study Permit
    applicationType: "Study Permit",
    currentStatus: "IN_PROCESS",
    paymentStatus: "PAID",
    dueDate: daysFromNow(21),
    notes:
      "All documents received. Application submitted to IRCC portal. Biometrics appointment scheduled.",
    createdAt: daysAgo(8),
  },
  {
    enquiryIndex: 1, // Fatima — Express Entry
    applicationType: "PR Application",
    currentStatus: "SUBMITTED",
    paymentStatus: "PAID",
    dueDate: daysFromNow(60),
    notes:
      "ITA received. Full PR application submitted. Police clearance and medical exam completed.",
    createdAt: daysAgo(7),
  },
  {
    enquiryIndex: 2, // Wei — Work Permit
    applicationType: "Work Permit",
    currentStatus: "IN_PROCESS",
    paymentStatus: "PARTIAL_PAYMENT_DONE",
    dueDate: daysFromNow(14),
    notes:
      "LMIA approved. Work permit application in progress. Awaiting passport submission.",
    createdAt: daysAgo(5),
  },
  {
    enquiryIndex: 3, // Priya — Sponsorship
    applicationType: "Sponsorship",
    currentStatus: "PENDING_INFO",
    paymentStatus: "PENDING",
    dueDate: daysFromNow(30),
    notes:
      "Sponsorship application started. Waiting for client to provide parents' medical exam results.",
    createdAt: daysAgo(10),
  },
  {
    enquiryIndex: 5, // Olga — PGWP
    applicationType: "Work Permit",
    currentStatus: "IN_PROCESS",
    paymentStatus: "PAID",
    dueDate: daysFromNow(7),
    notes:
      "PGWP application being prepared. Final transcripts received. Study permit valid until June.",
    createdAt: daysAgo(3),
  },
  {
    enquiryIndex: 6, // Samuel — LMIA
    applicationType: "Work Permit",
    currentStatus: "IN_PROCESS",
    paymentStatus: "PENDING",
    dueDate: daysFromNow(10),
    notes:
      "LMIA application filed with ESDC. Employer attestation letter included. Awaiting processing.",
    createdAt: daysAgo(4),
  },
  {
    enquiryIndex: 8, // Maria Santos — Super Visa
    applicationType: "Visitor Visa Extension",
    currentStatus: "PENDING_INFO",
    paymentStatus: "PARTIAL_PAYMENT_DONE",
    dueDate: daysFromNow(18),
    notes:
      "Super Visa application started. Waiting for medical insurance policy with minimum $100K coverage.",
    createdAt: daysAgo(6),
  },
  {
    enquiryIndex: 13, // Miguel — Spousal Sponsorship
    applicationType: "Sponsorship",
    currentStatus: "SUBMITTED",
    paymentStatus: "PAID",
    dueDate: daysFromNow(90),
    notes:
      "Spousal sponsorship package submitted. Includes relationship timeline, photos, and joint financial docs.",
    createdAt: daysAgo(14),
  },
];

// ─── Main ───────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting demo data seed...\n");

  // 1. Look up existing company
  const company = await prisma.company.findFirst();
  if (!company) {
    console.error(
      "❌ No company found in the database. Please create a company and user first, then re-run the seed.",
    );
    process.exit(1);
  }
  console.log(`✓ Using existing company: "${company.name}" (${company.id})`);

  // 2. Clean up previous demo data (enquiries cascade-delete linked applications via onDelete: SetNull on the relation,
  //    so we delete applications first to keep things tidy)
  const deletedApps = await prisma.application.deleteMany({
    where: { companyId: company.id },
  });
  const deletedEnqs = await prisma.enquiry.deleteMany({
    where: { companyId: company.id },
  });
  console.log(
    `✓ Cleaned up previous data: ${deletedEnqs.count} enquiries, ${deletedApps.count} applications\n`,
  );

  // 3. Seed enquiries
  const createdEnquiries = [];
  for (let i = 0; i < enquiryData.length; i++) {
    const e = enquiryData[i];
    const enquiry = await prisma.enquiry.create({
      data: {
        clientName: e.clientName,
        email: e.email,
        phone: e.phone,
        enquiryType: e.enquiryType,
        notes: `[${statusAssignments[i].toUpperCase()}] ${e.notes}`,
        followUpDate: e.followUpDate,
        companyId: company.id,
        createdAt: e.createdAt,
      },
    });
    createdEnquiries.push(enquiry);
  }
  console.log(`✓ Seeded ${createdEnquiries.length} enquiries`);
  createdEnquiries.forEach((enq, i) => {
    const status = statusAssignments[i];
    const followUp = enq.followUpDate
      ? enq.followUpDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "—";
    console.log(
      `  ${String(i + 1).padStart(2)}. [${status.padEnd(11)}] ${enq.clientName.padEnd(22)} | ${enq.enquiryType.padEnd(20)} | Follow-up: ${followUp}`,
    );
  });

  // 4. Seed applications (linked to enquiries)
  console.log("");
  const createdApplications = [];
  for (const app of applicationData) {
    const linkedEnquiry = createdEnquiries[app.enquiryIndex];
    const application = await prisma.application.create({
      data: {
        clientFullName: linkedEnquiry.clientName,
        applicationType: app.applicationType,
        email: linkedEnquiry.email,
        phone: linkedEnquiry.phone,
        notes: app.notes,
        currentStatus: app.currentStatus,
        paymentStatus: app.paymentStatus,
        dueDate: app.dueDate,
        companyId: company.id,
        enquiryId: linkedEnquiry.id,
        createdAt: app.createdAt,
      },
    });
    createdApplications.push(application);
  }
  console.log(`✓ Seeded ${createdApplications.length} applications`);
  createdApplications.forEach((app, i) => {
    const due = app.dueDate
      ? app.dueDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "—";
    console.log(
      `  ${String(i + 1).padStart(2)}. ${app.clientFullName.padEnd(22)} | ${(app.applicationType || "—").padEnd(24)} | ${app.currentStatus.padEnd(12)} | Pay: ${app.paymentStatus.padEnd(20)} | Due: ${due}`,
    );
  });

  // 5. Summary
  console.log("\n─── Seed Summary ───────────────────────────────────");
  console.log(`  Company:       ${company.name}`);
  console.log(`  Enquiries:     ${createdEnquiries.length}`);
  console.log(`  Applications:  ${createdApplications.length}`);
  console.log(
    `  Statuses:      new(${statusAssignments.filter((s) => s === "new").length}), contacted(${statusAssignments.filter((s) => s === "contacted").length}), in_progress(${statusAssignments.filter((s) => s === "in_progress").length}), closed(${statusAssignments.filter((s) => s === "closed").length})`,
  );
  console.log(
    `  Payment mix:   PAID(${createdApplications.filter((a) => a.paymentStatus === "PAID").length}), PENDING(${createdApplications.filter((a) => a.paymentStatus === "PENDING").length}), PARTIAL(${createdApplications.filter((a) => a.paymentStatus === "PARTIAL_PAYMENT_DONE").length})`,
  );
  console.log("────────────────────────────────────────────────────\n");
  console.log("✅ Demo data seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
