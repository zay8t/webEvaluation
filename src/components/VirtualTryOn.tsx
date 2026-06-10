import React from 'react';
import { Camera, CheckCircle, Eye } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const VirtualTryOn: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="try-on" className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div ref={ref} className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Text */}
          <div className={`flex-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
             <h2 className="text-4xl md:text-6xl font-sans font-bold text-spectra-navy mb-8 leading-tight">
               Try your favourite <br/>
               frames virtually
             </h2>
             
             <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-spectra-navy">
                      <Camera size={20} />
                   </div>
                   <span className="text-gray-600 font-medium">Activate your camera or upload a photo</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-spectra-navy">
                      <CheckCircle size={20} />
                   </div>
                   <span className="text-gray-600 font-medium">Select your favorite frames</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-spectra-navy">
                      <Eye size={20} />
                   </div>
                   <span className="text-gray-600 font-medium">See them in real time</span>
                </div>
             </div>

             <button className="bg-spectra-navy text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg">
                Try it Now
             </button>
          </div>

          {/* Right: Image */}
          <div className={`flex-1 w-full relative transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
             <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-[3rem] overflow-hidden shadow-2xl bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1590419690008-90530392b450?auto=format&fit=crop&q=80&w=800" 
                  alt="Virtual Try On Model" 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay UI Mockup */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-center bg-white/30 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                    <span className="text-white text-xs font-bold">Scanning Face...</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                   <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white cursor-pointer hover:bg-white/40 transition-colors"></div>
                   <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white cursor-pointer hover:bg-white/40 transition-colors border-2 border-spectra-orange"></div>
                   <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white cursor-pointer hover:bg-white/40 transition-colors"></div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};