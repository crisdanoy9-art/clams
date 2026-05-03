import axios from "axios";

const BASE_URL = "http://localhost:3000/api";
const getToken = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

export const fetchData = async (table: string) => {
  const res = await axios.get(`${BASE_URL}/${table}`, { headers: headers() });
  return res.data.data;
};

export const deleteData = async (table: string, id: string | number) => {
  const res = await axios.delete(`${BASE_URL}/${table}/${id}`, {
    headers: headers(),
  });
  return res.data;
};

export const updateData = async (
  table: string,
  id: string | number,
  data: Record<string, any>,
) => {
  const res = await axios.put(`${BASE_URL}/${table}/${id}`, data, {
    headers: headers(),
  });
  return res.data;
};
