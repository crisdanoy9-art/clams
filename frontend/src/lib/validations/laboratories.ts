// lib/validations/laboratorySchema.ts
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

export const LaboratoryApi: Record<keyof Laboratory, "text" | "number"> = {
  lab_name: "text",
  room_number: "text",
  building: "text",
  total_stations: "number",
};
