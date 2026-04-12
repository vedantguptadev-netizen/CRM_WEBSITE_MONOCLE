"use client";

import { useState, useEffect, useRef } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  FileText,
  FilePlus,
  ExternalLink,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────

export interface Enquiry {
  id: string;
  clientName: string;
  email?: string | null;
  phone?: string | null;
  enquiryType: string;
  notes?: string | null;
  followUpDate?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  companyId: string;
  application?: { id: string } | null;
}

interface EnquiryTableProps {
  enquiries: Enquiry[];
  isLoading?: boolean;
  onView: (enquiry: Enquiry) => void;
  onEdit: (enquiry: Enquiry) => void;
  onDelete: (id: string) => void;
  onCreateApplication: (enquiryId: string) => void;
  onViewApplication: (applicationId: string) => void;
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

const enquiryTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    visa: "Visa Application",
    consultation: "Consultation",
    documentation: "Documentation",
    general: "General Enquiry",
  };
  return map[type] || type;
};

const enquiryTypeBadgeColor = (type: string): string => {
  const map: Record<string, string> = {
    visa: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    consultation: "bg-amber-50 text-amber-700 ring-amber-600/20",
    documentation: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
    general: "bg-gray-50 text-gray-700 ring-gray-600/20",
  };
  return map[type] || "bg-gray-50 text-gray-700 ring-gray-600/20";
};

// ─── Action Menu ────────────────────────────────────────────────

function ActionMenu({
  enquiry,
  onView,
  onEdit,
  onDelete,
  onCreateApplication,
  onViewApplication,
}: {
  enquiry: Enquiry;
  onView: (enquiry: Enquiry) => void;
  onEdit: (enquiry: Enquiry) => void;
  onDelete: (id: string) => void;
  onCreateApplication: (enquiryId: string) => void;
  onViewApplication: (applicationId: string) => void;
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
        left: rect.right - 192, // w-48 = 12rem = 192px
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
            onClick={() => act(() => onView(enquiry))}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Eye size={15} className="text-gray-400" />
            View Details
          </button>
          <button
            onClick={() => act(() => onEdit(enquiry))}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Pencil size={15} className="text-gray-400" />
            Edit Enquiry
          </button>

          <div className="my-1 border-t border-gray-100" />

          {enquiry.application ? (
            <button
              onClick={() =>
                act(() => onViewApplication(enquiry.application!.id))
              }
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-purple-700 hover:bg-purple-50"
            >
              <ExternalLink size={15} />
              View Application
            </button>
          ) : (
            <button
              onClick={() => act(() => onCreateApplication(enquiry.id))}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
            >
              <FilePlus size={15} />
              Create Application
            </button>
          )}

          <div className="my-1 border-t border-gray-100" />

          <button
            onClick={() => act(() => onDelete(enquiry.id))}
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
            {Array.from({ length: 7 }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-t border-gray-100">
              {Array.from({ length: 7 }).map((_, colIdx) => (
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
        {isFiltered ? "No matching enquiries" : "No enquiries yet"}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {isFiltered
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Get started by creating a new enquiry."}
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

export default function EnquiryTable({
  enquiries,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onCreateApplication,
  onViewApplication,
}: EnquiryTableProps) {
  if (isLoading) return <TableSkeleton />;

  if (enquiries.length === 0) {
    return <EmptyState isFiltered={false} />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[900px] text-left">
        <thead className="bg-gray-50/80">
          <tr className="border-b border-gray-200">
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Client Name
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Email
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Phone
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Type
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Application
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Follow-Up
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
          {enquiries.map((enquiry) => (
            <tr
              key={enquiry.id}
              className="group cursor-pointer transition-colors hover:bg-gray-50/70"
              onClick={() => onView(enquiry)}
            >
              {/* Client Name */}
              <td className="whitespace-nowrap px-4 py-3.5">
                <span className="text-sm font-medium text-gray-900">
                  {enquiry.clientName}
                </span>
              </td>

              {/* Email */}
              <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">
                {enquiry.email || "—"}
              </td>

              {/* Phone */}
              <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">
                {enquiry.phone || "—"}
              </td>

              {/* Type Badge */}
              <td className="whitespace-nowrap px-4 py-3.5">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${enquiryTypeBadgeColor(enquiry.enquiryType)}`}
                >
                  {enquiryTypeLabel(enquiry.enquiryType)}
                </span>
              </td>

              {/* Application Linked Badge */}
              <td className="whitespace-nowrap px-4 py-3.5">
                {enquiry.application ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Linked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500 ring-1 ring-inset ring-gray-500/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    Not linked
                  </span>
                )}
              </td>

              {/* Follow-Up Date */}
              <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">
                {formatDate(enquiry.followUpDate)}
              </td>

              {/* Created At */}
              <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">
                {formatDate(enquiry.createdAt)}
              </td>

              {/* Actions */}
              <td
                className="whitespace-nowrap px-4 py-3.5 text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <ActionMenu
                  enquiry={enquiry}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCreateApplication={onCreateApplication}
                  onViewApplication={onViewApplication}
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
