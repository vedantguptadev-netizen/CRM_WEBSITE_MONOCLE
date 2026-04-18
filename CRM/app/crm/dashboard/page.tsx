import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/crm/login");
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

  // Pipeline counts — based on currentStatus (workflow stage)
  const pipelineInProcess = applications.filter(
    (a) => a.currentStatus === "IN_PROCESS",
  ).length;

  const pipelinePendingInfo = applications.filter(
    (a) => a.currentStatus === "PENDING_INFO",
  ).length;

  const pipelineSubmitted = applications.filter(
    (a) => a.currentStatus === "SUBMITTED",
  ).length;

  const pendingPayments = applications.filter(
    (a) =>
      a.paymentStatus === "PENDING" ||
      a.paymentStatus === "PARTIAL_PAYMENT_DONE",
  ).length;

  // Overdue: only count non-submitted applications (submitted = done)
  const overdueApplications = applications.filter(
    (a) =>
      a.dueDate &&
      new Date(a.dueDate) < now &&
      a.currentStatus !== "SUBMITTED",
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
    pipelineInProcess,
    pipelinePendingInfo,
    pipelineSubmitted,
    pendingPayments,
    upcomingFollowUps,
    overdueApplications,
    enquiriesWithoutApp,
  };

  return <DashboardClient stats={stats} />;
}
