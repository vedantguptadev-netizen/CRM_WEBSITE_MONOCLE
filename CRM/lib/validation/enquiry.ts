import { z } from "zod";

// Fresh date per validation call — avoids stale module-level `today`
const optionalPastDate = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine(
    (value) =>
      value === "" ||
      (typeof value === "string" && !Number.isNaN(Date.parse(value))),
    { message: "Invalid date" },
  )
  .refine(
    (value) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(value) <= today;
    },
    { message: "Date of Birth cannot be in the future" },
  );

const optionalPastDateNullable = z
  .string()
  .optional()
  .or(z.literal(""))
  .nullable()
  .refine(
    (value) =>
      value === null ||
      value === "" ||
      (typeof value === "string" && !Number.isNaN(Date.parse(value))),
    { message: "Invalid date" },
  )
  .refine(
    (value) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(value) <= today;
    },
    { message: "Date of Birth cannot be in the future" },
  );

export const CreateEnquirySchema = z.object({
  clientName: z.string().min(1, "Client name is required").max(200),
  dateOfBirth: optionalPastDate,
  email: z
    .string()
    .email("Invalid email")
    .max(200)
    .optional()
    .or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  enquiryType: z.string().min(1, "Enquiry type is required").max(100),
  notes: z.string().max(2000).optional().or(z.literal("")),
  followUpDate: z.string().optional().or(z.literal("")),
});

export const UpdateEnquirySchema = z.object({
  clientName: z.string().min(1, "Client name is required").max(200).optional(),
  dateOfBirth: optionalPastDateNullable,
  email: z
    .string()
    .email("Invalid email")
    .max(200)
    .optional()
    .or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  enquiryType: z
    .string()
    .min(1, "Enquiry type is required")
    .max(100)
    .optional(),
  notes: z.string().max(2000).optional().or(z.literal("")),
  followUpDate: z.string().optional().or(z.literal("")).nullable(),
});
