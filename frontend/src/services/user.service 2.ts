import api from "./api";

export interface User {
  id: number;
  username: string;
  full_name: string;
  role: "admin" | "instructor";
  lab_id?: number;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get("/users");
    return response.data.data;
  },

  async create(data: any): Promise<User> {
    const response = await api.post("/users", data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};

