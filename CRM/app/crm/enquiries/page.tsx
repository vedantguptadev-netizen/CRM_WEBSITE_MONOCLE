import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import EnquiryPageClient from "@/components/enquiries/EnquiryPageClient";
import { redirect } from "next/navigation";

export default async function EnquiriesPage() {
  // Get current user from JWT token
  const user = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/crm/login");
  }

  const enquiries = await prisma.enquiry.findMany({
    where: {
      companyId: user.companyId,
    },
    include: {
      application: {
        select: { id: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Use the companyId from the user's JWT token
  const companyId = user.companyId;

  return <EnquiryPageClient enquiries={enquiries} companyId={companyId} />;
}
