"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddApplicationModalProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess?: () => void;
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
  notes: "",
};

export default function AddApplicationModal({
  open,
  onClose,
  companyId,
  onSuccess,
}: AddApplicationModalProps) {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.clientFullName.trim())
      newErrors.clientFullName = "Client name is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
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

  const handleSave = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
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
          notes: formData.notes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.message || "Failed to create application");
        return;
      }

      // Reset and close
      setFormData(emptyForm);
      setErrors({});
      setApiError(null);
      onSuccess?.();
      onClose();
    } catch {
      setApiError("Failed to create application. Please try again.");
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
                New Application
              </h2>
              <p className="text-sm text-gray-500">
                Enter the application details below
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

              {/* Client Full Name */}
              <div>
                <label
                  htmlFor="clientFullName"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Client Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="clientFullName"
                  name="clientFullName"
                  type="text"
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
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
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
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
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
                  htmlFor="applicationType"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Application Type
                </label>
                <input
                  id="applicationType"
                  name="applicationType"
                  type="text"
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
                    htmlFor="paymentStatus"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Payment Status
                  </label>
                  <select
                    id="paymentStatus"
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
                    htmlFor="currentStatus"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Current Status
                  </label>
                  <select
                    id="currentStatus"
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
                    htmlFor="dueDate"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="assignedEmployeeId"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Assigned Employee ID
                  </label>
                  <input
                    id="assignedEmployeeId"
                    name="assignedEmployeeId"
                    type="text"
                    value={formData.assignedEmployeeId}
                    onChange={handleChange}
                    placeholder="Employee ID"
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
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
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving…
                </>
              ) : (
                "Create Application"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
