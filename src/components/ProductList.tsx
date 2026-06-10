import React, { useState } from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Product } from '../types';

const shapes = [
  {
    id: 'round',
    label: 'Round',
    path: <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
  },
  {
    id: 'square',
    label: 'Square',
    path: <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  },
  {
    id: 'rectangle',
    label: 'Rectangle',
    path: <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  },
  {
    id: 'cateye',
    label: 'Cat Eye',
    path: <path d="M2 14C2 14 4 8 12 8C20 8 22 14 22 14V16H2V14Z" stroke="currentColor" strokeWidth="1.5" fill="none" /> 
  },
  {
    id: 'aviator',
    label: 'Aviator',
    path: <path d="M12 14C12 14 11 8 4 8C3 8 2 9 2 11V14C2 17 5 18 7 18C9 18 11 16 12 14ZM12 14C12 14 13 8 20 8C21 8 22 9 22 11V14C22 17 19 18 17 18C15 18 13 16 12 14Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
  }
];

const products: Product[] = [
  {
    id: 1,
    name: "AP2264 OPTICS",
    category: "Celine",
    price: 3500,
    img: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=1000",
    tag: "Best Seller",
    shape: 'round'
  },
  {
    id: 2,
    name: "AP2291 OPTICS",
    category: "Ray-Ban",
    price: 4200,
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000",
    tag: "Popular",
    shape: 'aviator'
  },
  {
    id: 3,
    name: "AP2198 OPTICS",
    category: "Dior",
    price: 3000,
    img: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=1000",
    tag: "Sale On",
    shape: 'square'
  },
  {
    id: 4,
    name: "AP2058 OPTICS",
    category: "Kenzo",
    price: 4800,
    img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=1000",
    tag: "Best Seller",
    shape: 'cateye'
  }
];

interface ProductListProps {
  addToCart: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ addToCart }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);

  const filteredProducts = selectedShape 
    ? products.filter(p => p.shape === selectedShape)
    : products;

  return (
    <section id="shop" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
           <h2 className="text-4xl font-serif text-spectra-navy">Latest Collections</h2>
           <p className="text-gray-400 text-sm hidden md:block">Scroll to explore shapes</p>
        </div>

        {/* Horizontal Scroll Shape Filter */}
        <div className="mb-16 -mx-6 px-6 md:mx-0 md:px-0">
           <div className="flex gap-4 overflow-x-auto pb-6 snap-x hide-scrollbar">
            {shapes.map((shape) => (
              <button 
                key={shape.id}
                onClick={() => setSelectedShape(selectedShape === shape.id ? null : shape.id)}
                className={`snap-start shrink-0 w-40 h-48 rounded-[2rem] flex flex-col items-center justify-center gap-6 transition-all duration-300 border ${
                  selectedShape === shape.id 
                    ? 'bg-spectra-navy text-white border-spectra-navy shadow-xl scale-105' 
                    : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-spectra-navy'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    selectedShape === shape.id ? 'bg-white/10' : 'bg-white'
                }`}>
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">{shape.path}</svg>
                </div>
                <span className="font-sans font-medium tracking-wide">{shape.label}</span>
              </button>
            ))}
           </div>
        </div>

        {/* Product Grid */}
        <div 
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id}
              className={`group bg-white rounded-3xl p-4 hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image Area */}
              <div className="relative aspect-square bg-spectra-card rounded-2xl overflow-hidden mb-4 flex items-center justify-center p-6">
                 {/* Tag */}
                 {product.tag && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-white/80 backdrop-blur px-2 py-1 rounded-lg">
                      {product.tag}
                    </span>
                 )}
                 {/* Color Dots */}
                 <div className="absolute top-3 right-3 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-black ring-2 ring-white"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-600 ring-2 ring-white"></div>
                 </div>

                 <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
              </div>

              {/* Info Area */}
              <div className="px-2 pb-2">
                <div className="flex justify-between items-end">
                   <div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
                     <h3 className="font-sans font-semibold text-spectra-navy text-lg">{product.name}</h3>
                     <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-bold text-sm text-spectra-orange">PKR {product.price}</span>
                        <span className="text-xs text-gray-400 line-through">PKR {product.price + 1500}</span>
                     </div>
                   </div>
                   <button 
                    onClick={() => addToCart(product)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-spectra-navy hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-lg"
                   >
                     <ChevronRight size={18} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};