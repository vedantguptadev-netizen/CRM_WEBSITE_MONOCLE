export const ENQUIRY_TYPES = [
  { value: "study_permit", label: "Study Permit" },
  { value: "work_permit", label: "Work Permit" },
  { value: "visitor_visa", label: "Visitor Visa" },
  { value: "family_sponsorship", label: "Family Sponsorship" },
  { value: "permanent_residence", label: "Permanent Residence" },
  { value: "express_entry", label: "Express Entry" },
  { value: "pnp", label: "Provincial Nominee Program (PNP)" },
  { value: "business_immigration", label: "Business Immigration" },
  { value: "humanitarian", label: "Humanitarian & Compassionate" },
  { value: "lmia", label: "LMIA" },
  { value: "open_work_permit", label: "Open Work Permit" },
  { value: "pgwp", label: "PGWP" },
  { value: "super_visa", label: "Super Visa" },
  { value: "citizenship", label: "Citizenship" },
  { value: "general", label: "General Immigration Advice" },
  { value: "document_review", label: "Document Review" },
  { value: "other", label: "Other" },
] as const;

export type EnquiryTypeValue = (typeof ENQUIRY_TYPES)[number]["value"];

export const enquiryTypeLabel = (type: string): string => {
  const found = ENQUIRY_TYPES.find((t) => t.value === type);
  if (found) return found.label;
  // Legacy values from before migration
  const legacy: Record<string, string> = {
    visa: "Visa Application",
    consultation: "Consultation",
    documentation: "Documentation",
  };
  return legacy[type] || type;
};

export const enquiryTypeBadgeColor = (type: string): string => {
  const map: Record<string, string> = {
    study_permit: "bg-blue-50 text-blue-700 ring-blue-600/20",
    work_permit: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    visitor_visa: "bg-sky-50 text-sky-700 ring-sky-600/20",
    family_sponsorship: "bg-pink-50 text-pink-700 ring-pink-600/20",
    permanent_residence: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    express_entry: "bg-green-50 text-green-700 ring-green-600/20",
    pnp: "bg-teal-50 text-teal-700 ring-teal-600/20",
    business_immigration: "bg-violet-50 text-violet-700 ring-violet-600/20",
    humanitarian: "bg-rose-50 text-rose-700 ring-rose-600/20",
    lmia: "bg-orange-50 text-orange-700 ring-orange-600/20",
    open_work_permit: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    pgwp: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
    super_visa: "bg-purple-50 text-purple-700 ring-purple-600/20",
    citizenship: "bg-amber-50 text-amber-700 ring-amber-600/20",
    general: "bg-gray-50 text-gray-700 ring-gray-600/20",
    document_review: "bg-slate-50 text-slate-700 ring-slate-600/20",
    other: "bg-gray-50 text-gray-700 ring-gray-600/20",
    // Legacy values (for existing data)
    visa: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    consultation: "bg-amber-50 text-amber-700 ring-amber-600/20",
    documentation: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
  };
  return map[type] || "bg-gray-50 text-gray-700 ring-gray-600/20";
};
