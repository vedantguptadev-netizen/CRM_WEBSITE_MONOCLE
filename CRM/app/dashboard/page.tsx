import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const companyId = user.companyId;

  // Fetch all data in parallel
  const [enquiries, applications] = await Promise.all([
    prisma.enquiry.findMany({
      where: { companyId },
      include: { application: { select: { id: true } } },
    }),
    prisma.application.findMany({
      where: { companyId },
    }),
  ]);

  // Compute stats
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const activeApplications = applications.filter(
    (a) => a.currentStatus === "IN_PROCESS",
  ).length;

  const pendingPayments = applications.filter(
    (a) =>
      a.paymentStatus === "PENDING" ||
      a.paymentStatus === "PARTIAL_PAYMENT_DONE",
  ).length;

  const overdueApplications = applications.filter(
    (a) => a.dueDate && new Date(a.dueDate) < now,
  ).length;

  const upcomingFollowUps = enquiries.filter(
    (e) =>
      e.followUpDate &&
      new Date(e.followUpDate) >= now &&
      new Date(e.followUpDate) <= sevenDaysFromNow,
  ).length;

  const enquiriesWithoutApp = enquiries.filter((e) => !e.application).length;

  const stats = {
    totalEnquiries: enquiries.length,
    totalApplications: applications.length,
    activeApplications,
    pendingPayments,
    upcomingFollowUps,
    overdueApplications,
    enquiriesWithoutApp,
  };

  return <DashboardClient stats={stats} />;
}
