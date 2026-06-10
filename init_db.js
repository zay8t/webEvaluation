import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
  const db = getDatabase();
  const sqlPath = path.join(__dirname, 'data', 'init_sqlite.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Initializing database schema...');
  
  // SQLite's exec() can run multiple statements
  db.exec(sql, (err) => {
    if (err) {
      console.error('✗ Schema initialization failed:', err.message);
      process.exit(1);
    }
    console.log('✓ Schema initialized successfully');
    process.exit(0);
  });
}

// Wait for DB to be ready (it uses callback in config/db.js)
setTimeout(initDB, 1000);
