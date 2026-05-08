import api from "./api";

export interface Equipment {
  id: number;
  lab_id: number;
  category_id: number;
  name: string;
  serial_number: string;
  status: "Available" | "Borrowed" | "Damaged" | "Under Repair";
  quantity: number;
  quantity_available: number;
  lab_name?: string;
  category_name?: string;
  created_at: string;
}

export const equipmentService = {
  async getAll(): Promise<Equipment[]> {
    const response = await api.get("/equipment");
    return response.data.data;
  },

  async create(data: any): Promise<Equipment> {
    const response = await api.post("/equipment", data);
    return response.data.data;
  },

  async update(id: number, data: any): Promise<Equipment> {
    const response = await api.put(`/equipment/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/equipment/${id}`);
  },

  async updateStatus(id: number, status: string): Promise<Equipment> {
    const response = await api.patch(`/equipment/${id}/status`, { status });
    return response.data.data;
  },
};

