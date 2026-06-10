import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface MembershipOfferProps {
  onNavigate: (page: string) => void;
}

export const MembershipOffer: React.FC<MembershipOfferProps> = ({ onNavigate }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  const benefits = [
    "Get 2 for the price of 1",
    "Everytime, any frame, different prescriptions",
    "For all of 2026",
    "For just 1000 PKR till 1st January"
  ];

  return (
    <section id="membership" className="py-12 md:py-24 bg-spectra-offwhite overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-spectra-teal/10 rounded-full blur-[100px] transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px] transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
        <div 
          ref={ref} 
          className={`bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          
          {/* Left: Content */}
          <div className="p-6 md:p-14 md:w-1/2 flex flex-col justify-center">
            <span className="text-spectra-teal font-bold uppercase tracking-widest text-xs mb-3 md:mb-4">Exclusive Access</span>
            <h2 className="text-3xl md:text-4xl font-serif text-spectra-navy mb-4 md:mb-6">Become a Founding Member</h2>
            <p className="text-gray-500 mb-6 md:mb-8 font-light leading-relaxed text-sm md:text-base">
              Secure your spot in Pakistan's first eyewear club. The PKR 1000 fee locks in your annual membership status before prices increase at launch.
            </p>
            
            <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
              {benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-spectra-navy">
                  <div className="w-5 h-5 rounded-full bg-spectra-teal/10 text-spectra-teal flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="leading-tight">{item}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => onNavigate('membership')}
              className="w-full bg-spectra-navy text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Join for PKR 1000 <ArrowRight size={16} />
            </button>
          </div>

          {/* Right: Visual/Card */}
          <div className="md:w-1/2 bg-gray-50 relative flex items-center justify-center p-6 md:p-12 py-12 md:py-0">
             {/* Subtle Gradient Mesh */}
             <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 opacity-50"></div>
             
             {/* Ambient gradient behind card */}
             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-spectra-teal/30 rounded-full blur-[80px] pointer-events-none transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>

             {/* The Floating Card */}
             <div className="w-full max-w-[340px] md:max-w-sm aspect-[1.58/1] bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl text-white p-5 md:p-6 flex flex-col justify-between relative overflow-hidden border border-white/10 group hover:scale-[1.02] transition-transform duration-500 shrink-0 mx-auto">
                {/* Card Shine Effect */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <div className="flex justify-between items-start z-10">
                  <span className="font-serif font-bold text-lg md:text-xl tracking-wide">MY EYES.</span>
                  <div className="w-8 md:w-10 h-5 md:h-6 rounded bg-gradient-to-r from-yellow-600 to-yellow-400 opacity-80"></div> {/* Chip */}
                </div>

                <div className="z-10 my-2 md:my-0">
                  <div className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-widest mb-0.5 md:mb-1">Member ID</div>
                  <div className="font-mono text-base md:text-lg tracking-widest text-white/90">Your Number/Email</div>
                </div>

                <div className="flex justify-between items-end z-10">
                  <div>
                    <div className="text-[9px] md:text-[10px] text-white/40 uppercase">Holder</div>
                    <div className="font-medium tracking-wide text-xs md:text-sm">FOUNDING MEMBER</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] md:text-[10px] text-white/40 uppercase">Valid</div>
                    <div className="font-medium tracking-wide text-xs md:text-sm">ALL YEAR</div>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};