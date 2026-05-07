// lib/validations/damageSchema.ts
import { z } from "zod";

export const DamageReportSchema = z.object({
  instructor_id: z.string().min(1, "Instructor is required"),
  lab_id: z.string().min(1, "Laboratory is required"),
  equipment_id: z.string().min(1, "Equipment is required"),
  subject: z.string().min(1, "Subject is required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["pending", "in_progress", "resolved"]).default("pending"),
  admin_remarks: z.string().optional(),
});

export type DamageReport = z.infer<typeof DamageReportSchema>;

// FIX: Changed from Record to Array so .map() works
export const ReportFields = [
  {
    name: "equipment_id",
    label: "Equipment",
    type: "select" as const,
    placeholder: "Select damaged equipment",
    fullWidth: true,
  },
  {
    name: "subject",
    label: "Subject",
    type: "text" as const,
    placeholder: "e.g., Broken Monitor Screen",
    fullWidth: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea" as const,
    placeholder: "Describe how it happened...",
    fullWidth: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "unavailable", label: "unavailable" },
      { value: "under maintenance", label: "under maintenance" },
    ],
  },
  {
    name: "admin_remarks",
    label: "Admin Remarks",
    type: "textarea" as const,
    placeholder: "Notes from the technician...",
  },
];
