import api from "./api";

export interface ActivityLog {
  id: number;
  user_name: string;
  user_role: string;
  action: string;
  target_table: string;
  target_id: number;
  performed_at: string;
}

export const logService = {
  async getAll(): Promise<ActivityLog[]> {
    const response = await api.get("/logs");
    return response.data.data;
  },
};

