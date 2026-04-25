export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import ApplicationsPageClient from "@/components/applications/ApplicationsPageClient";
import { redirect } from "next/navigation";

export default async function ApplicationsPage() {
  // Get current user from JWT token
  const user = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/crm/login");
  }

  // Fetch all applications for the company
  const applications = await prisma.application.findMany({
    where: {
      companyId: user.companyId,
    },
    select: {
      id: true,
      clientFullName: true,
      applicationType: true,
      email: true,
      phone: true,
      notes: true,
      paymentStatus: true,
      currentStatus: true,
      dueDate: true,
      assignedEmployeeId: true,
      enquiryId: true,
      createdAt: true,
      updatedAt: true,
      companyId: true,
      enquiry: {
        select: {
          id: true,
          clientName: true,
          enquiryType: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize dates to strings for client component
  const serializedApplications = applications.map((app) => ({
    ...app,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    dueDate: app.dueDate ? app.dueDate.toISOString() : null,
  }));

  // Use the companyId from the user's JWT token
  const companyId = user.companyId;

  return (
    <ApplicationsPageClient
      applications={serializedApplications}
      companyId={companyId}
    />
  );
}
