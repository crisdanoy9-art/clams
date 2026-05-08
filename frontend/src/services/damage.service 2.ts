import api from "./api";

export interface DamageReport {
  id: number;
  equipment_id: number;
  equipment_name?: string;
  description: string;
  status: "Pending" | "Under Repair" | "Resolved";
  date_reported: string;
  reported_by_name?: string;
}

export const damageService = {
  async getAll(): Promise<DamageReport[]> {
    const response = await api.get("/damage");
    return response.data.data;
  },

  async getPending(): Promise<DamageReport[]> {
    const response = await api.get("/damage/pending");
    return response.data.data;
  },

  async create(data: {
    equipment_id: number;
    description: string;
  }): Promise<DamageReport> {
    const response = await api.post("/damage", data);
    return response.data.data;
  },

  async updateStatus(id: number, status: string): Promise<DamageReport> {
    const response = await api.patch(`/damage/${id}/status`, { status });
    return response.data.data;
  },
};

