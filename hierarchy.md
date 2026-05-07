CLAMS_ROOT
│
├── [users]
│ ├── [activity_logs]
│ │ └── (Tracks: user_id, action, table_affected, record_id)
│ ├── [borrow_transactions]
│ │ └── (Tracks: instructor_id, item_name, quantity, dates)
│ └── [damage_reports]
│ └── (Tracks: instructor_id, status, description)
│
├── [laboratories]
│ ├── [equipment]
│ │ └── [damage_reports]
│ │ └── (Tracks: equipment_id, lab_id, subject)
│ ├── [peripherals]
│ │ └── (Tracks: lab_id, working_count, damaged_count)
│ └── [damage_reports]
│ └── (Direct link to lab_id for location-based reporting)
│
├── [categories]
│ └── [equipment]
│ └── (Classification: category_id -> equipment_id)
│
└── [SEQUENCES] (Internal Postgres Objects)
├── activity_logs_log_id_seq
├── borrow_transactions_transaction_id_seq
├── categories_category_id_seq
├── damage_reports_report_id_seq
├── equipment_equipment_id_seq
├── laboratories_lab_id_seq
└── peripherals_peripheral_id_seq

sa admin makita ang borrow items sa user then sa user makita niya ang borrow item na still pending and returns
