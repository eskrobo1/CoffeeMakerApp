// database/init.ts
import * as SQLite from "expo-sqlite";
import { createTablesSQL } from "./schema";
import { seedDatabase } from "./seeds";

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    // Ako već postoji instanca, vrati je
    if (dbInstance) {
      return dbInstance;
    }

    console.log("📦 Initializing database...");

    // Otvori bazu podataka
    const db = await SQLite.openDatabaseAsync("coffee_app.db");

    // Kreiraj tabele
    console.log("🔨 Creating tables...");
    await db.execAsync(createTablesSQL);

    // Dodaj početne podatke
    await seedDatabase(db);

    // Sačuvaj instancu
    dbInstance = db;

    console.log("✅ Database initialized successfully!");
    return db;
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!dbInstance) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return dbInstance;
};

// Za razvoj - reset baze
export const resetDatabase = async (): Promise<void> => {
  try {
    console.log("🔄 Resetting database...");

    const db = await SQLite.openDatabaseAsync("coffee_app.db");

    // Obriši sve tabele
    await db.execAsync(`
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS user_preferences;
      DROP TABLE IF EXISTS drinks;
      DROP TABLE IF EXISTS drink_recipes;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS favorites;
      DROP TABLE IF EXISTS machine_status;
      DROP TABLE IF EXISTS alerts;
    `);

    // Resetuj instancu
    dbInstance = null;

    // Inicijalizuj ponovo
    await initDatabase();

    console.log("✅ Database reset successfully!");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw error;
  }
};
