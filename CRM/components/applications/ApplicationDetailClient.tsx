"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  User,
  FileText,
  ExternalLink,
  Trash2,
} from "lucide-react";
import EditApplicationModal from "./EditApplicationModal";
import type { Application } from "./ApplicationTableNew";

interface DetailApplication extends Application {
  enquiry?: {
    id: string;
    clientName: string;
    email?: string | null;
    phone?: string | null;
    enquiryType: string;
    notes?: string | null;
    followUpDate?: string | Date | null;
  } | null;
}

interface Props {
  application: DetailApplication;
  companyId: string;
}

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Denver",
    });
  } catch {
    return "—";
  }
};

const paymentStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    PENDING: "Pending",
    PAID: "Paid",
    PARTIAL_PAYMENT_DONE: "Partial Payment Done",
  };
  return map[status] || status;
};

const paymentStatusBadge = (status: string): string => {
  const map: Record<string, string> = {
    PENDING: "bg-orange-50 text-orange-700 ring-orange-600/20",
    PAID: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    PARTIAL_PAYMENT_DONE: "bg-amber-50 text-amber-700 ring-amber-600/20",
  };
  return map[status] || "bg-gray-50 text-gray-700 ring-gray-600/20";
};

const currentStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    IN_PROCESS: "In Process",
    SUBMITTED: "Submitted",
    PENDING_INFO: "Pending Info",
  };
  return map[status] || status;
};

const currentStatusBadge = (status: string): string => {
  const map: Record<string, string> = {
    IN_PROCESS: "bg-blue-50 text-blue-700 ring-blue-600/20",
    SUBMITTED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    PENDING_INFO: "bg-amber-50 text-amber-700 ring-amber-600/20",
  };
  return map[status] || "bg-gray-50 text-gray-700 ring-gray-600/20";
};

export default function ApplicationDetailClient({
  application,
  companyId,
}: Props) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete");
      }
      router.push("/applications");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete application",
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          title="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {application.clientFullName}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Application Details</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact Information */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Contact Information
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 px-6 py-5 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail size={16} className="flex-shrink-0 text-gray-400" />
                <div>
                  <dt className="text-xs font-medium text-gray-500">Email</dt>
                  {application.email ? (
                    <a
                      href={`mailto:${application.email}`}
                      className="text-sm text-red-600 hover:underline"
                    >
                      {application.email}
                    </a>
                  ) : (
                    <dd className="text-sm text-gray-400">Not provided</dd>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="flex-shrink-0 text-gray-400" />
                <div>
                  <dt className="text-xs font-medium text-gray-500">Phone</dt>
                  {application.phone ? (
                    <a
                      href={`tel:${application.phone}`}
                      className="text-sm text-red-600 hover:underline"
                    >
                      {application.phone}
                    </a>
                  ) : (
                    <dd className="text-sm text-gray-400">Not provided</dd>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Application Details
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 px-6 py-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-gray-500">
                  Application Type
                </dt>
                <dd className="mt-0.5 text-sm text-gray-900">
                  {application.applicationType
                    ? application.applicationType.charAt(0).toUpperCase() +
                      application.applicationType.slice(1)
                    : "—"}
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <User size={16} className="flex-shrink-0 text-gray-400" />
                <div>
                  <dt className="text-xs font-medium text-gray-500">
                    Assigned Employee
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {application.assignedEmployeeId || "—"}
                  </dd>
                </div>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-gray-500">Notes</dt>
                <dd className="mt-0.5 whitespace-pre-wrap break-words text-sm text-gray-900">
                  {application.notes || "—"}
                </dd>
              </div>
            </div>
          </div>

          {/* Related Enquiry */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Linked Enquiry
              </h2>
            </div>
            <div className="px-6 py-5">
              {application.enquiry ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <ExternalLink size={16} className="text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800">
                        {application.enquiry.clientName}
                      </p>
                      <p className="text-xs text-emerald-600">
                        {application.enquiry.enquiryType} enquiry
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-0.5 text-sm text-gray-900">
                        {application.enquiry.email || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">
                        Phone
                      </dt>
                      <dd className="mt-0.5 text-sm text-gray-900">
                        {application.enquiry.phone || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">
                        Follow-up Date
                      </dt>
                      <dd className="mt-0.5 text-sm text-gray-900">
                        {formatDate(application.enquiry.followUpDate)}
                      </dd>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-4">
                  <FileText size={16} className="text-gray-400" />
                  <p className="text-sm text-gray-500">
                    No linked enquiry — this application was created manually.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-6">
          {/* Status card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Status
              </h2>
            </div>
            <div className="space-y-5 px-6 py-5">
              <div>
                <dt className="text-xs font-medium text-gray-500">
                  Payment Status
                </dt>
                <dd className="mt-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${paymentStatusBadge(application.paymentStatus)}`}
                  >
                    <CreditCard size={14} />
                    {paymentStatusLabel(application.paymentStatus)}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">
                  Current Status
                </dt>
                <dd className="mt-1.5">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${currentStatusBadge(application.currentStatus)}`}
                  >
                    {currentStatusLabel(application.currentStatus)}
                  </span>
                </dd>
              </div>
            </div>
          </div>

          {/* Dates card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Dates
              </h2>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="flex-shrink-0 text-gray-400" />
                <div>
                  <dt className="text-xs font-medium text-gray-500">
                    Due Date
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(application.dueDate)}
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="flex-shrink-0 text-gray-400" />
                <div>
                  <dt className="text-xs font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(application.createdAt)}
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="flex-shrink-0 text-gray-400" />
                <div>
                  <dt className="text-xs font-medium text-gray-500">
                    Last Updated
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(application.updatedAt)}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditApplicationModal
        open={isEditModalOpen}
        application={application}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
