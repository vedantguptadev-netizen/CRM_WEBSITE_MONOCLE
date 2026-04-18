"use client";

import {
  LayoutDashboard,
  Briefcase,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
  CircleDot,
  Timer,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────

interface DashboardStats {
  totalEnquiries: number;
  totalApplications: number;
  pipelineInProcess: number;
  pipelinePendingInfo: number;
  pipelineSubmitted: number;
  pendingPayments: number;
  upcomingFollowUps: number;
  overdueApplications: number;
  enquiriesWithoutApp: number;
}

interface DashboardClientProps {
  stats: DashboardStats;
}

// ─── Component ──────────────────────────────────────────────────

export default function DashboardClient({ stats }: DashboardClientProps) {
  const needsAttention = stats.overdueApplications + stats.upcomingFollowUps;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 shrink-0 mt-0.5">
          <LayoutDashboard className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here&apos;s an overview of your CRM activity.
          </p>
        </div>
      </div>

      {/* ── Stats Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Enquiries */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">Total Enquiries</p>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50">
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalEnquiries}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {stats.enquiriesWithoutApp} without application
          </p>
        </div>

        {/* Total Applications */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">
              Total Applications
            </p>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50">
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalApplications}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {stats.pipelineInProcess} in process
          </p>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">
              Pending Payments
            </p>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.pendingPayments}
          </p>
          <p className="text-xs text-gray-400 mt-1">Awaiting payment</p>
        </div>

        {/* Pending Actions */}
        <div
          className={`bg-white rounded-xl border p-5 shadow-sm ${needsAttention > 0 ? "border-red-200" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className={`text-sm font-medium ${needsAttention > 0 ? "text-red-600" : "text-gray-500"}`}
            >
              Needs Attention
            </p>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-lg ${needsAttention > 0 ? "bg-red-50" : "bg-gray-50"}`}
            >
              <AlertTriangle
                className={`w-4 h-4 ${needsAttention > 0 ? "text-red-600" : "text-gray-400"}`}
              />
            </div>
          </div>
          <p
            className={`text-3xl font-bold ${needsAttention > 0 ? "text-red-600" : "text-gray-900"}`}
          >
            {needsAttention}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {stats.overdueApplications} overdue · {stats.upcomingFollowUps}{" "}
            follow-ups
          </p>
        </div>
      </div>

      {/* ── Pipeline Overview ────────────────────────────────── */}
      {stats.totalApplications > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            Application Pipeline
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 rounded-lg bg-blue-50/50 border border-blue-100 p-4">
              <CircleDot className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {stats.pipelineInProcess}
                </p>
                <p className="text-xs text-gray-500">In Process</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-amber-50/50 border border-amber-100 p-4">
              <Timer className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {stats.pipelinePendingInfo}
                </p>
                <p className="text-xs text-gray-500">Pending Info</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-emerald-50/50 border border-emerald-100 p-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {stats.pipelineSubmitted}
                </p>
                <p className="text-xs text-gray-500">Submitted</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
