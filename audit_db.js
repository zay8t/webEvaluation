import { query } from './config/db.js';

async function audit() {
    try {
        const tables = await query("SELECT name FROM sqlite_master WHERE type='table'");
        console.log('TABLES:', tables.map(t => t.name).join(', '));
        
        for (const table of tables) {
            const cols = await query(`PRAGMA table_info(${table.name})`);
            // SQLite `query` returns an array of objects for PRAGMA table_info if it's treated as a multi-row query.
            // But wait, the previous error said `cols.map is not a function`.
            // Let's console.log(cols) to see what it is.
            console.log(`SCHEMA [${table.name}]:`, JSON.stringify(cols));
        }
    } catch (e) {
        console.error(e);
    }
}

audit();
