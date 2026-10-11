// database/schema.ts

export const createTablesSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  user_type TEXT CHECK(user_type IN ('guest', 'registered', 'admin')) DEFAULT 'guest',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  default_strength TEXT CHECK(default_strength IN ('light', 'regular', 'strong')) DEFAULT 'regular',
  default_size TEXT CHECK(default_size IN ('small', 'medium', 'large')) DEFAULT 'medium',
  default_milk_type TEXT CHECK(default_milk_type IN ('regular', 'plant-based')) DEFAULT 'regular',
  save_order_history INTEGER DEFAULT 1,
  notifications INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Drinks table
CREATE TABLE IF NOT EXISTS drinks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_active INTEGER DEFAULT 1,
  image_path TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Drink recipes table
CREATE TABLE IF NOT EXISTS drink_recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  drink_id TEXT NOT NULL,
  size TEXT CHECK(size IN ('small', 'medium', 'large')),
  water_ml INTEGER DEFAULT 0,
  coffee_g REAL DEFAULT 0,
  milk_ml INTEGER DEFAULT 0,
  milk_foam_seconds INTEGER DEFAULT 0,
  FOREIGN KEY (drink_id) REFERENCES drinks(id) ON DELETE CASCADE,
  UNIQUE(drink_id, size)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  drink_id TEXT NOT NULL,
  drink_name TEXT NOT NULL,
  size TEXT NOT NULL,
  strength TEXT NOT NULL,
  milk_type TEXT,
  temperature INTEGER DEFAULT 92,
  sugar_g INTEGER DEFAULT 0,
  milk_amount_percent INTEGER DEFAULT 100,
  foam_level_percent INTEGER DEFAULT 100,
  status TEXT CHECK(status IN ('pending', 'brewing', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (drink_id) REFERENCES drinks(id) ON DELETE CASCADE
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  drink_id TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  size TEXT DEFAULT 'medium',
  strength TEXT DEFAULT 'regular',
  milk_type TEXT DEFAULT 'regular',
  milk_amount_percent INTEGER DEFAULT 100,
  foam_level_percent INTEGER DEFAULT 100,
  sugar_g INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (drink_id) REFERENCES drinks(id) ON DELETE CASCADE
);

-- User messages (prijave problema od korisnika/guesta ka adminu)
CREATE TABLE IF NOT EXISTS user_messages (
  id TEXT PRIMARY KEY,
  sender_name TEXT DEFAULT 'Guest',
  sender_type TEXT NOT NULL CHECK(sender_type IN ('guest', 'registered')),
  sender_email TEXT,
  category TEXT NOT NULL CHECK(category IN ('order_problem', 'machine_issue', 'account', 'other')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK(status IN ('unread', 'read')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Machine status table
CREATE TABLE IF NOT EXISTS machine_status (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  connected INTEGER DEFAULT 0,
  cup_detected INTEGER DEFAULT 0,
  water_level INTEGER DEFAULT 100 CHECK(water_level >= 0 AND water_level <= 100),
  beans_level INTEGER DEFAULT 100 CHECK(beans_level >= 0 AND beans_level <= 100),
  milk_level INTEGER DEFAULT 100 CHECK(milk_level >= 0 AND milk_level <= 100),
  maintenance_needed INTEGER DEFAULT 0,
  last_cleaning TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  type TEXT CHECK(type IN ('warning', 'error', 'info')),
  message TEXT NOT NULL,
  resolved INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT
);
`;
