import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const BlogSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <h2 className="text-4xl md:text-5xl font-serif text-center text-spectra-navy mb-16">
           Eyewear Stories, <br/>
           Advice & Insights
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Large Card 1 */}
           <div className={`group cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}>
              <div className="rounded-[2.5rem] overflow-hidden mb-6 relative aspect-[16/10]">
                 <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h3 className="text-2xl font-bold text-spectra-navy mb-3 group-hover:text-spectra-orange transition-colors">
                Exploring the Craftsmanship of Luxury Eyewear Brands
              </h3>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                 <p className="text-xs text-gray-400">Merch 10, 2024</p>
                 <span className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-spectra-navy group-hover:text-white transition-colors">
                   <ArrowRight size={16} />
                 </span>
              </div>
           </div>

           {/* Large Card 2 */}
           <div className={`group cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 delay-100`}>
              <div className="rounded-[2.5rem] overflow-hidden mb-6 relative aspect-[16/10]">
                 <img src="https://images.unsplash.com/photo-1511499767350-a1590fdb2863?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-xl text-xs font-bold uppercase">
                    Tips & Tricks
                 </div>
              </div>
              <h3 className="text-2xl font-bold text-spectra-navy mb-3 group-hover:text-spectra-orange transition-colors">
                10 Must-Have Sunglasses Styles for Summer Season
              </h3>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                 <p className="text-xs text-gray-400">April 24, 2024</p>
                 <span className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-spectra-navy group-hover:text-white transition-colors">
                   <ArrowRight size={16} />
                 </span>
              </div>
           </div>

        </div>
      </div>
    </section>
  );
};