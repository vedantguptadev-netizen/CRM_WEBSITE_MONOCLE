"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Application } from "./ApplicationTableNew";

interface EditApplicationModalProps {
  open: boolean;
  application: Application | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  clientFullName: string;
  applicationType: string;
  email: string;
  phone: string;
  paymentStatus: string;
  currentStatus: string;
  dueDate: string;
  assignedEmployeeId: string;
  driveFolderLink: string;
  notes: string;
}

const emptyForm: FormData = {
  clientFullName: "",
  applicationType: "",
  email: "",
  phone: "",
  paymentStatus: "PENDING",
  currentStatus: "IN_PROCESS",
  dueDate: "",
  assignedEmployeeId: "",
  driveFolderLink: "",
  notes: "",
};

const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  try {
    const d = new Date(date);
    return d.toLocaleDateString("en-CA", { timeZone: "America/Denver" });
  } catch {
    return "";
  }
};

export default function EditApplicationModal({
  open,
  application,
  onClose,
  onSuccess,
}: EditApplicationModalProps) {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (application && open) {
      setFormData({
        clientFullName: application.clientFullName,
        applicationType: application.applicationType || "",
        email: application.email || "",
        phone: application.phone || "",
        paymentStatus: application.paymentStatus,
        currentStatus: application.currentStatus,
        dueDate: formatDateForInput(application.dueDate),
        assignedEmployeeId: application.assignedEmployeeId || "",
        driveFolderLink: application.driveFolderLink || "",
        notes: application.notes || "",
      });
      setErrors({});
      setApiError(null);
    }
  }, [application, open]);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.clientFullName.trim())
      newErrors.clientFullName = "Client name is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (
      formData.driveFolderLink &&
      !/^https?:\/\/.+/i.test(formData.driveFolderLink)
    )
      newErrors.driveFolderLink = "Please enter a valid URL";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validate() || !application) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientFullName: formData.clientFullName,
          applicationType: formData.applicationType || undefined,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          paymentStatus: formData.paymentStatus,
          currentStatus: formData.currentStatus,
          dueDate: formData.dueDate || undefined,
          assignedEmployeeId: formData.assignedEmployeeId || undefined,
          driveFolderLink: formData.driveFolderLink || undefined,
          notes: formData.notes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.message || "Failed to update application");
        return;
      }

      onSuccess();
    } catch {
      setApiError("Failed to update application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setErrors({});
    setApiError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={handleCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Application
              </h2>
              <p className="text-sm text-gray-500">
                Update the application details below
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
            <div className="space-y-4">
              {apiError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              )}

              {/* Linked Enquiry (read-only) */}
              {application?.enquiry && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-sm text-emerald-700">
                    <span className="font-medium">Linked Enquiry:</span>{" "}
                    {application.enquiry.clientName} (
                    {application.enquiry.enquiryType})
                  </p>
                </div>
              )}

              {/* Client Full Name */}
              <div>
                <label
                  htmlFor="edit-clientFullName"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Client Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-clientFullName"
                  name="clientFullName"
                  maxLength={200}
                  value={formData.clientFullName}
                  onChange={handleChange}
                  placeholder="Enter client full name"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                    errors.clientFullName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                <div className="mt-1 flex justify-between">
                  {errors.clientFullName ? (
                    <p className="text-xs text-red-600">
                      {errors.clientFullName}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${formData.clientFullName.length >= 180 ? "text-red-500 font-medium" : "text-gray-400"}`}
                  >
                    {formData.clientFullName.length}/200
                  </p>
                </div>
              </div>

              {/* Email + Phone row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="client@example.com"
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="edit-phone"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Phone
                  </label>
                  <input
                    id="edit-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Application Type */}
              <div>
                <label
                  htmlFor="edit-applicationType"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Application Type
                </label>
                <input
                  id="edit-applicationType"
                  name="applicationType"
                  value={formData.applicationType}
                  onChange={handleChange}
                  placeholder="e.g., Work Visa, Student Visa"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              {/* Payment + Status row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-paymentStatus"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Payment Status
                  </label>
                  <select
                    id="edit-paymentStatus"
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="PARTIAL_PAYMENT_DONE">
                      Partial Payment
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="edit-currentStatus"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Current Status
                  </label>
                  <select
                    id="edit-currentStatus"
                    name="currentStatus"
                    value={formData.currentStatus}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  >
                    <option value="IN_PROCESS">In Process</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="PENDING_INFO">Pending Info</option>
                  </select>
                </div>
              </div>

              {/* Due Date + Assigned Employee row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-dueDate"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Due Date
                  </label>
                  <input
                    id="edit-dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-assignedEmployeeId"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Assigned Employee ID
                  </label>
                  <input
                    id="edit-assignedEmployeeId"
                    name="assignedEmployeeId"
                    value={formData.assignedEmployeeId}
                    onChange={handleChange}
                    placeholder="Employee ID"
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Drive Folder Link */}
              <div>
                <label
                  htmlFor="edit-driveFolderLink"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Drive Folder Link
                </label>
                <input
                  id="edit-driveFolderLink"
                  name="driveFolderLink"
                  type="url"
                  value={formData.driveFolderLink}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                    errors.driveFolderLink
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.driveFolderLink ? (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.driveFolderLink}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-400">
                    Optional. Paste the shared Google Drive folder or file link
                    for internal team access.
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="edit-notes"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Notes
                </label>
                <textarea
                  id="edit-notes"
                  name="notes"
                  maxLength={2000}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional notes…"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                />
                <p
                  className={`mt-1 text-xs text-right ${formData.notes.length >= 1800 ? "text-red-500 font-medium" : "text-gray-400"}`}
                >
                  {formData.notes.length}/2000
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
