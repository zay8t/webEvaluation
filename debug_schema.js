const { query } = require('./config/db.js');

async function check() {
    try {
        const columns = await query('PRAGMA table_info(contact_inquiries)');
        console.log('COLUMNS:', JSON.stringify(columns));
    } catch (e) {
        console.error(e);
    }
}

check();
