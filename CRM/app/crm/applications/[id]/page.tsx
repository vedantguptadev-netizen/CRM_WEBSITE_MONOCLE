import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import ApplicationDetailClient from "@/components/applications/ApplicationDetailClient";
import { prisma } from "@/lib/prisma";

interface ApplicationDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  // Get current user from JWT token
  const user = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/crm/login");
  }

  // Fetch application directly from database
  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      enquiry: {
        select: {
          id: true,
          clientName: true,
          email: true,
          phone: true,
          enquiryType: true,
          customEnquiryType: true,
          notes: true,
          followUpDate: true,
          dateOfBirth: true,
        },
      },
    },
  });

  if (!application) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Application Not Found
          </h1>
          <p className="text-sm text-gray-500">
            The application you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
        </div>
      </div>
    );
  }

  // Verify company ownership
  if (application.companyId !== user.companyId) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Access Denied
          </h1>
          <p className="text-sm text-gray-500">
            You don&apos;t have permission to view this application.
          </p>
        </div>
      </div>
    );
  }

  // Serialize dates for client component
  const serialized = {
    ...application,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
    dueDate: application.dueDate ? application.dueDate.toISOString() : null,
    enquiry: application.enquiry
      ? {
          ...application.enquiry,
          followUpDate: application.enquiry.followUpDate
            ? application.enquiry.followUpDate.toISOString()
            : null,
          dateOfBirth: application.enquiry.dateOfBirth
            ? application.enquiry.dateOfBirth.toISOString()
            : null,
        }
      : null,
  };

  return (
    <ApplicationDetailClient
      application={serialized}
      companyId={user.companyId}
    />
  );
}
