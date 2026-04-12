"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  X,
  FileText,
} from "lucide-react";
import EnquiryTable, { EmptyState, type Enquiry } from "./EnquiryTableNew";
import ViewEnquirySlideOver from "./ViewEnquirySlideOver";
import EditEnquiryModal from "./EditEnquiryModal";
import AddEnquiryModal from "./AddEnquiryModal";

// ─── Filters ────────────────────────────────────────────────────

type TypeFilter = "" | "visa" | "consultation" | "documentation" | "general";
type AppFilter = "" | "linked" | "not-linked";

const typeOptions: { value: TypeFilter; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "visa", label: "Visa Application" },
  { value: "consultation", label: "Consultation" },
  { value: "documentation", label: "Documentation" },
  { value: "general", label: "General Enquiry" },
];

const appOptions: { value: AppFilter; label: string }[] = [
  { value: "", label: "All" },
  { value: "linked", label: "With Application" },
  { value: "not-linked", label: "No Application" },
];

// ─── Constants ──────────────────────────────────────────────────

interface Props {
  enquiries: Enquiry[];
  companyId: string;
}

const ITEMS_PER_PAGE = 5;

// ─── Component ──────────────────────────────────────────────────

export default function EnquiryPageClient({ enquiries, companyId }: Props) {
  const router = useRouter();

  // Modal / Slide‑over state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingEnquiry, setViewingEnquiry] = useState<Enquiry | null>(null);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("");
  const [appFilter, setAppFilter] = useState<AppFilter>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // ── Filtered data ─────────────────────────────────────────────

  const filteredEnquiries = useMemo(() => {
    let result = enquiries;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.clientName.toLowerCase().includes(q) ||
          (e.email && e.email.toLowerCase().includes(q)) ||
          (e.phone && e.phone.toLowerCase().includes(q)),
      );
    }

    // Type filter
    if (typeFilter) {
      result = result.filter((e) => e.enquiryType === typeFilter);
    }

    // Application filter
    if (appFilter === "linked") {
      result = result.filter((e) => e.application?.id);
    } else if (appFilter === "not-linked") {
      result = result.filter((e) => !e.application?.id);
    }

    return result;
  }, [enquiries, searchQuery, typeFilter, appFilter]);

  const isFiltered = !!(searchQuery || typeFilter || appFilter);

  // ── Pagination ────────────────────────────────────────────────

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE),
  );

  // Reset to page 1 when filters shrink past current page
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) setCurrentPage(safePage);

  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagedEnquiries = filteredEnquiries.slice(startIndex, endIndex);

  // ── Handlers ──────────────────────────────────────────────────

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    window.location.reload();
  };

  const handleEditSuccess = () => {
    setEditingEnquiry(null);
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete");
      }
      window.location.reload();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete enquiry",
      );
    }
  };

  const handleCreateApplication = async (enquiryId: string) => {
    try {
      const response = await fetch("/api/applications/from-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enquiryId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create application");
      }
      router.push(`/crm/applications/${data.data.id}`);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to create application",
      );
    }
  };

  const handleViewApplication = (applicationId: string) => {
    router.push(`/crm/applications/${applicationId}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("");
    setAppFilter("");
    setCurrentPage(1);
  };

  // ── Render ────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-8">
        {/* Page header */}
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 shrink-0 mt-0.5">
            <FileText className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Enquiries
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track all client enquiries in one place.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              All Enquiries
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredEnquiries.length})
              </span>
            </h2>

            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={!companyId}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              <Plus size={16} />
              New Enquiry
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
                placeholder="Search by name, email, or phone…"
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

            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as TypeFilter);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Application filter */}
            <select
              value={appFilter}
              onChange={(e) => {
                setAppFilter(e.target.value as AppFilter);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            >
              {appOptions.map((opt) => (
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
            <EnquiryTable
              enquiries={pagedEnquiries}
              onView={(e) => setViewingEnquiry(e)}
              onEdit={(e) => setEditingEnquiry(e)}
              onDelete={handleDelete}
              onCreateApplication={handleCreateApplication}
              onViewApplication={handleViewApplication}
            />
          </div>

          {/* Pagination */}
          {filteredEnquiries.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredEnquiries.length)} of{" "}
                {filteredEnquiries.length} enquiries
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

      <AddEnquiryModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        companyId={companyId}
        onSuccess={handleAddSuccess}
      />

      <ViewEnquirySlideOver
        open={!!viewingEnquiry}
        enquiry={viewingEnquiry}
        onClose={() => setViewingEnquiry(null)}
        onEdit={(e) => {
          setViewingEnquiry(null);
          setEditingEnquiry(e);
        }}
        onCreateApplication={handleCreateApplication}
        onViewApplication={handleViewApplication}
      />

      <EditEnquiryModal
        open={!!editingEnquiry}
        enquiry={editingEnquiry}
        onClose={() => setEditingEnquiry(null)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
