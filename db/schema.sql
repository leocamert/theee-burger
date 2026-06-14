-- THEEE BURGER — orders + careers applications

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_number TEXT NOT NULL,
  customer_number TEXT NOT NULL,
  items TEXT NOT NULL,                       -- JSON: [{id,name,qty,price}]
  total REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',        -- new | preparing | served
  notes TEXT,                                -- order-level special requests
  created_at TEXT NOT NULL                   -- ISO 8601
);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at DESC);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position TEXT,
  message TEXT,
  resume_name TEXT,
  resume_type TEXT,
  resume_data TEXT,                          -- base64 of the file
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_apps_created ON applications (created_at DESC);
