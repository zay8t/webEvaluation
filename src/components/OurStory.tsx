import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const OurStory: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section id="story" className="py-32 bg-spectra-light relative overflow-hidden">
      {/* Background Blobs */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-spectra-teal/5 rounded-full blur-[150px] pointer-events-none transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
        <div 
          ref={ref} 
          className={`transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-serif text-spectra-navy mb-10 leading-tight">
            Luxury is not a price tag.<br/>
            <span className="italic text-spectra-teal">It is a standard.</span>
          </h2>
          
          <div className="space-y-8 text-gray-600 font-light text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            <p>
              In a market saturated with markups, we chose a different path. 
            </p>
            <p>
              We source directly from <strong className="text-spectra-navy font-bold">world-class Chinese manufacturers</strong>—the same factories that produce for leading high-street brands. By completely cutting out the middlemen, importers, and retailers, we make the impossible possible.
            </p>
            <p className="text-base text-spectra-navy font-bold uppercase tracking-widest mt-8">
               No intermediaries. No retail rent. Just great vision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};