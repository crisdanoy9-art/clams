
CREATE SCHEMA IF NOT EXISTS clams;

CREATE TABLE clams.categories (
    category_id     SERIAL PRIMARY KEY,
    category_name   VARCHAR(100) NOT NULL
);

CREATE TABLE clams.laboratories (
    lab_id          SERIAL PRIMARY KEY,
    lab_name        VARCHAR(100) NOT NULL,
    room_number     VARCHAR(50),
    building        VARCHAR(100),
    total_stations  INTEGER,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clams.users (
    user_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_number       VARCHAR(50)  UNIQUE NOT NULL,
    username        VARCHAR(50)  UNIQUE NOT NULL,
    password_hash   TEXT         NOT NULL,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    email           VARCHAR(150) UNIQUE,
    role            VARCHAR(20),
    profile_img     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clams.equipment (
    equipment_id    SERIAL PRIMARY KEY,
    asset_tag       VARCHAR(100) UNIQUE,
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

CREATE TABLE clams.peripherals (
    peripheral_id   SERIAL PRIMARY KEY,
    lab_id          INTEGER REFERENCES clams.laboratories(lab_id),
    category_id     INTEGER REFERENCES clams.categories(category_id),
    item_name       VARCHAR(255) NOT NULL,
    brand           VARCHAR(100),
    working_count   INTEGER DEFAULT 0,
    damaged_count   INTEGER DEFAULT 0,
    -- total_count removed: derive as (working_count + damaged_count)
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clams.borrow_transactions (
    transaction_id          SERIAL PRIMARY KEY,
    instructor_id           UUID    REFERENCES clams.users(user_id),
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

CREATE TABLE clams.damage_reports (
    report_id       SERIAL PRIMARY KEY,
    instructor_id   UUID    REFERENCES clams.users(user_id),
    equipment_id    INTEGER REFERENCES clams.equipment(equipment_id),
    subject         VARCHAR(255),
    description     TEXT,
    status          VARCHAR(50) DEFAULT 'open',
    admin_remarks   TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at     TIMESTAMP
);

CREATE TABLE clams.activity_logs (
    log_id          SERIAL PRIMARY KEY,
    user_id         UUID REFERENCES clams.users(user_id),
    action          TEXT NOT NULL,
    table_affected  VARCHAR(100),
    record_id       INTEGER,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
