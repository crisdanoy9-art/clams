// In your api/Methods.ts file

import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchData = async (table: string) => {
  const res = await axios.get(`${BASE_URL}/${table}`, {
    headers: getHeaders(),
  });
  return res.data.data;
};

export const addData = async (table: string, data: Record<string, any>) => {
  debugger; // PAUSES HERE – check `data` in console

  const hasFile = Object.values(data).some((val) => val instanceof File);

  let payload: any;
  let headers: Record<string, string> = {
    ...getHeaders(),
  };

  if (hasFile) {
    const fd = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        fd.append(key, val);
      }
    });
    payload = fd;
  } else {
    payload = data;
    headers["Content-Type"] = "application/json";
  }

  console.log("📤 addData called with:", { table, payload, headers });

  try {
    const res = await axios.post(`${BASE_URL}/${table}`, payload, { headers });
    console.log("✅ addData success:", res.data);
    return res.data;
  } catch (error: any) {
    debugger; // PAUSES HERE – inspect `error`
    console.error("❌ addData failed:");
    console.error("  URL:", `${BASE_URL}/${table}`);
    console.error("  Payload:", payload);
    console.error("  Status:", error.response?.status);
    console.error("  Server response:", error.response?.data);
    console.error("  Headers sent:", headers);
    throw error;
  }
};

export const updateData = async (
  table: string,
  id: string | number,
  data: Record<string, any>,
) => {
  const hasFile = Object.values(data).some((val) => val instanceof File);

  let payload: any;
  let headers: Record<string, string> = {
    ...getHeaders(),
  };

  if (hasFile) {
    const fd = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        fd.append(key, val);
      }
    });
    payload = fd;
  } else {
    payload = data;
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await axios.put(`${BASE_URL}/${table}/${id}`, payload, {
      headers,
    });
    return res.data;
  } catch (error: any) {
    debugger;
    console.error(
      `❌ updateData failed for ${table}/${id}:`,
      error.response?.data,
    );
    throw error;
  }
};

export const deleteData = async (table: string, id: string | number) => {
  try {
    const res = await axios.delete(`${BASE_URL}/${table}/${id}`, {
      headers: getHeaders(),
    });
    return res.data;
  } catch (error: any) {
    debugger;
    console.error(
      `❌ deleteData failed for ${table}/${id}:`,
      error.response?.data,
    );
    throw error;
  }
};
