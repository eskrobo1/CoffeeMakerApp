// database/seeds.ts
import * as SQLite from "expo-sqlite";
// ZAKOMENTARIŠI bcrypt import
// import bcrypt from 'bcryptjs';

export const seedDatabase = async (db: SQLite.SQLiteDatabase) => {
  console.log("🌱 Seeding database...");

  try {
    // ... (drinks i recipes ostaju isto)

    // 3. Seed Admin User - БЕЗ bcrypt (privremeno)
    await db.runAsync(
      "INSERT OR IGNORE INTO users (id, email, password_hash, name, user_type) VALUES (?, ?, ?, ?, ?)",
      ["admin-001", "admin@coffee.com", "admin123", "Admin User", "admin"],
    );

    // 4. Seed Guest User - БЕЗ bcrypt (privremeno)
    await db.runAsync(
      "INSERT OR IGNORE INTO users (id, email, password_hash, name, user_type) VALUES (?, ?, ?, ?, ?)",
      ["guest-001", "guest@coffee.com", "guest", "Guest User", "guest"],
    );

    // 5. Seed Machine Status
    await db.runAsync(
      "INSERT OR IGNORE INTO machine_status (id, connected, cup_detected, water_level, beans_level, milk_level) VALUES (?, ?, ?, ?, ?, ?)",
      [1, 1, 0, 100, 100, 100],
    );

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};
