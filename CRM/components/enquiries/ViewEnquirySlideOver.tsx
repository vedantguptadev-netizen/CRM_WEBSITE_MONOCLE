"use client";

import {
  X,
  Mail,
  Phone,
  Calendar,
  FileText,
  ExternalLink,
  FilePlus,
  Receipt,
  ScrollText,
} from "lucide-react";
import type { Enquiry } from "./EnquiryTableNew";

interface ViewEnquirySlideOverProps {
  open: boolean;
  enquiry: Enquiry | null;
  onClose: () => void;
  onEdit: (enquiry: Enquiry) => void;
  onCreateApplication: (enquiryId: string) => void;
  onViewApplication: (applicationId: string) => void;
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

const enquiryTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    visa: "Visa Application",
    consultation: "Consultation",
    documentation: "Documentation",
    general: "General Enquiry",
  };
  return map[type] || type;
};

export default function ViewEnquirySlideOver({
  open,
  enquiry,
  onClose,
  onEdit,
  onCreateApplication,
  onViewApplication,
}: ViewEnquirySlideOverProps) {
  if (!open || !enquiry) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md">
        <div className="relative flex w-full flex-col overflow-x-hidden bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {enquiry.clientName}
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">Enquiry Details</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-6">
              {/* Contact Info */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="flex-shrink-0 text-gray-400" />
                    {enquiry.email ? (
                      <a
                        href={`mailto:${enquiry.email}`}
                        className="text-sm text-red-600 hover:underline"
                      >
                        {enquiry.email}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">
                        No email provided
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="flex-shrink-0 text-gray-400" />
                    {enquiry.phone ? (
                      <a
                        href={`tel:${enquiry.phone}`}
                        className="text-sm text-red-600 hover:underline"
                      >
                        {enquiry.phone}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">
                        No phone provided
                      </span>
                    )}
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Enquiry Details */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Enquiry Details
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Type</dt>
                    <dd className="mt-0.5 text-sm text-gray-900">
                      {enquiryTypeLabel(enquiry.enquiryType)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Notes</dt>
                    <dd className="mt-0.5 whitespace-pre-wrap break-words text-sm text-gray-900">
                      {enquiry.notes || "—"}
                    </dd>
                  </div>
                </dl>
              </section>

              <hr className="border-gray-100" />

              {/* Dates */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Dates
                </h3>
                <dl className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar
                      size={16}
                      className="flex-shrink-0 text-gray-400"
                    />
                    <div>
                      <dt className="text-xs font-medium text-gray-500">
                        Follow-Up Date
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(enquiry.followUpDate)}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar
                      size={16}
                      className="flex-shrink-0 text-gray-400"
                    />
                    <div>
                      <dt className="text-xs font-medium text-gray-500">
                        Created
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(enquiry.createdAt)}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar
                      size={16}
                      className="flex-shrink-0 text-gray-400"
                    />
                    <div>
                      <dt className="text-xs font-medium text-gray-500">
                        Last Updated
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(enquiry.updatedAt)}
                      </dd>
                    </div>
                  </div>
                </dl>
              </section>

              <hr className="border-gray-100" />

              {/* Application Status */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Linked Application
                </h3>
                {enquiry.application ? (
                  <button
                    onClick={() => onViewApplication(enquiry.application!.id)}
                    className="flex w-full items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-left transition-colors hover:bg-emerald-100"
                  >
                    <ExternalLink size={16} className="text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800">
                        View Application
                      </p>
                      <p className="text-xs text-emerald-600">
                        Application is linked to this enquiry
                      </p>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => onCreateApplication(enquiry.id)}
                    className="flex w-full items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-3 text-left transition-colors hover:border-gray-400 hover:bg-gray-100"
                  >
                    <FilePlus size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Create Application
                      </p>
                      <p className="text-xs text-gray-500">
                        No application linked yet
                      </p>
                    </div>
                  </button>
                )}
              </section>

              <hr className="border-gray-100" />

              {/* Actions */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Actions
                </h3>
                <div className="space-y-2">
                  <button
                    disabled
                    className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-left opacity-50 cursor-not-allowed"
                  >
                    <Receipt size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Send Invoice
                    </span>
                  </button>
                  <button
                    disabled
                    className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-left opacity-50 cursor-not-allowed"
                  >
                    <ScrollText size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Send Retainer Agreement
                    </span>
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Invoice and Retainer Agreement features will be available
                  soon.
                </p>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onEdit(enquiry)}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              Edit Enquiry
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
