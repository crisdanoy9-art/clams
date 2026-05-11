-- ============================================================
-- CLAMS - Computer Laboratory Asset Management System
-- Complete Database Schema (NO UUID - All INTEGER IDs)
-- ============================================================

DROP SCHEMA IF EXISTS clams CASCADE;
CREATE SCHEMA clams;

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE clams.categories (
    category_id     SERIAL PRIMARY KEY,
    category_name   VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================================
-- TABLE: laboratories
-- ============================================================
CREATE TABLE clams.laboratories (
    lab_id          SERIAL PRIMARY KEY,
    lab_name        VARCHAR(100) NOT NULL UNIQUE,
    room_number     VARCHAR(50),
    building        VARCHAR(100),
    total_stations  INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: users (SERIAL INTEGER - NO UUID)
-- ============================================================
CREATE TABLE clams.users (
    user_id            SERIAL PRIMARY KEY,
    id_number          VARCHAR(50) UNIQUE NOT NULL,
    username           VARCHAR(50) UNIQUE NOT NULL,
    password_hash      TEXT NOT NULL,
    first_name         VARCHAR(100),
    last_name          VARCHAR(100),
    email              VARCHAR(150) UNIQUE,
    role               VARCHAR(20) DEFAULT 'instructor',
    profile_img        TEXT,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted         BOOLEAN DEFAULT FALSE,
    last_logs_viewed   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_user_role CHECK (role IN ('admin', 'instructor'))
);

-- ============================================================
-- TABLE: equipment
-- ============================================================
CREATE TABLE clams.equipment (
    equipment_id    SERIAL PRIMARY KEY,
    pc_name         VARCHAR(100) UNIQUE,
    item_name       VARCHAR(255) NOT NULL,
    category_id     INTEGER REFERENCES clams.categories(category_id) ON DELETE SET NULL,
    brand           VARCHAR(100),
    model           VARCHAR(100),
    serial_number   VARCHAR(100),
    specs           JSONB,
    lab_id          INTEGER REFERENCES clams.laboratories(lab_id) ON DELETE SET NULL,
    status          VARCHAR(50) DEFAULT 'working',
    purchase_date   DATE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_equipment_status CHECK (status IN ('working', 'for_repair', 'retired', 'lost'))
);

-- ============================================================
-- TABLE: peripherals
-- ============================================================
CREATE TABLE clams.peripherals (
    peripheral_id   SERIAL PRIMARY KEY,
    equipment_id    INTEGER REFERENCES clams.equipment(equipment_id) ON DELETE SET NULL,
    lab_id          INTEGER REFERENCES clams.laboratories(lab_id) ON DELETE SET NULL,
    category_id     INTEGER REFERENCES clams.categories(category_id) ON DELETE SET NULL,
    item_name       VARCHAR(255) NOT NULL,
    brand           VARCHAR(100),
    status          VARCHAR(50) DEFAULT 'working',
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted      BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT chk_peripheral_location CHECK (
        (equipment_id IS NOT NULL) OR (lab_id IS NOT NULL)
    ),
    CONSTRAINT chk_peripheral_status CHECK (status IN ('working', 'damaged'))
);

-- ============================================================
-- TABLE: borrow_transactions (INTEGER for user references)
-- ============================================================
CREATE TABLE clams.borrow_transactions (
    transaction_id          SERIAL PRIMARY KEY,
    instructor_id           INTEGER REFERENCES clams.users(user_id) ON DELETE SET NULL,
    equipment_id            INTEGER REFERENCES clams.equipment(equipment_id) ON DELETE SET NULL,
    peripheral_id           INTEGER REFERENCES clams.peripherals(peripheral_id) ON DELETE SET NULL,
    quantity                INTEGER DEFAULT 1,
    borrower_name           VARCHAR(255),
    status                  VARCHAR(50) DEFAULT 'borrowed',
    borrow_date             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_return_date    TIMESTAMP,
    actual_return_date      TIMESTAMP,
    remarks                 TEXT,
    
    CONSTRAINT chk_borrow_target CHECK (
        (equipment_id IS NOT NULL AND peripheral_id IS NULL)
        OR
        (equipment_id IS NULL AND peripheral_id IS NOT NULL)
    ),
    CONSTRAINT chk_borrow_status CHECK (status IN ('borrowed', 'returned', 'overdue'))
);

-- ============================================================
-- TABLE: damage_reports (INTEGER for user references)
-- ============================================================
CREATE TABLE clams.damage_reports (
    report_id       SERIAL PRIMARY KEY,
    instructor_id   INTEGER REFERENCES clams.users(user_id) ON DELETE SET NULL,
    equipment_id    INTEGER REFERENCES clams.equipment(equipment_id) ON DELETE SET NULL,
    subject         VARCHAR(255),
    description     TEXT,
    status          VARCHAR(50) DEFAULT 'open',
    admin_remarks   TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at     TIMESTAMP,
    
    CONSTRAINT chk_report_status CHECK (status IN ('open', 'in_progress', 'resolved', 'rejected'))
);

-- ============================================================
-- TABLE: activity_logs (INTEGER for user references)
-- ============================================================
CREATE TABLE clams.activity_logs (
    log_id          SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES clams.users(user_id) ON DELETE SET NULL,
    action          TEXT NOT NULL,
    table_affected  VARCHAR(100),
    record_id       INTEGER,
    bulk_count      INTEGER DEFAULT 1,
    bulk_details    TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TRIGGER: update laboratories.total_stations
-- ============================================================
CREATE OR REPLACE FUNCTION clams.update_lab_total_stations()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE clams.laboratories
        SET total_stations = (
            SELECT COUNT(*) FROM clams.equipment
            WHERE lab_id = NEW.lab_id AND is_deleted = false
        )
        WHERE lab_id = NEW.lab_id;
    
    ELSIF TG_OP = 'UPDATE' AND OLD.is_deleted = false AND NEW.is_deleted = true THEN
        UPDATE clams.laboratories
        SET total_stations = (
            SELECT COUNT(*) FROM clams.equipment
            WHERE lab_id = NEW.lab_id AND is_deleted = false
        )
        WHERE lab_id = NEW.lab_id;
    
    ELSIF TG_OP = 'UPDATE' AND OLD.lab_id IS DISTINCT FROM NEW.lab_id THEN
        UPDATE clams.laboratories
        SET total_stations = (
            SELECT COUNT(*) FROM clams.equipment
            WHERE lab_id = OLD.lab_id AND is_deleted = false
        )
        WHERE lab_id = OLD.lab_id;
        
        UPDATE clams.laboratories
        SET total_stations = (
            SELECT COUNT(*) FROM clams.equipment
            WHERE lab_id = NEW.lab_id AND is_deleted = false
        )
        WHERE lab_id = NEW.lab_id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_lab_total_stations
AFTER INSERT OR UPDATE OF is_deleted, lab_id ON clams.equipment
FOR EACH ROW
EXECUTE FUNCTION clams.update_lab_total_stations();

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_equipment_lab_id ON clams.equipment(lab_id);
CREATE INDEX idx_equipment_status ON clams.equipment(status);
CREATE INDEX idx_equipment_is_deleted ON clams.equipment(is_deleted);
CREATE INDEX idx_equipment_pc_name ON clams.equipment(pc_name);
CREATE INDEX idx_peripherals_lab_id ON clams.peripherals(lab_id);
CREATE INDEX idx_peripherals_equipment_id ON clams.peripherals(equipment_id);
CREATE INDEX idx_borrow_transactions_status ON clams.borrow_transactions(status);
CREATE INDEX idx_borrow_transactions_instructor_id ON clams.borrow_transactions(instructor_id);
CREATE INDEX idx_damage_reports_status ON clams.damage_reports(status);
CREATE INDEX idx_damage_reports_instructor_id ON clams.damage_reports(instructor_id);
CREATE INDEX idx_activity_logs_created_at ON clams.activity_logs(created_at);
CREATE INDEX idx_activity_logs_user_id ON clams.activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON clams.activity_logs(action);
CREATE INDEX idx_users_role ON clams.users(role);
CREATE INDEX idx_users_is_deleted ON clams.users(is_deleted);
CREATE INDEX idx_users_username ON clams.users(username);

-- ============================================================
-- DEFAULT DATA (Seeded via seed.js)
-- ============================================================
-- Users will be inserted by seed.js with:
-- Admin:    username: 'admin',     password: 'admin123'
-- Instructor: username: 'ins',      password: 'ins123'
-- ============================================================

