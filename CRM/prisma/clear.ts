import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Clearing demo data (keeping users & company)...\n");

  const apps = await prisma.application.deleteMany();
  console.log(`✓ Deleted ${apps.count} applications`);

  const enqs = await prisma.enquiry.deleteMany();
  console.log(`✓ Deleted ${enqs.count} enquiries`);

  console.log("\n✅ Done. Users and company are untouched.");
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
