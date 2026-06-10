import { query } from './config/db.js';

async function seedProducts() {
  const products = [
    // 0-5k Range
    { name: 'Basic Reading Glasses', brand: 'Police', cat: 'Eyeglasses', frame: 'full_rim', price: 1200, gen: 'unisex' },
    { name: 'Retro Roundies', brand: 'Vogue', cat: 'Sunglasses', frame: 'other', price: 3500, gen: 'female' },
    { name: 'Compact Foldable', brand: 'Police', cat: 'Sunglasses', frame: 'wayfarer', price: 4800, gen: 'male' },
    
    // 5k-15k Range
    { name: 'Classic Aviator', brand: 'Ray-Ban', cat: 'Sunglasses', frame: 'aviator', price: 15000, gen: 'unisex' },
    { name: 'Wayfarer Lite', brand: 'Ray-Ban', cat: 'Sunglasses', frame: 'wayfarer', price: 12000, gen: 'unisex' },
    { name: 'Modern Round', brand: 'Oakley', cat: 'Eyeglasses', frame: 'full_rim', price: 8500, gen: 'unisex' },
    { name: 'Clubmaster Style', brand: 'Ray-Ban', cat: 'Eyeglasses', frame: 'browline', price: 13500, gen: 'unisex' },
    { name: 'Active Sport', brand: 'Oakley', cat: 'Sunglasses', frame: 'other', price: 11000, gen: 'male' },
    
    // 15k-30k Range
    { name: 'Cat Eye Elegance', brand: 'Gucci', cat: 'Eyeglasses', frame: 'cat_eye', price: 25000, gen: 'female' },
    { name: 'Titanium Rectangle', brand: 'Silhouette', cat: 'Eyeglasses', frame: 'rimless', price: 18000, gen: 'male' },
    { name: 'Sport Performance', brand: 'Oakley', cat: 'Sunglasses', frame: 'other', price: 22000, gen: 'male' },
    { name: 'Aviator Carbon', brand: 'Ray-Ban', cat: 'Sunglasses', frame: 'aviator', price: 28000, gen: 'male' },
    { name: 'Designer Geometric', brand: 'Prada', cat: 'Sunglasses', frame: 'other', price: 29500, gen: 'female' },
    
    // 30k-50k Range
    { name: 'Luxury Gold Trim', brand: 'Gucci', cat: 'Sunglasses', frame: 'aviator', price: 42000, gen: 'unisex' },
    { name: 'Executive Suite', brand: 'Armani', cat: 'Eyeglasses', frame: 'half_rim', price: 34000, gen: 'male' },
    { name: 'Diamond Series', brand: 'Prada', cat: 'Sunglasses', frame: 'cat_eye', price: 48000, gen: 'female' },
    { name: 'Elite Carbon Pro', brand: 'Oakley', cat: 'Sunglasses', frame: 'other', price: 38500, gen: 'male' },
    { name: 'Minimalist Gold', brand: 'Silhouette', cat: 'Eyeglasses', frame: 'rimless', price: 31000, gen: 'unisex' },
    { name: 'Urban Chic', brand: 'Gucci', cat: 'Sunglasses', frame: 'other', price: 37000, gen: 'female' },
    { name: 'Vintage Oversized', brand: 'Prada', cat: 'Sunglasses', frame: 'other', price: 33000, gen: 'female' }
  ];

  const images = [
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1511499767350-a1590fdb2863?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1577744486770-020ab4ca15f6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=800'
  ];

  console.log('Seeding 20 products...');
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    try {
      const sql = `
        INSERT OR IGNORE INTO products (
          product_name, brand, category, description, frame_type, 
          gender, price, stock_quantity, image_url, color, material, lens_type, sku
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await query(sql, [
        p.name, p.brand, p.cat, `Premium ${p.name} with exceptional quality and design features.`, p.frame, 
        p.gen, p.price, Math.floor(Math.random() * 50) + 10, images[i % images.length], 'Black/Gold', 'Premium Material', 'UV400', `SKU-${i+100}`
      ]);
      console.log(`✓ Seeded ${i+1}: ${p.name} (${p.price} PKR)`);
    } catch (err) {
      console.error(`✗ Failed to seed ${p.name}:`, err.message);
    }
  }
  console.log('Seeding complete.');
  process.exit(0);
}

seedProducts();
