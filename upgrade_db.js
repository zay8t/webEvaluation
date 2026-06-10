import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'my_eyes_store.db');
const db = new sqlite3.Database(dbPath);

const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

async function upgrade() {
  console.log('Starting SQLite database upgrade process...');

  try {
    // 1. Enable WAL mode and foreign keys
    await runQuery('PRAGMA foreign_keys = OFF');
    
    // 2. Check if orders needs recreation (if payment_intent_id column is missing)
    const checkColumns = await getQuery("PRAGMA table_info(orders)");
    
    // Get column names
    const columns = [];
    await new Promise((resolve, reject) => {
      db.all("PRAGMA table_info(orders)", [], (err, rows) => {
        if (err) reject(err);
        else {
          rows.forEach(r => columns.push(r.name));
          resolve();
        }
      });
    });

    console.log('Current orders columns:', columns);

    if (!columns.includes('payment_intent_id')) {
      console.log('Upgrading orders table schema via migration...');

      await runQuery('BEGIN TRANSACTION');

      // Rename the old table
      await runQuery('ALTER TABLE orders RENAME TO orders_old');

      // Create new orders table with nullable user_id and new fields
      await runQuery(`
        CREATE TABLE orders (
            order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER, -- Nullable for Guest Checkout
            guest_email TEXT,
            guest_name TEXT,
            total_amount REAL NOT NULL,
            tax_amount REAL DEFAULT 0.0,
            shipping_amount REAL DEFAULT 0.0,
            discount_amount REAL DEFAULT 0.0,
            discount_code TEXT,
            payment_status TEXT CHECK(payment_status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')) DEFAULT 'pending',
            order_status TEXT CHECK(order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')) DEFAULT 'pending',
            shipping_address TEXT,
            billing_address TEXT,
            payment_method TEXT,
            payment_intent_id TEXT,
            tracking_number TEXT,
            notes TEXT,
            order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
        )
      `);

      // Map common columns to transfer data
      const commonCols = ['order_id', 'user_id', 'total_amount', 'payment_status', 'order_status', 'shipping_address', 'billing_address', 'payment_method', 'tracking_number', 'notes', 'order_date', 'updated_at'];
      const transferCols = commonCols.filter(col => columns.includes(col)).join(', ');
      
      console.log(`Copying existing order records using columns: ${transferCols}`);
      await runQuery(`
        INSERT INTO orders (${transferCols})
        SELECT ${transferCols} FROM orders_old
      `);

      // Drop old table
      await runQuery('DROP TABLE orders_old');
      
      await runQuery('COMMIT');
      console.log('✓ Orders table schema successfully upgraded');
    } else {
      console.log('✓ Orders table schema is already up to date');
    }

    // 2.5. Repair order_items table if it has a foreign key pointing to orders_old
    const checkOrderItems = await getQuery("SELECT sql FROM sqlite_master WHERE name='order_items'");
    if (checkOrderItems && checkOrderItems.sql.includes('orders_old')) {
      console.log('Upgrading order_items table schema to fix foreign key reference to orders_old...');
      await runQuery('BEGIN TRANSACTION');
      
      await runQuery('ALTER TABLE order_items RENAME TO order_items_old');
      
      await runQuery(`
        CREATE TABLE order_items (
            order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL CHECK (quantity > 0),
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
        )
      `);
      
      await runQuery(`
        INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price)
        SELECT order_item_id, order_id, product_id, quantity, price FROM order_items_old
      `);
      
      await runQuery('DROP TABLE order_items_old');
      
      await runQuery('COMMIT');
      console.log('✓ order_items table schema successfully upgraded');
    } else {
      console.log('✓ order_items table schema is already correct');
    }

    // 3. Create Promotions Table
    console.log('Creating promotions table if not exists...');
    await runQuery(`
      CREATE TABLE IF NOT EXISTS promotions (
          promotion_id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT NOT NULL UNIQUE,
          discount_type TEXT CHECK(discount_type IN ('percentage', 'fixed_amount')) NOT NULL,
          discount_value REAL NOT NULL,
          max_uses INTEGER,
          current_uses INTEGER DEFAULT 0,
          min_order_amount REAL DEFAULT 0.0,
          start_date DATETIME NOT NULL,
          end_date DATETIME NOT NULL,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Create Stock Locks Table
    console.log('Creating stock_locks table if not exists...');
    await runQuery(`
      CREATE TABLE IF NOT EXISTS stock_locks (
          lock_id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL CHECK (quantity > 0),
          expires_at DATETIME NOT NULL,
          session_id TEXT NOT NULL,
          FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
      )
    `);

    // 4.5. Create Inventory Log Table
    console.log('Creating inventory_log table if not exists...');
    await runQuery(`
      CREATE TABLE IF NOT EXISTS inventory_log (
          log_id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER NOT NULL,
          quantity_change INTEGER NOT NULL,
          previous_quantity INTEGER NOT NULL,
          new_quantity INTEGER NOT NULL,
          reason TEXT CHECK(reason IN ('purchase', 'return', 'restock', 'adjustment', 'damage')) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
      )
    `);

    // 5. Re-enable foreign keys & recreate indices
    await runQuery('PRAGMA foreign_keys = ON');
    
    await runQuery('CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(payment_intent_id)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_stock_locks_session ON stock_locks(session_id)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_inventory_log_product_id ON inventory_log(product_id)');

    // 6. Seed mock promotions
    console.log('Seeding mock promotions...');
    const promoCount = await getQuery('SELECT COUNT(*) as count FROM promotions');
    
    if (promoCount.count === 0) {
      const now = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(now.getFullYear() + 1);

      const promos = [
        {
          code: 'WELCOME10',
          discount_type: 'percentage',
          discount_value: 10,
          max_uses: 1000,
          min_order_amount: 1000,
          start_date: now.toISOString(),
          end_date: nextYear.toISOString(),
        },
        {
          code: 'EYES500',
          discount_type: 'fixed_amount',
          discount_value: 500,
          max_uses: 500,
          min_order_amount: 5000,
          start_date: now.toISOString(),
          end_date: nextYear.toISOString(),
        },
        {
          code: 'VIP20',
          discount_type: 'percentage',
          discount_value: 20,
          max_uses: 100,
          min_order_amount: 15000,
          start_date: now.toISOString(),
          end_date: nextYear.toISOString(),
        }
      ];

      for (const p of promos) {
        await runQuery(
          `INSERT INTO promotions (code, discount_type, discount_value, max_uses, min_order_amount, start_date, end_date)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [p.code, p.discount_type, p.discount_value, p.max_uses, p.min_order_amount, p.start_date, p.end_date]
        );
      }
      console.log('✓ Successfully seeded initial promotions');
    } else {
      console.log('✓ Promotions already seeded');
    }

    console.log('✓ Database upgrade completed successfully.');
    db.close();
    process.exit(0);

  } catch (error) {
    console.error('✗ Database upgrade failed:', error);
    db.close();
    process.exit(1);
  }
}

upgrade();
