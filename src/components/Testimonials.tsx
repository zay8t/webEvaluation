import React from 'react';
import { Star } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const Testimonials: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="testimonials" className="py-16 md:py-32 bg-white relative overflow-hidden">
      
      {/* Ambient Gradient Blobs */}
      <div className={`absolute top-1/4 left-0 w-[500px] h-[500px] bg-orange-50 rounded-full blur-[120px] -translate-x-1/3 pointer-events-none transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] bg-spectra-teal/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <h2 className="text-center text-xs md:text-sm uppercase tracking-[0.3em] text-spectra-navy font-bold mb-12 md:mb-16 opacity-80">
          See what our early adopters are saying
        </h2>
        
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <Testimonial 
            quote="Finally, a service that gets it. The BOGO offer is zabardast, the frame quality is perfect. The bogo offer is spot on."
            author="Ahsan K."
            loc="Islamabad"
            delay={0}
            parentVisible={isVisible}
          />
          <Testimonial 
            quote="I visited the pop-up in Rawalpindi. The finish is bohot ala (very good), rivals my imported pairs. Mazay ki quality hai for the price."
            author="Zara M."
            loc="Bahria Town"
            delay={200}
            parentVisible={isVisible}
          />
        </div>
      </div>
    </section>
  );
};

const Testimonial: React.FC<{ quote: string; author: string; loc: string; delay: number; parentVisible: boolean }> = ({ quote, author, loc, delay, parentVisible }) => (
  <div 
    className={`relative bg-white border border-gray-100 p-8 md:p-12 rounded-[2rem] md:rounded-3xl shadow-sm hover:shadow-md transition-all duration-1000 ease-out transform group ${
      parentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
    }`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="flex gap-1 mb-6 md:mb-8">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14} className="fill-spectra-teal text-spectra-teal" />
      ))}
    </div>
    
    <blockquote className="font-serif text-xl md:text-2xl text-spectra-navy leading-snug italic mb-6 md:mb-8">
      "{quote}"
    </blockquote>
    
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-spectra-navy font-bold text-xs">
        {author.charAt(0)}
      </div>
      <div>
        <p className="font-bold text-sm uppercase tracking-widest text-spectra-navy">{author}</p>
        <p className="text-xs text-gray-400 mt-0.5 font-serif italic">{loc}</p>
      </div>
    </div>
  </div>
);