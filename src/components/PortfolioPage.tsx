import React, { useState } from 'react';
import { Sparkles, Eye, Shield, Compass, Check, ArrowRight, X, Layers, Activity } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useNavigate } from 'react-router-dom';

interface CollectionItem {
  id: string;
  name: string;
  category: 'acetate' | 'titanium' | 'sunwear' | 'carbon';
  image: string;
  tagline: string;
  description: string;
  tags: string[];
  specs: {
    weight: string;
    materials: string;
    lensCompatibility: string;
    suitedFaces: string;
    colorways: string[];
  };
  featuredModels: {
    name: string;
    cat: string;
    price: string;
  }[];
}

export const PortfolioPage: React.FC = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.1);
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);
  const [activeFilter, setActiveFilter] = useState<'all' | 'acetate' | 'titanium' | 'sunwear' | 'carbon'>('all');
  const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null);
  const navigate = useNavigate();

  const collections: CollectionItem[] = [
    {
      id: 'acetate',
      name: 'Minimalist Acetate Series',
      category: 'acetate',
      image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800',
      tagline: 'Sculpted from biological organic acetate blocks.',
      description: 'Formed from premium organic cotton linter block-acetate, custom carved and machine tumbled for 72 hours for an incomparable deep luster. Every frame preserves natural marbling, meaning no two pairs in the acetate collection are identical.',
      tags: ['Premium Italian Acetate', 'Classic Heritage', 'Handcrafted'],
      specs: {
        weight: '24g',
        materials: 'Bioplastic Organic Cotton Acetate, Custom Wire Cores',
        lensCompatibility: 'Single-vision, Progressive, High-index Reading',
        suitedFaces: 'Round, Oval, and Heart-shaped faces',
        colorways: ['Obsidian Black', 'Crystal Olive', 'Amber Tortoise']
      },
      featuredModels: [
        { name: 'Retro Roundies', cat: 'Sunglasses', price: '3,500 PKR' },
        { name: 'Wayfarer Lite', cat: 'Sunglasses', price: '12,000 PKR' },
        { name: 'Cat Eye Elegance', cat: 'Eyeglasses', price: '25,000 PKR' },
        { name: 'Amber Classic', cat: 'Sunglasses', price: '16,800 PKR' }
      ]
    },
    {
      id: 'titanium',
      name: 'Titanium Architect Series',
      category: 'titanium',
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800',
      tagline: 'Aerospace-grade structural elegance.',
      description: 'Milled from aerospace-grade surgical titanium, offering unmatched structural elasticity and weighing less than a single sheet of paper. Hand-finished in our high-precision mounting labs for individuals who prioritize clean engineering and minimal weight.',
      tags: ['Surgical Titanium', 'Ultralight', 'Anti-Corrosive'],
      specs: {
        weight: '12g (Ultra Lightweight)',
        materials: 'Pure Grade-5 Titanium, Beta-Titanium Flex Temples',
        lensCompatibility: 'Rimless, Semi-rimless, Ultra-thin High-index',
        suitedFaces: 'Square, Rectangular, and Angular faces',
        colorways: ['Brushed Pewter', 'Satin Gold', 'Midnight Chrome']
      },
      featuredModels: [
        { name: 'Titanium Rectangle', cat: 'Eyeglasses', price: '18,000 PKR' },
        { name: 'Minimalist Gold', cat: 'Eyeglasses', price: '31,000 PKR' },
        { name: 'The Apex Frame', cat: 'Eyeglasses', price: '32,500 PKR' }
      ]
    },
    {
      id: 'sunwear',
      name: 'Horizon Sunwear Edit',
      category: 'sunwear',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
      tagline: 'Optically advanced glare reduction.',
      description: 'Designed for high-contrast visibility and intense high-glare environments. Every lens features multi-layer anti-reflective coatings, polarization filters, and a hydrophobic double-shield to repel water and smudge trails.',
      tags: ['Polarized UV400', 'Double-Sided Coating', 'Glare Reduction'],
      specs: {
        weight: '20g',
        materials: 'Impact-Resistant Polycarbonate Lenses, Acetate Trims',
        lensCompatibility: 'Polarized, Prescription Sunwear, Mirror Coatings',
        suitedFaces: 'All Face Shapes (Classic Universal Fittings)',
        colorways: ['Gradient Blue', 'Emerald Mirror', 'Solid G-15 Green']
      },
      featuredModels: [
        { name: 'Classic Aviator', cat: 'Sunglasses', price: '15,000 PKR' },
        { name: 'Luxury Gold Trim', cat: 'Sunglasses', price: '42,000 PKR' },
        { name: 'Designer Geometric', cat: 'Sunglasses', price: '29,500 PKR' },
        { name: 'Polarized Nomad', cat: 'Sunglasses', price: '19,500 PKR' },
        { name: 'Titanium Pilot', cat: 'Sunglasses', price: '38,000 PKR' }
      ]
    },
    {
      id: 'carbon',
      name: 'Active Carbon Series',
      category: 'carbon',
      image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800',
      tagline: 'High-velocity impact resistance.',
      description: 'Woven carbon fiber composite frames built for active motion. Designed for athletes, motorcyclists, and high-impact daily wear. Incorporates non-slip rubber nose grips that hold position even during heavy perspiration.',
      tags: ['Carbon Fiber', 'Impact Resistant', 'Non-Slip Grips'],
      specs: {
        weight: '18g',
        materials: 'Woven Matrix Carbon Fiber, Thermoplastic Elastomers',
        lensCompatibility: 'High-index Impact Resistant Polycarbonate',
        suitedFaces: 'Oval, Round, and Diamond face structures',
        colorways: ['Matte Carbon', 'Carbon Crimson', 'Carbon Cobalt']
      },
      featuredModels: [
        { name: 'Active Sport', cat: 'Sunglasses', price: '11,000 PKR' },
        { name: 'Sport Performance', cat: 'Sunglasses', price: '22,000 PKR' },
        { name: 'Elite Carbon Pro', cat: 'Sunglasses', price: '38,500 PKR' },
        { name: 'Carbon Vector', cat: 'Sunglasses', price: '26,000 PKR' }
      ]
    }
  ];

  const filteredCollections = activeFilter === 'all' 
    ? collections 
    : collections.filter(c => c.category === activeFilter);

  const handleShopRedirect = (category: string) => {
    if (category.toLowerCase() === 'sunglasses') {
      navigate('/sunglasses');
    } else {
      navigate('/eyeglasses');
    }
  };

  return (
    <div className="bg-spectra-cream dark:bg-spectra-dark-bg min-h-screen transition-colors duration-300 pb-24">
      
      {/* Premium Hero Header */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-white dark:bg-spectra-dark-surface border-b border-spectra-border dark:border-spectra-dark-border">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-spectra-orange/5 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10 text-center" ref={headerRef}>
          <div className={`transition-all duration-1000 transform ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-spectra-orange text-xs font-bold uppercase tracking-widest inline-block mb-6 shadow-sm">
              Creative Lookbook
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold italic text-spectra-navy dark:text-white mb-6">
              The Lookbooks
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
              Explore the design principles, structural elements, and signature materials that define our seasonal curated collections.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 md:mt-16 flex justify-center">
        <div className="flex flex-wrap gap-2 p-1.5 bg-white dark:bg-spectra-dark-surface border border-spectra-border dark:border-spectra-dark-border rounded-2xl shadow-sm">
          {(['all', 'acetate', 'titanium', 'sunwear', 'carbon'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeFilter === filter
                  ? 'bg-spectra-navy dark:bg-spectra-orange text-white shadow-sm'
                  : 'text-gray-500 dark:text-spectra-dark-muted hover:text-spectra-navy dark:hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Collections */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 md:mt-16" ref={gridRef}>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-1000 transform ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {filteredCollections.map((col) => (
            <div
              key={col.id}
              className="bg-white dark:bg-spectra-dark-surface rounded-[2rem] border border-spectra-border dark:border-spectra-dark-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full"
            >
              {/* Image Container with Zoom */}
              <div className="relative h-64 md:h-80 overflow-hidden shrink-0">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                  {col.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8 flex flex-col flex-grow justify-between gap-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-serif font-bold text-spectra-navy dark:text-white group-hover:text-spectra-orange transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-spectra-orange font-bold uppercase tracking-wider">{col.tagline}</p>
                  <p className="text-sm text-gray-500 dark:text-spectra-dark-muted leading-relaxed font-light">
                    {col.description.substring(0, 160)}...
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-spectra-dark-border pt-6">
                  <span className="text-xs text-gray-400 font-light">Featured: {col.featuredModels.length} Models</span>
                  <button
                    onClick={() => setSelectedCollection(col)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-spectra-navy dark:text-white hover:text-spectra-orange dark:hover:text-spectra-orange transition-colors"
                  >
                    Explore Details
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lookbook Drawer Modal */}
      {selectedCollection && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedCollection(null)}
          />

          {/* Slide-over Panel */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-spectra-dark-surface h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
            
            {/* Header / Cover */}
            <div className="relative h-64 md:h-80 shrink-0">
              <img
                src={selectedCollection.image}
                alt={selectedCollection.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <button
                onClick={() => setSelectedCollection(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/65 transition-all"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-8 left-8 right-8 space-y-2 text-white">
                <span className="px-3 py-1 rounded-full bg-spectra-orange text-[10px] font-bold uppercase tracking-wider inline-block">
                  Curated Series
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold">{selectedCollection.name}</h2>
                <p className="text-xs text-gray-300 font-light">{selectedCollection.tagline}</p>
              </div>
            </div>

            {/* Spec Panel details */}
            <div className="p-8 space-y-8 flex-grow">
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Craftsmanship Story</h4>
                <p className="text-sm text-gray-500 dark:text-spectra-dark-muted leading-relaxed font-light">
                  {selectedCollection.description}
                </p>
              </div>

              {/* Spec Grid */}
              <div className="bg-spectra-cream dark:bg-spectra-dark-card p-6 rounded-2xl border border-spectra-border dark:border-spectra-dark-border space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-spectra-navy dark:text-white flex items-center gap-2">
                  <Layers size={14} className="text-spectra-orange" />
                  Engineering Specifications
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-gray-400 font-light">Structure Weight</p>
                    <p className="font-bold text-spectra-navy dark:text-white">{selectedCollection.specs.weight}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-light">Primary Materials</p>
                    <p className="font-bold text-spectra-navy dark:text-white">{selectedCollection.specs.materials}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-light">Lens Compatibility</p>
                    <p className="font-bold text-spectra-navy dark:text-white">{selectedCollection.specs.lensCompatibility}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-light">Suited Face Structures</p>
                    <p className="font-bold text-spectra-navy dark:text-white">{selectedCollection.specs.suitedFaces}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-gray-400 font-light">Signature Colorways</p>
                    <div className="flex gap-2 mt-1">
                      {selectedCollection.specs.colorways.map((col, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded bg-white dark:bg-spectra-dark-surface border border-gray-250 dark:border-spectra-dark-border font-medium text-spectra-navy dark:text-spectra-dark-text"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Models Available */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Featured Models inside Lookbook</h4>
                <div className="space-y-3">
                  {selectedCollection.featuredModels.map((model, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white dark:bg-spectra-dark-card border border-spectra-border dark:border-spectra-dark-border rounded-xl hover:border-spectra-orange/50 transition-all"
                    >
                      <div>
                        <h5 className="font-bold text-sm text-spectra-navy dark:text-white">{model.name}</h5>
                        <p className="text-[10px] text-gray-400 font-light">{model.cat} Category</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-sm text-spectra-orange">{model.price}</span>
                        <button
                          onClick={() => {
                            setSelectedCollection(null);
                            handleShopRedirect(model.cat);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-spectra-navy text-white text-[10px] font-bold hover:bg-spectra-orange transition-colors"
                        >
                          Shop Model
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Actions footer */}
            <div className="p-6 border-t border-spectra-border dark:border-spectra-dark-border bg-spectra-cream dark:bg-spectra-dark-card shrink-0 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-light">Handcrafted in elite eyewear hubs</span>
              <button
                onClick={() => {
                  setSelectedCollection(null);
                  navigate('/products');
                }}
                className="flex items-center gap-2 bg-spectra-navy dark:bg-spectra-orange text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-sm"
              >
                Browse All Products
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
