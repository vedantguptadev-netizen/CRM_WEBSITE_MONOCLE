import { z } from "zod";

export const CreateApplicationSchema = z.object({
  clientFullName: z.string().min(1, "Client full name is required"),
  applicationType: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  notes: z.string().optional(),
  paymentStatus: z
    .enum(["PENDING", "PAID", "PARTIAL_PAYMENT_DONE"])
    .default("PENDING"),
  currentStatus: z
    .enum(["IN_PROCESS", "SUBMITTED", "PENDING_INFO"])
    .default("IN_PROCESS"),
  dueDate: z
    .string()
    .refine((val) => val === "" || !isNaN(Date.parse(val)), "Invalid date")
    .optional(),
  assignedEmployeeId: z.string().optional(),
  enquiryId: z.string().optional(),
});

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;

export const UpdateApplicationSchema = CreateApplicationSchema.partial();

export type UpdateApplicationInput = z.infer<typeof UpdateApplicationSchema>;

export const CreateApplicationFromEnquirySchema = z.object({
  enquiryId: z.string().min(1, "Enquiry ID is required"),
});

export type CreateApplicationFromEnquiryInput = z.infer<
  typeof CreateApplicationFromEnquirySchema
>;
