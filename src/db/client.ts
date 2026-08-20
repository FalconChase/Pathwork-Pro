import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

// tauri-plugin-sql runs .sql migration files you register in tauri.conf.json
// (see src-tauri/src/main.rs). This just opens the connection; the schema
// is applied by the plugin's migration runner before this resolves.
export async function initDb(): Promise<Database> {
  if (!db) {
    db = await Database.load("sqlite:pathwork.db");
  }
  return db;
}

export function getDb(): Database {
  if (!db) {
    throw new Error("Database not initialized — call initDb() first.");
  }
  return db;
}

export function newId(): string {
  return crypto.randomUUID();
}
