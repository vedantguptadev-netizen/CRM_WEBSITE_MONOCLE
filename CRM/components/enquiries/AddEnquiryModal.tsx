"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddEnquiryModalProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess?: () => void;
}

interface FormData {
  clientName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  enquiryType: string;
  notes: string;
  followUpDate: string;
}

const emptyForm: FormData = {
  clientName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  enquiryType: "",
  notes: "",
  followUpDate: "",
};

const getTodayDate = () => new Date().toISOString().slice(0, 10);

export default function AddEnquiryModal({
  open,
  onClose,
  companyId,
  onSuccess,
}: AddEnquiryModalProps) {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.clientName.trim())
      newErrors.clientName = "Client name is required";
    if (!formData.enquiryType.trim())
      newErrors.enquiryType = "Enquiry type is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (
      formData.dateOfBirth &&
      new Date(formData.dateOfBirth) > new Date(getTodayDate())
    ) {
      newErrors.dateOfBirth = "Date of Birth cannot be in the future";
    }
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
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.clientName,
          dateOfBirth: formData.dateOfBirth || undefined,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          enquiryType: formData.enquiryType,
          notes: formData.notes || undefined,
          followUpDate: formData.followUpDate || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.message || "Failed to create enquiry");
        return;
      }

      // Reset and close
      setFormData(emptyForm);
      setErrors({});
      setApiError(null);
      onSuccess?.();
      onClose();
    } catch {
      setApiError("Failed to create enquiry. Please try again.");
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
                New Enquiry
              </h2>
              <p className="text-sm text-gray-500">
                Enter the client enquiry details below
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

              {/* Client Name */}
              <div>
                <label
                  htmlFor="clientName"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="clientName"
                  name="clientName"
                  type="text"
                  maxLength={200}
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                    errors.clientName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                <div className="mt-1 flex justify-between">
                  {errors.clientName ? (
                    <p className="text-xs text-red-600">{errors.clientName}</p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${formData.clientName.length >= 180 ? "text-red-500 font-medium" : "text-gray-400"}`}
                  >
                    {formData.clientName.length}/200
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

              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  max={getTodayDate()}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                    errors.dateOfBirth
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.dateOfBirth ? (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.dateOfBirth}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-400">
                    Optional. Helps distinguish clients with the same name.
                  </p>
                )}
              </div>

              {/* Enquiry Type */}
              <div>
                <label
                  htmlFor="enquiryType"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Enquiry Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="enquiryType"
                  name="enquiryType"
                  value={formData.enquiryType}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                    errors.enquiryType
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select type</option>
                  <option value="visa">Visa Application</option>
                  <option value="consultation">Consultation</option>
                  <option value="documentation">Documentation</option>
                  <option value="general">General Enquiry</option>
                </select>
                {errors.enquiryType && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.enquiryType}
                  </p>
                )}
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

              {/* Follow-Up Date */}
              <div>
                <label
                  htmlFor="followUpDate"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Follow-Up Date
                </label>
                <input
                  id="followUpDate"
                  name="followUpDate"
                  type="date"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
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
                "Create Enquiry"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
