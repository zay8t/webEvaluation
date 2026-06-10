import React, { useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const LensFeatures: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
        id: "01",
        title: "Blue Light Filter",
        desc: "Blocks harmful high-energy blue light from digital screens.",
        graphicClass: "bg-gradient-to-br from-blue-100 to-transparent",
        overlay: (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-200 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-transparent"></div>
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-400/50 rotate-45"></div>
                </div>
            </div>
        )
    },
    {
        id: "02",
        title: "Anti-Reflective",
        desc: "Eliminates glare for crystal clear vision day and night.",
        graphicClass: "bg-gradient-to-br from-green-50 to-transparent",
        overlay: (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-transparent border border-gray-200 relative">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-transparent rotate-12"></div>
                </div>
            </div>
        )
    },
    {
        id: "03",
        title: "UV 400 Protection",
        desc: "100% protection against UVA & UVB rays.",
        graphicClass: "bg-gradient-to-br from-orange-50 to-transparent",
        overlay: (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-orange-500/5 border border-orange-200 relative overflow-hidden">
                     <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-400 rounded-full blur-xl"></div>
                </div>
            </div>
        )
    },
    {
        id: "04",
        title: "Scratch Resistant",
        desc: "Hard-coated surface to withstand daily wear and tear.",
        graphicClass: "bg-gradient-to-br from-gray-100 to-transparent",
        overlay: (
            <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-24 h-24 rounded-full bg-gray-200/20 border border-gray-300 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-white rotate-12 shadow-sm"></div>
                    <div className="w-full h-[1px] bg-white -rotate-12 shadow-sm absolute"></div>
                 </div>
            </div>
        )
    },
    {
        id: "05",
        title: "Light Responsive",
        desc: "Smart photosensitive lenses that darken in sunlight and clear up indoors.",
        graphicClass: "bg-gradient-to-br from-yellow-100 via-gray-100 to-gray-600",
        overlay: (
            <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-24 h-24 rounded-full bg-white/10 border border-gray-300 relative overflow-hidden">
                    {/* Gradient transition representing darkening */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black/60"></div>
                    {/* Sun/Light effect */}
                    <div className="absolute top-6 right-6 w-8 h-8 bg-white/20 rounded-full blur-md"></div>
                 </div>
            </div>
        )
    }
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section id="lenses" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Custom Styles to force hide scrollbar across browsers */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header + Desktop Controls */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-serif text-spectra-navy mb-4">Available Lens Options</h2>
                <p className="text-gray-500">Choose from different specs or lens tech.</p>
            </div>
            
            {/* Desktop Arrows - Hidden on Mobile */}
            <div className="hidden md:flex gap-4 mt-6 md:mt-0">
                <button 
                    onClick={scrollLeft}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-spectra-navy hover:bg-spectra-navy hover:text-white transition-all hover:scale-110 active:scale-95"
                >
                    <ChevronLeft size={24} />
                </button>
                <button 
                    onClick={scrollRight}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-spectra-navy hover:bg-spectra-navy hover:text-white transition-all hover:scale-110 active:scale-95"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
        
        {/* Horizontal Scroll Container */}
        <div 
          ref={ref}
          className={`relative -mx-6 px-6 md:mx-0 md:px-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
             <div 
                ref={scrollContainerRef}
                className="flex gap-8 overflow-x-auto snap-x hide-scrollbar pb-12 pt-4 pl-2"
             >
                {features.map((feature, index) => (
                    <div 
                    key={feature.id}
                    className="snap-center shrink-0 w-[320px] bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 border border-gray-50 flex flex-col items-center text-center group"
                    >
                    <div className={`w-full aspect-square rounded-[2rem] mb-8 relative overflow-hidden ${feature.graphicClass} group-hover:scale-105 transition-transform duration-500`}>
                        {feature.overlay}
                        <div className="absolute top-5 left-5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-spectra-navy shadow-sm">
                            {feature.id}
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-spectra-navy mb-3">{feature.title}</h3>
                    <p className="text-gray-500 leading-relaxed">
                        {feature.desc}
                    </p>
                    </div>
                ))}
                
                {/* Spacer for right padding */}
                <div className="w-2 shrink-0"></div>
             </div>
        </div>

        {/* Mobile Arrows - Visible only on Mobile, placed below content */}
        <div className="flex md:hidden justify-center gap-4 mt-8">
            <button 
                onClick={scrollLeft}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-spectra-navy hover:bg-spectra-navy hover:text-white transition-all active:scale-95 bg-white shadow-sm"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={scrollRight}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-spectra-navy hover:bg-spectra-navy hover:text-white transition-all active:scale-95 bg-white shadow-sm"
            >
                <ChevronRight size={24} />
            </button>
        </div>

      </div>
    </section>
  );
};