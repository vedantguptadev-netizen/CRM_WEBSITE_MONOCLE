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
];

// Status assignments — gives a good mix for the demo
const statusAssignments = [
  "new", // Arjun
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
