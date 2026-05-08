import api from "./api";

export interface Peripheral {
  lab_id: number;
  lab_name: string;
  type: string;
  total_count: number;
  working_count: number;
  damaged_count: number;
  working_percentage: number;
}

export const peripheralService = {
  async getAll(): Promise<Peripheral[]> {
    const response = await api.get("/peripherals");
    return response.data.data;
  },
};

