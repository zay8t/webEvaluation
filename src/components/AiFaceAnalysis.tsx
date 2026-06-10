import React from 'react';
import { ScanFace, Sparkles, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const AiFaceAnalysis: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-12 md:py-16 bg-white relative">
      <div className="max-w-5xl mx-auto px-6 md:px-12" ref={ref}>
        <div 
          className={`bg-gradient-to-br from-blue-50 to-white rounded-[2.5rem] p-8 md:p-12 border border-blue-100 flex flex-col md:flex-row items-center gap-8 md:gap-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Icon/Visual Side */}
          <div className="shrink-0 relative">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-md">
                <ScanFace size={48} strokeWidth={1.2} />
             </div>
             <div className="absolute -top-3 -right-3 bg-spectra-navy text-white px-3 py-1.5 rounded-full border-[3px] border-white shadow-sm flex items-center gap-1.5">
                <Sparkles size={12} className="text-spectra-orange" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Coming Soon</span>
             </div>
          </div>

          {/* Text Content Side */}
          <div className="text-center md:text-left flex-1">
             <h3 className="text-2xl md:text-3xl font-serif text-spectra-navy mb-4">
               AI Face Shape Consultant
             </h3>
             <p className="text-gray-600 mb-6 leading-relaxed">
                Don't know what suits you? Simply upload a selfie. Our AI analyzes your facial structure to identify your face shape and instantly recommends the specific frames and sunglasses from our collection that will look best on you.
             </p>
             <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/50 px-3 py-1.5 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  Personalized Curation
               </div>
               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <ArrowRight size={14} />
                  Free Feature
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};