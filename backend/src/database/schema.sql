-- =====================================================
-- CLAMS - CCS Laboratory Asset Management System
-- Database Schema (Based on System Proposal)
-- PostgreSQL
-- Schema: clams
-- =====================================================

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS clams;

-- Set search path to clams schema
SET search_path TO clams;

-- =====================================================
-- Drop existing tables if they exist (in correct order to avoid foreign key errors)
-- =====================================================
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS damage_reports CASCADE;
DROP TABLE IF EXISTS borrow_transactions CASCADE;
DROP TABLE IF EXISTS peripherals CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS equipment_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS laboratories CASCADE;

-- =====================================================
-- 1. laboratories table
-- Stores the three CCS computer laboratories: Lab 1, Lab 2, and Lab 3
-- =====================================================
CREATE TABLE laboratories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    location VARCHAR(150) NOT NULL,
    total_pcs INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. equipment_categories table
-- Defines equipment categories: Workstations, Peripherals, Networking Devices
-- =====================================================
CREATE TABLE equipment_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. users table
-- Stores user accounts for both Admin and Instructors
-- =====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'instructor')),
    lab_id INTEGER NULL REFERENCES laboratories(id) ON DELETE SET NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. equipment table (Core inventory table)
-- Stores all equipment and asset records per laboratory
-- =====================================================
CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    lab_id INTEGER NOT NULL REFERENCES laboratories(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES equipment_categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Borrowed', 'Damaged', 'Under Repair')),
    quantity INTEGER NOT NULL DEFAULT 1,
    quantity_available INTEGER NOT NULL DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. peripherals table
-- Tracks specific peripheral inventory counts per lab
-- Peripheral types: Monitor, Keyboard, Mouse, Headset, UPS/AVR, LAN Cable, Router
-- =====================================================
CREATE TABLE peripherals (
    id SERIAL PRIMARY KEY,
    lab_id INTEGER NOT NULL REFERENCES laboratories(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    total_count INTEGER NOT NULL DEFAULT 0,
    working_count INTEGER NOT NULL DEFAULT 0,
    damaged_count INTEGER NOT NULL DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lab_id, type)
);

-- =====================================================
-- 6. borrow_transactions table
-- Logs all borrow and return transactions processed by Instructors
-- =====================================================
CREATE TABLE borrow_transactions (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    processed_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    borrower_name VARCHAR(150) NOT NULL,
    quantity_borrowed INTEGER NOT NULL DEFAULT 1,
    borrow_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_return_date DATE NOT NULL,
    actual_return_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Borrowed' CHECK (status IN ('Borrowed', 'Returned')),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. damage_reports table
-- Records equipment damage and maintenance issues submitted by Instructors
-- =====================================================
CREATE TABLE damage_reports (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    reported_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Under Repair', 'Resolved')),
    date_reported DATE NOT NULL DEFAULT CURRENT_DATE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 8. activity_logs table
-- System-wide audit trail for accountability and Admin review
-- =====================================================
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100),
    target_id INTEGER,
    ip_address VARCHAR(50),
    user_agent TEXT,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Create indexes for better performance
-- =====================================================
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_lab ON users(lab_id);
CREATE INDEX idx_users_is_deleted ON users(is_deleted);

CREATE INDEX idx_equipment_lab ON equipment(lab_id);
CREATE INDEX idx_equipment_category ON equipment(category_id);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_is_deleted ON equipment(is_deleted);

CREATE INDEX idx_peripherals_lab ON peripherals(lab_id);
CREATE INDEX idx_peripherals_is_deleted ON peripherals(is_deleted);

CREATE INDEX idx_borrow_equipment ON borrow_transactions(equipment_id);
CREATE INDEX idx_borrow_processed_by ON borrow_transactions(processed_by);
CREATE INDEX idx_borrow_status ON borrow_transactions(status);
CREATE INDEX idx_borrow_dates ON borrow_transactions(borrow_date, expected_return_date);
CREATE INDEX idx_borrow_is_deleted ON borrow_transactions(is_deleted);

CREATE INDEX idx_damage_equipment ON damage_reports(equipment_id);
CREATE INDEX idx_damage_reported_by ON damage_reports(reported_by);
CREATE INDEX idx_damage_status ON damage_reports(status);
CREATE INDEX idx_damage_is_deleted ON damage_reports(is_deleted);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_performed_at ON activity_logs(performed_at);

-- =====================================================
-- Create trigger function to update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION clams.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_laboratories_updated_at 
    BEFORE UPDATE ON laboratories 
    FOR EACH ROW EXECUTE FUNCTION clams.update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION clams.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at 
    BEFORE UPDATE ON equipment 
    FOR EACH ROW EXECUTE FUNCTION clams.update_updated_at_column();

CREATE TRIGGER update_borrow_transactions_updated_at 
    BEFORE UPDATE ON borrow_transactions 
    FOR EACH ROW EXECUTE FUNCTION clams.update_updated_at_column();

CREATE TRIGGER update_damage_reports_updated_at 
    BEFORE UPDATE ON damage_reports 
    FOR EACH ROW EXECUTE FUNCTION clams.update_updated_at_column();

-- =====================================================
-- Create views for easy reporting
-- =====================================================

-- View 1: Laboratory Inventory Summary
CREATE OR REPLACE VIEW clams.lab_inventory_summary AS
SELECT 
    l.id AS lab_id,
    l.name AS lab_name,
    l.location,
    l.total_pcs,
    COUNT(DISTINCT e.id) AS total_equipment,
    COUNT(DISTINCT CASE WHEN e.status = 'Available' AND e.is_deleted = FALSE THEN e.id END) AS available_equipment,
    COUNT(DISTINCT CASE WHEN e.status = 'Borrowed' AND e.is_deleted = FALSE THEN e.id END) AS borrowed_equipment,
    COUNT(DISTINCT CASE WHEN e.status = 'Damaged' AND e.is_deleted = FALSE THEN e.id END) AS damaged_equipment,
    COUNT(DISTINCT CASE WHEN e.status = 'Under Repair' AND e.is_deleted = FALSE THEN e.id END) AS under_repair
FROM clams.laboratories l
LEFT JOIN clams.equipment e ON l.id = e.lab_id
GROUP BY l.id, l.name, l.location, l.total_pcs;

-- View 2: Active Borrow Transactions (with overdue detection)
CREATE OR REPLACE VIEW clams.active_borrows AS
SELECT 
    bt.id AS transaction_id,
    e.name AS equipment_name,
    e.serial_number,
    u.full_name AS processed_by_instructor,
    bt.borrower_name,
    bt.quantity_borrowed,
    bt.borrow_date,
    bt.expected_return_date,
    bt.actual_return_date,
    CASE 
        WHEN bt.actual_return_date IS NOT NULL THEN 'Returned'
        WHEN bt.expected_return_date < CURRENT_DATE THEN 'Overdue'
        ELSE bt.status
    END AS current_status
FROM clams.borrow_transactions bt
JOIN clams.equipment e ON bt.equipment_id = e.id
JOIN clams.users u ON bt.processed_by = u.id
WHERE bt.is_deleted = FALSE
ORDER BY bt.borrow_date DESC;

-- View 3: Pending Damage Reports
CREATE OR REPLACE VIEW clams.pending_damage_reports AS
SELECT 
    dr.id AS report_id,
    e.name AS equipment_name,
    e.serial_number,
    l.name AS laboratory_name,
    u.full_name AS reported_by_instructor,
    dr.description,
    dr.status,
    dr.date_reported,
    dr.created_at
FROM clams.damage_reports dr
JOIN clams.equipment e ON dr.equipment_id = e.id
JOIN clams.laboratories l ON e.lab_id = l.id
JOIN clams.users u ON dr.reported_by = u.id
WHERE dr.is_deleted = FALSE AND dr.status IN ('Pending', 'Under Repair')
ORDER BY dr.date_reported DESC;

-- View 4: Peripheral Inventory Summary per Laboratory
CREATE OR REPLACE VIEW clams.peripheral_summary AS
SELECT 
    l.id AS lab_id,
    l.name AS lab_name,
    p.type,
    p.total_count,
    p.working_count,
    p.damaged_count,
    ROUND((p.working_count::DECIMAL / NULLIF(p.total_count, 0)) * 100, 2) AS working_percentage
FROM clams.laboratories l
JOIN clams.peripherals p ON l.id = p.lab_id
WHERE p.is_deleted = FALSE
ORDER BY l.id, p.type;

-- View 5: Equipment Inventory by Category
CREATE OR REPLACE VIEW clams.equipment_by_category AS
SELECT 
    ec.name AS category_name,
    l.name AS laboratory_name,
    COUNT(e.id) AS total_count,
    COUNT(CASE WHEN e.status = 'Available' THEN 1 END) AS available_count,
    COUNT(CASE WHEN e.status = 'Borrowed' THEN 1 END) AS borrowed_count,
    COUNT(CASE WHEN e.status = 'Damaged' THEN 1 END) AS damaged_count,
    COUNT(CASE WHEN e.status = 'Under Repair' THEN 1 END) AS under_repair_count
FROM clams.equipment_categories ec
LEFT JOIN clams.equipment e ON ec.id = e.category_id AND e.is_deleted = FALSE
LEFT JOIN clams.laboratories l ON e.lab_id = l.id
GROUP BY ec.name, l.name
ORDER BY ec.name, l.name;

-- View 6: User Activity Summary (Last 30 days)
CREATE OR REPLACE VIEW clams.recent_activity AS
SELECT 
    al.id,
    u.full_name AS user_name,
    u.role AS user_role,
    al.action,
    al.target_table,
    al.target_id,
    al.ip_address,
    al.performed_at
FROM clams.activity_logs al
JOIN clams.users u ON al.user_id = u.id
WHERE al.performed_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY al.performed_at DESC;

-- =====================================================
-- Set default privileges for the clams schema
-- =====================================================
ALTER SCHEMA clams OWNER TO postgres;
GRANT USAGE ON SCHEMA clams TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA clams TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA clams TO postgres;

-- =====================================================
-- Verification query
-- =====================================================
SELECT '✅ CLAMS Database Schema Created Successfully!' AS status;
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'clams' 
ORDER BY tablename;
