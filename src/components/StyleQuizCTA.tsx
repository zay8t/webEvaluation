import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const StyleQuizCTA: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        <div 
          ref={ref}
          className={`bg-spectra-offwhite rounded-[3rem] p-12 text-center relative overflow-hidden transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-spectra-teal rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-spectra-navy rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-spectra-teal">
              <Sparkles size={32} />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif text-spectra-navy mb-4">
              Not sure what fits you?
            </h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto text-lg font-light">
              Skip the browsing. Our AI-powered Face Shape Analysis recommends the perfect frames for your unique structure.
            </p>
            
            <button className="bg-spectra-navy text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest hover:scale-105 transition-transform flex items-center gap-3 shadow-xl">
              Take Style Quiz <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};