import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const services = [
  { title: "Eye Exam", price: 158.00, img: "https://images.unsplash.com/photo-1589793463308-65868f660848?auto=format&fit=crop&q=80&w=400" },
  { title: "Lens Fitting", price: 130.00, img: "https://images.unsplash.com/photo-1663151064065-cb334788f77d?auto=format&fit=crop&q=80&w=400" },
  { title: "Vision Testing", price: 118.00, img: "https://images.unsplash.com/photo-1677773382668-8a84321836e9?auto=format&fit=crop&q=80&w=400" },
  { title: "Corneal Map", price: 133.00, img: "https://images.unsplash.com/photo-1705357311681-17449eb278d1?auto=format&fit=crop&q=80&w=400" },
];

export const ServicesGrid: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <h2 className="text-4xl md:text-5xl font-serif text-center text-spectra-navy mb-16">
          We Provide <br/>
          Services for You
        </h2>

        <div 
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <div 
              key={index}
              className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="p-6 pb-2 flex justify-between items-center">
                <span className="font-medium text-spectra-navy flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-spectra-navy"></span> {service.title}
                </span>
                <span className="font-bold text-gray-500">${service.price}</span>
              </div>
              
              <div className="px-4 pb-4">
                 <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
                    <img src={service.img} alt={service.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                       View Services
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