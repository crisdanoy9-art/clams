// backend/model/joinData.js
import pool from "../db.js";

// 1. Fetch Equipment with Lab and Category details
export const getFullInventory = async () => {
  const query = `
    SELECT 
        e.equipment_id,
        e.asset_tag,
        e.item_name,
        e.brand,
        e.model,
        e.status,
        e.specs,
        e.purchase_date,
        e.lab_id,
        c.category_name,
        l.lab_name,
        l.room_number,
        l.building
    FROM clams.equipment e
    LEFT JOIN clams.categories c ON e.category_id = c.category_id
    LEFT JOIN clams.laboratories l ON e.lab_id = l.lab_id
    WHERE e.is_deleted = false
    ORDER BY e.created_at DESC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

// 2. Fetch Transactions - MAKE SURE instructor_id IS INCLUDED
export const getTransactionHistory = async () => {
  const query = `
    SELECT 
        t.transaction_id,
        t.borrower_name,
        t.quantity,
        t.status AS transaction_status,
        t.borrow_date,
        t.expected_return_date,
        t.actual_return_date,
        t.remarks,
        t.instructor_id,
        t.equipment_id,
        t.peripheral_id,
        u.first_name || ' ' || u.last_name AS instructor_name,
        COALESCE(e.item_name, p.item_name) AS item_name,
        COALESCE(e.asset_tag, 'PERIPHERAL') AS asset_tag
    FROM clams.borrow_transactions t
    LEFT JOIN clams.users u ON t.instructor_id = u.user_id
    LEFT JOIN clams.equipment e ON t.equipment_id = e.equipment_id
    LEFT JOIN clams.peripherals p ON t.peripheral_id = p.peripheral_id
    ORDER BY t.borrow_date DESC;
  `;
  const { rows } = await pool.query(query);
  console.log("Transactions returned:", rows.length); // Debug
  return rows;
};

// 3. Fetch Damage Reports - MAKE SURE instructor_id IS INCLUDED
export const getDamageReports = async () => {
  const query = `
    SELECT 
        dr.report_id,
        dr.subject,
        dr.description,
        dr.status AS report_status,
        dr.created_at,
        dr.resolved_at,
        dr.admin_remarks,
        dr.instructor_id,
        dr.equipment_id,
        u.first_name || ' ' || u.last_name AS reporter_name,
        e.item_name AS equipment_name,
        e.asset_tag,
        l.lab_name,
        l.room_number
    FROM clams.damage_reports dr
    LEFT JOIN clams.users u ON dr.instructor_id = u.user_id
    LEFT JOIN clams.equipment e ON dr.equipment_id = e.equipment_id
    LEFT JOIN clams.laboratories l ON e.lab_id = l.lab_id
    ORDER BY dr.created_at DESC;
  `;
  const { rows } = await pool.query(query);
  console.log("Reports returned:", rows.length); // Debug
  return rows;
};
