import {
  getFullInventory,
  getTransactionHistory,
  getDamageReports,
} from "../model/joinData.js";

export const getAllInventory = async (req, res) => {
  try {
    const data = await getFullInventory();
    return res.status(200).json(data || "inventory currently empty.");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllTransactionHistory = async (req, res) => {
  try {
    const data = await getTransactionHistory();
    return res.status(200).json(data || "transaction currently empty.");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const data = await getDamageReports();
    return res.status(200).json(data || "report currently empty.");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
