-- ============================================================================
-- MY EYES - SQLite Data Schema (Sanitized for SQLite)
-- ============================================================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    role TEXT CHECK(role IN ('customer', 'admin', 'staff')) DEFAULT 'customer',
    theme_preference TEXT CHECK(theme_preference IN ('light', 'dark')) DEFAULT 'light',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    frame_type TEXT NOT NULL,
    gender TEXT CHECK(gender IN ('male', 'female', 'unisex')) DEFAULT 'unisex',
    price REAL NOT NULL,
    stock_quantity INTEGER DEFAULT 0 NOT NULL,
    image_url TEXT,
    color TEXT,
    material TEXT,
    lens_type TEXT,
    sku TEXT UNIQUE,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Orders Table (Modified for Guest Checkout and Stripe / Promotions details)
CREATE TABLE IF NOT EXISTS orders (
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
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
);

-- Promotions Table (Coupons / Promo Codes)
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
);

-- Stock Locks Table (Temporary lock to prevent overselling during checkout)
CREATE TABLE IF NOT EXISTS stock_locks (
    lock_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    expires_at DATETIME NOT NULL,
    session_id TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Indices for Orders and Performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);
CREATE INDEX IF NOT EXISTS idx_stock_locks_session ON stock_locks(session_id);

-- Inventory Log Table (SQLite version)
CREATE TABLE IF NOT EXISTS inventory_log (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity_change INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason TEXT CHECK(reason IN ('purchase', 'return', 'restock', 'adjustment', 'damage')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_inventory_log_product_id ON inventory_log(product_id);
