// lib/validations/damageSchema.ts
import { z } from "zod";

export const DamageReportSchema = z.object({
  instructor_id: z.string().min(1, "Instructor is required"),
  lab_id: z.string().min(1, "Laboratory is required"),
  equipment_id: z.string().min(1, "Equipment is required"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(100, "Subject too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long"),
  status: z.enum(["pending", "in_progress", "resolved"]).default("pending"),
  admin_remarks: z.string().optional(),
});

export type DamageReport = z.infer<typeof DamageReportSchema>;

export const DamageReportApi: Record<
  keyof DamageReport,
  "text" | "select" | "textarea"
> = {
  instructor_id: "select",
  lab_id: "select",
  equipment_id: "select",
  subject: "text",
  description: "textarea",
  status: "select",
  admin_remarks: "textarea",
};
