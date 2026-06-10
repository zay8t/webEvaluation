import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  ShoppingCart, 
  Eye, 
  X,
  Check,
  Filter
} from 'lucide-react';

interface Product {
  product_id: number;
  product_name: string;
  brand: string;
  category: string;
  description: string;
  frame_type: string;
  gender: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  color: string;
  material: string;
  sku: string;
}

const ProductCatalog: React.FC<{ initialCategory?: string }> = ({ initialCategory }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter States
  const [category, setCategory] = useState(initialCategory || '');
  const [gender, setGender] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFrameTypes, setSelectedFrameTypes] = useState<string[]>([]);

  // Cart addition feedback state & handler
  const [addingId, setAddingId] = useState<number | null>(null);

  const addToCart = (product: Product) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.product_id === product.product_id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        product_id: product.product_id,
        product_name: product.product_name,
        price: product.price,
        image_url: product.image_url,
        brand: product.brand,
        quantity: 1
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Notify Header or other components listening to custom cart updates
    window.dispatchEvent(new Event('cart-updated'));

    // Temporary button state visual feedback
    setAddingId(product.product_id);
    setTimeout(() => {
      setAddingId(null);
    }, 1500);
  };

  const brands = ['Ray-Ban', 'Oakley', 'Gucci', 'Silhouette', 'Prada', 'Armani'];
  const frameTypes = ['full_rim', 'half_rim', 'rimless', 'browline', 'cat_eye', 'aviator', 'wayfarer'];
  const categories = ['Sunglasses', 'Eyeglasses', 'Prescription', 'Computer'];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (gender) params.append('gender', gender);
      if (selectedBrands.length > 0) params.append('brand', selectedBrands.join(','));
      if (selectedFrameTypes.length > 0) params.append('frame_type', selectedFrameTypes.join(','));
      params.append('min_price', priceRange[0].toString());
      params.append('max_price', priceRange[1].toString());

      const response = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  }, [category, gender, selectedBrands, selectedFrameTypes, priceRange]);

  // Debounce price slider
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleFrameType = (type: string) => {
    setSelectedFrameTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-spectra-navy dark:text-dark-text pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden flex items-center justify-center gap-2 w-full py-3 bg-gray-100 dark:bg-dark-surface rounded-xl font-medium mb-4"
          >
            <SlidersHorizontal size={18} />
            Show Filters
          </button>

          {/* Sidebar Filters */}
          <aside className={`
            fixed inset-0 z-50 md:static md:block md:w-64 bg-white dark:bg-dark-bg transition-transform duration-300 overflow-y-auto p-6 md:p-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}>
            <div className="flex items-center justify-between md:hidden mb-8">
              <h2 className="text-xl font-bold font-playfair">Filters</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2"><X size={24} /></button>
            </div>

            <div className="space-y-8 sticky top-28">
              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-gray-500 dark:text-dark-muted">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-dark-surface border-none rounded-lg p-3 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Price Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-dark-muted">Price Range</label>
                  <span className="text-sm font-medium">{formatPrice(priceRange[1])}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 dark:bg-dark-surface rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Brands Checkboxes */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-gray-500 dark:text-dark-muted">Brands</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        onClick={() => toggleBrand(brand)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                          ${selectedBrands.includes(brand) ? 'bg-amber-500 border-amber-500' : 'border-gray-300 dark:border-dark-border group-hover:border-amber-400'}`}
                      >
                        {selectedBrands.includes(brand) && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-sm font-medium">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender Radio */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-gray-500 dark:text-dark-muted">Gender</label>
                <div className="flex flex-wrap gap-2">
                  {['', 'male', 'female', 'unisex'].map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight transition-all
                        ${gender === g 
                          ? 'bg-spectra-navy dark:bg-amber-500 text-white shadow-lg' 
                          : 'bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-card text-gray-600 dark:text-dark-text'}`}
                    >
                      {g === '' ? 'All' : g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Types */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-gray-500 dark:text-dark-muted">Frame Style</label>
                <div className="space-y-2">
                  {frameTypes.map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        onClick={() => toggleFrameType(type)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                          ${selectedFrameTypes.includes(type) ? 'bg-amber-500 border-amber-500' : 'border-gray-300 dark:border-dark-border group-hover:border-amber-400'}`}
                      >
                        {selectedFrameTypes.includes(type) && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-sm font-medium capitalize">{type.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear All */}
              <button 
                onClick={() => {
                  setCategory('');
                  setGender('');
                  setPriceRange([0, 50000]);
                  setSelectedBrands([]);
                  setSelectedFrameTypes([]);
                }}
                className="w-full py-3 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-playfair font-bold">
                {category || 'Eyewear Collection'}
                <span className="ml-3 text-sm font-sans font-medium text-gray-400">({products.length} items)</span>
              </h1>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 dark:bg-dark-surface rounded-2xl h-96"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-gray-50 dark:bg-dark-surface rounded-3xl">
                <p className="text-red-500 font-medium mb-4">{error}</p>
                <button onClick={fetchProducts} className="bg-spectra-navy text-white px-6 py-2 rounded-lg">Try Again</button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 dark:bg-dark-surface rounded-3xl">
                <Filter size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 dark:text-dark-muted text-lg">No products match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                  <div 
                    key={product.product_id}
                    className="group relative bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-dark-border"
                  >
                    {/* Image Area */}
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <img 
                        src={product.image_url} 
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 gap-3">
                        <button 
                          onClick={() => addToCart(product)}
                          className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-xl transition-all duration-300 flex items-center justify-center gap-2
                            ${addingId === product.product_id 
                              ? 'bg-green-600 text-white' 
                              : 'bg-white text-spectra-navy hover:bg-amber-500 hover:text-white'}`}
                        >
                          {addingId === product.product_id ? (
                            <>
                              <Check size={18} className="animate-bounce" />
                              Added!
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={18} />
                              Add to Cart
                            </>
                          )}
                        </button>
                        <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl text-white flex items-center justify-center hover:bg-white hover:text-spectra-navy transition-all">
                          <Eye size={20} />
                        </button>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur text-spectra-navy text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                          {product.brand}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-amber-500 transition-colors">{product.product_name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-black text-spectra-navy dark:text-white">
                          {formatPrice(product.price)}
                        </p>
                        <div className="flex gap-1">
                          <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: product.color.split('/')[0].toLowerCase() }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default ProductCatalog;
