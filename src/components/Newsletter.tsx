import React from 'react';

export const Newsletter: React.FC = () => {
  return (
    <section className="py-12 bg-white px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto bg-spectra-navy rounded-[3rem] p-8 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Background Texture */}
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1587987746776-302404b98970?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
        </div>
        
        <div className="relative z-10 max-w-xl">
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6">
            Get exclusive updates <br/>
            & eyewear trends.
          </h2>
          <p className="text-gray-400 font-light mb-8">
            Stay ahead in style with our exclusive updates on the latest eyewear trends. Be the first to know about new arrivals.
          </p>
          
          <div className="flex bg-white/10 backdrop-blur rounded-2xl p-2 border border-white/10">
             <input type="email" placeholder="Enter Your Email" className="bg-transparent flex-1 px-4 py-3 text-white placeholder-gray-500 outline-none" />
             <button className="bg-white text-spectra-navy px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
               Subscribe Now
             </button>
          </div>
        </div>

        <div className="relative z-10 hidden md:block w-1/3">
           {/* Image cut-out style */}
           <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" className="w-full h-auto rounded-3xl -rotate-6 border-4 border-white/10" />
        </div>

      </div>
    </section>
  );
};