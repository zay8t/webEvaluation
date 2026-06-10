import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Smartphone, MessageCircle, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white">
      <div ref={ref} className="max-w-5xl mx-auto px-6 md:px-12">
        <div 
          className={`text-center mb-12 md:mb-16 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-serif text-spectra-navy mb-4">
            Simple & Seamless
          </h2>
          <div className="w-12 h-1 bg-spectra-teal mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-px bg-gray-100 z-0"></div>

          <Step 
            icon={<Smartphone size={32} strokeWidth={1.5} />}
            num="01"
            title="Register Mobile"
            desc="Join the club. Your digital membership is instantly linked to your phone number."
            delay={200}
            parentVisible={isVisible}
          />
          <Step 
            icon={<MessageCircle size={32} strokeWidth={1.5} />}
            num="02"
            title="WhatsApp Alert"
            desc="Receive your exclusive access code and catalogue link on Jan 1, 2026."
            delay={400}
            parentVisible={isVisible}
          />
          <Step 
            icon={<CheckCircle size={32} strokeWidth={1.5} />}
            num="03"
            title="Select & Save"
            desc="Use our Face Shape Analysis to find your fit. BOGO applied automatically."
            delay={600}
            parentVisible={isVisible}
          />
        </div>
      </div>
    </section>
  );
};

const Step: React.FC<{ icon: React.ReactNode; num: string; title: string; desc: string; delay: number; parentVisible: boolean }> = ({ icon, num, title, desc, delay, parentVisible }) => (
  <div 
    className={`relative z-10 bg-white p-6 group transition-all duration-1000 ease-out transform ${
      parentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-spectra-offwhite rounded-full flex items-center justify-center text-spectra-navy mb-6 group-hover:bg-spectra-navy group-hover:text-white transition-colors duration-300 shadow-sm">
        {icon}
      </div>
      <span className="text-xs font-bold text-spectra-teal uppercase tracking-widest mb-2">Step {num}</span>
      <h3 className="text-xl font-serif font-bold text-spectra-navy mb-3">{title}</h3>
      <p className="text-gray-500 font-light text-sm leading-relaxed max-w-xs">{desc}</p>
    </div>
  </div>
);