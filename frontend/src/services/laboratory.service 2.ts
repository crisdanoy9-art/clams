import api from "./api";

export interface Laboratory {
  id: number;
  name: string;
  location: string;
  total_pcs: number;
}

export interface LaboratorySummary {
  lab_id: number;
  lab_name: string;
  location: string;
  total_pcs: number;
  total_equipment: number;
  available_equipment: number;
  borrowed_equipment: number;
  damaged_equipment: number;
  under_repair: number;
}

export const laboratoryService = {
  async getAll(): Promise<Laboratory[]> {
    const response = await api.get("/laboratories");
    return response.data.data;
  },

  async getSummary(): Promise<LaboratorySummary[]> {
    const response = await api.get("/laboratories/summary");
    return response.data.data;
  },
};

