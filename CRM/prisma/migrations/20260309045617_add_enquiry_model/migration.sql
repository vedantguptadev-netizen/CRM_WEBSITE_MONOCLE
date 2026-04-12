-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "enquiryType" TEXT NOT NULL,
    "notes" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
