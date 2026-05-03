import { z } from "zod";

export const LaboratorySchema = z.object({
  lab_name: z.string().min(1, "Lab name is required"),
  room_number: z.string().min(1, "Room number is required"),
  building: z.string().min(1, "Building is required"),
  total_stations: z.coerce
    .number()
    .min(1, "Must have at least 1 station")
    .max(999),
});

export type Laboratory = z.infer<typeof LaboratorySchema>;

export const LaboratoryFields = [
  {
    name: "lab_name",
    label: "Lab Name",
    type: "text" as const,
    placeholder: "e.g., Lab 4",
  },
  {
    name: "room_number",
    label: "Room Number",
    type: "text" as const,
    placeholder: "e.g., CCS - Room 104",
  },
  {
    name: "building",
    label: "Building",
    type: "text" as const,
    placeholder: "e.g., CCS Building",
  },
  {
    name: "total_stations",
    label: "Total PC",
    type: "number" as const,
    min: 1,
    max: 999,
  },
];
