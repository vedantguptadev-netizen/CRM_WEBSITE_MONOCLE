-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "clientFullName" TEXT NOT NULL,
    "applicationType" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "currentStatus" TEXT NOT NULL DEFAULT 'IN_PROCESS',
    "dueDate" TIMESTAMP(3),
    "assignedEmployeeId" TEXT,
    "companyId" TEXT NOT NULL,
    "enquiryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Application_enquiryId_key" ON "Application"("enquiryId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
