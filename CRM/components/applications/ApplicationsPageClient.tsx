"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  X,
  Briefcase,
} from "lucide-react";
import ApplicationTable, {
  EmptyState,
  type Application,
} from "./ApplicationTableNew";
import EditApplicationModal from "./EditApplicationModal";
import AddApplicationModal from "./AddApplicationModal";

// ─── Filters ────────────────────────────────────────────────────

type PaymentFilter = "" | "PENDING" | "PAID" | "PARTIAL_PAYMENT_DONE";
type StatusFilter = "" | "IN_PROCESS" | "SUBMITTED" | "PENDING_INFO";
type EnquiryFilter = "" | "linked" | "manual";
type DueDateFilter = "" | "overdue" | "today" | "upcoming" | "none";

const paymentOptions: { value: PaymentFilter; label: string }[] = [
  { value: "", label: "All Payments" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "PARTIAL_PAYMENT_DONE", label: "Partial" },
];

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "IN_PROCESS", label: "In Process" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "PENDING_INFO", label: "Pending Info" },
];

const enquiryOptions: { value: EnquiryFilter; label: string }[] = [
  { value: "", label: "All" },
  { value: "linked", label: "With Enquiry" },
  { value: "manual", label: "Manual" },
];

const dueDateOptions: { value: DueDateFilter; label: string }[] = [
  { value: "", label: "All Due Dates" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "none", label: "No Due Date" },
];

// ─── Constants ──────────────────────────────────────────────────

interface Props {
  applications: Application[];
  companyId: string;
}

const ITEMS_PER_PAGE = 5;

// ─── Component ──────────────────────────────────────────────────

export default function ApplicationsPageClient({
  applications,
  companyId,
}: Props) {
  const router = useRouter();

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [enquiryFilter, setEnquiryFilter] = useState<EnquiryFilter>("");
  const [dueDateFilter, setDueDateFilter] = useState<DueDateFilter>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // ── Filtered data ─────────────────────────────────────────────

  const filteredApplications = useMemo(() => {
    let result = applications;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.clientFullName.toLowerCase().includes(q) ||
          (a.email && a.email.toLowerCase().includes(q)) ||
          (a.phone && a.phone.toLowerCase().includes(q)) ||
          (a.applicationType && a.applicationType.toLowerCase().includes(q)),
      );
    }

    // Payment filter
    if (paymentFilter) {
      result = result.filter((a) => a.paymentStatus === paymentFilter);
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((a) => a.currentStatus === statusFilter);
    }

    // Enquiry filter
    if (enquiryFilter === "linked") {
      result = result.filter((a) => a.enquiry?.id);
    } else if (enquiryFilter === "manual") {
      result = result.filter((a) => !a.enquiry?.id);
    }

    // Due date filter
    if (dueDateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      result = result.filter((a) => {
        if (dueDateFilter === "none") return !a.dueDate;
        if (!a.dueDate) return false;
        const d = new Date(a.dueDate);
        const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const diff = target.getTime() - today.getTime();
        if (dueDateFilter === "overdue") return diff < 0;
        if (dueDateFilter === "today") return diff === 0;
        if (dueDateFilter === "upcoming") return diff > 0;
        return true;
      });
    }

    return result;
  }, [
    applications,
    searchQuery,
    paymentFilter,
    statusFilter,
    enquiryFilter,
    dueDateFilter,
  ]);

  const isFiltered = !!(
    searchQuery ||
    paymentFilter ||
    statusFilter ||
    enquiryFilter ||
    dueDateFilter
  );

  // ── Pagination ────────────────────────────────────────────────

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / ITEMS_PER_PAGE),
  );

  // Reset to page 1 when filters shrink past current page
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) setCurrentPage(safePage);

  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagedApplications = filteredApplications.slice(startIndex, endIndex);

  // ── Handlers ──────────────────────────────────────────────────

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    window.location.reload();
  };

  const handleEditSuccess = () => {
    setEditingApplication(null);
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete");
      }
      window.location.reload();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete application",
      );
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPaymentFilter("");
    setStatusFilter("");
    setEnquiryFilter("");
    setDueDateFilter("");
    setCurrentPage(1);
  };

  // ── Render ────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-8">
        {/* Page header */}
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 shrink-0 mt-0.5">
            <Briefcase className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Applications
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track all client applications in one place.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              All Applications
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredApplications.length})
              </span>
            </h2>

            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={!companyId}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              <Plus size={16} />
              New Application
            </button>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by client name or application type…"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-9 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilter);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Payment filter */}
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value as PaymentFilter);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            >
              {paymentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Enquiry filter */}
            <select
              value={enquiryFilter}
              onChange={(e) => {
                setEnquiryFilter(e.target.value as EnquiryFilter);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            >
              {enquiryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Due date filter */}
            <select
              value={dueDateFilter}
              onChange={(e) => {
                setDueDateFilter(e.target.value as DueDateFilter);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            >
              {dueDateOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {isFiltered && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>

          {/* Table */}
          <div className="px-6 py-4">
            {filteredApplications.length === 0 && isFiltered ? (
              <EmptyState isFiltered onClearFilters={clearFilters} />
            ) : (
              <ApplicationTable
                applications={pagedApplications}
                onView={(a) => router.push(`/crm/applications/${a.id}`)}
                onEdit={(a) => setEditingApplication(a)}
                onDelete={handleDelete}
              />
            )}
          </div>

          {/* Pagination */}
          {filteredApplications.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredApplications.length)} of{" "}
                {filteredApplications.length} applications
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={safePage === 1}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          safePage === page
                            ? "bg-red-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={safePage === totalPages}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals + Slide‑overs ──────────────────────────────── */}

      <AddApplicationModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        companyId={companyId}
        onSuccess={handleAddSuccess}
      />

      <EditApplicationModal
        open={!!editingApplication}
        application={editingApplication}
        onClose={() => setEditingApplication(null)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
