DROP SCHEMA IF EXISTS clams CASCADE;
CREATE SCHEMA clams;

-- Categories
CREATE TABLE clams.categories (
    category_id     SERIAL PRIMARY KEY,
    category_name   VARCHAR(100) NOT NULL
);

-- Laboratories
CREATE TABLE clams.laboratories (
    lab_id          SERIAL PRIMARY KEY,
    lab_name        VARCHAR(100) NOT NULL,
    room_number     VARCHAR(50),
    building        VARCHAR(100),
    total_stations  INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE clams.users (
    user_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_number       VARCHAR(50) UNIQUE NOT NULL,
    username        VARCHAR(50) UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    email           VARCHAR(150) UNIQUE,
    role            VARCHAR(20) DEFAULT 'instructor',
    profile_img     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted      BOOLEAN DEFAULT FALSE
);

-- Equipment (with pc_name instead of asset_tag)
CREATE TABLE clams.equipment (
    equipment_id    SERIAL PRIMARY KEY,
    pc_name         VARCHAR(100) UNIQUE,
    item_name       VARCHAR(255) NOT NULL,
    category_id     INTEGER REFERENCES clams.categories(category_id),
    brand           VARCHAR(100),
    model           VARCHAR(100),
    serial_number   VARCHAR(100),
    specs           JSONB,
    lab_id          INTEGER REFERENCES clams.laboratories(lab_id),
    status          VARCHAR(50) DEFAULT 'working',
    purchase_date   DATE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Peripherals
CREATE TABLE clams.peripherals (
    peripheral_id   SERIAL PRIMARY KEY,
    equipment_id    INTEGER REFERENCES clams.equipment(equipment_id),
    lab_id          INTEGER REFERENCES clams.laboratories(lab_id),
    category_id     INTEGER REFERENCES clams.categories(category_id),
    item_name       VARCHAR(255) NOT NULL,
    brand           VARCHAR(100),
    status          VARCHAR(50) DEFAULT 'working',
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted      BOOLEAN DEFAULT FALSE,
    CONSTRAINT chk_peripheral_location CHECK (
        (equipment_id IS NOT NULL) OR (lab_id IS NOT NULL)
    )
);

-- Borrow transactions
CREATE TABLE clams.borrow_transactions (
    transaction_id          SERIAL PRIMARY KEY,
    instructor_id           UUID REFERENCES clams.users(user_id),
    equipment_id            INTEGER REFERENCES clams.equipment(equipment_id),
    peripheral_id           INTEGER REFERENCES clams.peripherals(peripheral_id),
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
    )
);

-- Damage reports
CREATE TABLE clams.damage_reports (
    report_id       SERIAL PRIMARY KEY,
    instructor_id   UUID REFERENCES clams.users(user_id),
    equipment_id    INTEGER REFERENCES clams.equipment(equipment_id),
    subject         VARCHAR(255),
    description     TEXT,
    status          VARCHAR(50) DEFAULT 'open',
    admin_remarks   TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at     TIMESTAMP
);

-- Activity logs
CREATE TABLE clams.activity_logs (
    log_id          SERIAL PRIMARY KEY,
    user_id         UUID REFERENCES clams.users(user_id),
    action          TEXT NOT NULL,
    table_affected  VARCHAR(100),
    record_id       INTEGER,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to update total_stations
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