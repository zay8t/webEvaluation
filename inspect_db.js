import { query } from './config/db.js';

async function inspectDB() {
  try {
    const tables = await query("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables:', tables);
    
    for (const table of tables) {
      if (table.name === 'sqlite_sequence') continue;
      const columns = await query(`PRAGMA table_info(${table.name})`);
      console.log(`\nTable: ${table.name}`);
      console.log(columns.map(c => `${c.name} (${c.type})`).join(', '));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

inspectDB();
