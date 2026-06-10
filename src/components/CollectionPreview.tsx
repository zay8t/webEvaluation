import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const products = [
  {
    id: 1,
    name: "Oxford Round",
    color: "Amber Tortoise",
    img: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=1000",
    tag: "Best Seller"
  },
  {
    id: 2,
    name: "Aviator Classic",
    color: "Gold Metal",
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000",
    tag: "New Arrival"
  },
  {
    id: 3,
    name: "Brooklyn Square",
    color: "Matte Black",
    img: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=1000",
    tag: "Trending"
  },
  {
    id: 4,
    name: "Cat Eye Luxe",
    color: "Crystal Clear",
    img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=1000",
    tag: "Limited"
  }
];

export const CollectionPreview: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="collection" className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">The Catalog</span>
            <h2 className="text-3xl md:text-4xl font-serif text-spectra-navy">Launch Collection Preview</h2>
          </div>
          <a href="#membership" className="hidden md:flex items-center gap-2 text-sm font-medium border-b border-black pb-1 hover:opacity-60 transition-opacity">
            View Full Lookbook <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Product Grid - Dribbble Inspiration */}
        <div 
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {products.map((product, index) => (
            <div 
              key={product.id}
              className={`group cursor-pointer transition-all duration-700 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] bg-spectra-card rounded-2xl overflow-hidden mb-4">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                />
                {/* Tag */}
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {product.tag}
                </div>
                {/* Hover Action */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur py-3 text-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm">
                   <span className="text-xs font-bold uppercase">Preview Only</span>
                </div>
              </div>

              {/* Details */}
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-serif font-bold text-lg text-spectra-navy">{product.name}</h3>
                  <span className="text-xs font-bold text-spectra-teal bg-orange-50 px-2 py-1 rounded">BOGO</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{product.color}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
           <a href="#membership" className="inline-flex items-center gap-2 text-sm font-medium border-b border-black pb-1">
            View Full Lookbook <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};