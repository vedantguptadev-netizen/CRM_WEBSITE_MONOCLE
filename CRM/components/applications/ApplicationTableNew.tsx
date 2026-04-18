"use client";

import { useState, useEffect, useRef } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  FileText,
  ExternalLink,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────

export interface Application {
  id: string;
  clientFullName: string;
  applicationType?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  paymentStatus: string;
  currentStatus: string;
  dueDate?: Date | string | null;
  assignedEmployeeId?: string | null;
  driveFolderLink?: string | null;
  companyId: string;
  enquiryId?: string | null;
  enquiry?: { id: string; clientName: string; enquiryType: string; dateOfBirth?: Date | string | null } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ApplicationTableProps {
  applications: Application[];
  isLoading?: boolean;
  onView: (application: Application) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

// ─── Helpers ────────────────────────────────────────────────────

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
    PARTIAL_PAYMENT_DONE: "Partial",
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

/** Returns urgency class for due dates */
const dueDateClass = (date: Date | string | null | undefined): string => {
  if (!date) return "text-gray-600";
  try {
    const d = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = target.getTime() - today.getTime();
    if (diff < 0) return "text-red-600 font-medium"; // overdue
    if (diff === 0) return "text-amber-600 font-medium"; // today
    return "text-gray-600";
  } catch {
    return "text-gray-600";
  }
};

const dueDateLabel = (date: Date | string | null | undefined): string => {
  if (!date) return "—";
  try {
    const d = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = target.getTime() - today.getTime();
    const formatted = formatDate(date);
    if (diff < 0) return `${formatted} (Overdue)`;
    if (diff === 0) return `${formatted} (Today)`;
    return formatted;
  } catch {
    return "—";
  }
};

// ─── Action Menu ────────────────────────────────────────────────

function ActionMenu({
  application,
  onView,
  onEdit,
  onDelete,
}: {
  application: Application;
  onView: (application: Application) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 4,
        left: rect.right - 192,
      });
    }
    setIsOpen((o) => !o);
  };

  const act = (fn: () => void) => {
    fn();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        aria-label="Row actions"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-[9999] w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          <button
            onClick={() => act(() => onView(application))}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Eye size={15} className="text-gray-400" />
            View Details
          </button>
          <button
            onClick={() => act(() => onEdit(application))}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Pencil size={15} className="text-gray-400" />
            Edit Application
          </button>

          <div className="my-1 border-t border-gray-100" />

          {application.enquiry && (
            <>
              <button
                onClick={() => act(() => {})}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-purple-700 hover:bg-purple-50"
              >
                <ExternalLink size={15} />
                View Enquiry
              </button>
              <div className="my-1 border-t border-gray-100" />
            </>
          )}

          <button
            onClick={() => act(() => onDelete(application.id))}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Loading Skeleton ───────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: 8 }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-t border-gray-100">
              {Array.from({ length: 8 }).map((_, colIdx) => (
                <td key={colIdx} className="px-4 py-3.5">
                  <div
                    className="h-4 animate-pulse rounded bg-gray-100"
                    style={{ width: `${50 + Math.random() * 40}%` }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────

function EmptyState({
  isFiltered,
  onClearFilters,
}: {
  isFiltered: boolean;
  onClearFilters?: () => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 px-6 py-16 text-center">
      <FileText className="mx-auto h-10 w-10 text-gray-400" />
      <h3 className="mt-3 text-sm font-semibold text-gray-900">
        {isFiltered ? "No matching applications" : "No applications yet"}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {isFiltered
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Get started by creating a new application."}
      </p>
      {isFiltered && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-4 inline-flex items-center rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

// ─── Main Table ─────────────────────────────────────────────────

export default function ApplicationTable({
  applications,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: ApplicationTableProps) {
  if (isLoading) return <TableSkeleton />;

  if (applications.length === 0) {
    return <EmptyState isFiltered={false} />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[1000px] text-left">
        <thead className="bg-gray-50/80">
          <tr className="border-b border-gray-200">
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Client Name
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Type
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Payment
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Due Date
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Enquiry
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Created
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {applications.map((app) => (
            <tr
              key={app.id}
              className="group cursor-pointer transition-colors hover:bg-gray-50/70"
              onClick={() => onView(app)}
            >
              {/* Client Name */}
              <td className="whitespace-nowrap px-4 py-3.5">
                <span className="text-sm font-medium text-gray-900">
                  {app.clientFullName}
                </span>
              </td>

              {/* Application Type */}
              <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">
                {app.applicationType
                  ? app.applicationType.charAt(0).toUpperCase() +
                    app.applicationType.slice(1)
                  : "—"}
              </td>

              {/* Payment Status Badge */}
              <td className="whitespace-nowrap px-4 py-3.5">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${paymentStatusBadge(app.paymentStatus)}`}
                >
                  {paymentStatusLabel(app.paymentStatus)}
                </span>
              </td>

              {/* Current Status Badge */}
              <td className="whitespace-nowrap px-4 py-3.5">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${currentStatusBadge(app.currentStatus)}`}
                >
                  {currentStatusLabel(app.currentStatus)}
                </span>
              </td>

              {/* Due Date */}
              <td
                className={`whitespace-nowrap px-4 py-3.5 text-sm ${dueDateClass(app.dueDate)}`}
              >
                {dueDateLabel(app.dueDate)}
              </td>

              {/* Enquiry Linked */}
              <td className="whitespace-nowrap px-4 py-3.5">
                {app.enquiry ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Linked Enquiry
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500 ring-1 ring-inset ring-gray-500/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    Manual
                  </span>
                )}
              </td>

              {/* Created At */}
              <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">
                {formatDate(app.createdAt)}
              </td>

              {/* Actions */}
              <td
                className="whitespace-nowrap px-4 py-3.5 text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <ActionMenu
                  application={app}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { EmptyState, TableSkeleton };
