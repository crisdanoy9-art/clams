import api from "./api";

export interface Category {
  id: number;
  name: string;
  description: string;
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get("/categories");
    return response.data.data;
  },
};

