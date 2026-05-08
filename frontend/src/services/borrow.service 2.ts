import api from "./api";

export interface BorrowTransaction {
  id: number;
  equipment_id: number;
  equipment_name?: string;
  borrower_name: string;
  quantity_borrowed: number;
  borrow_date: string;
  expected_return_date: string;
  actual_return_date?: string;
  status: "Borrowed" | "Returned";
}

export const borrowService = {
  async getAll(): Promise<BorrowTransaction[]> {
    const response = await api.get("/borrow");
    return response.data.data;
  },

  async getActive(): Promise<BorrowTransaction[]> {
    const response = await api.get("/borrow/active");
    return response.data.data;
  },

  async create(data: any): Promise<BorrowTransaction> {
    const response = await api.post("/borrow", data);
    return response.data.data;
  },

  async returnItem(
    id: number,
    actualReturnDate: string,
  ): Promise<BorrowTransaction> {
    const response = await api.put(`/borrow/${id}/return`, {
      actual_return_date: actualReturnDate,
    });
    return response.data.data;
  },
};

