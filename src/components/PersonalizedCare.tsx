import React from 'react';
import { ScanFace, User, Stethoscope, FileText } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const PersonalizedCare: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <h2 className="text-4xl md:text-5xl font-serif text-center text-spectra-navy mb-16">
          Personalized vision <br/>
          care for you
        </h2>

        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
           {/* Card 1: Recommendations (Lavender) */}
           <div className={`bg-[#F0F4FF] p-8 md:p-12 rounded-[2.5rem] flex flex-col justify-between min-h-[300px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                 <span className="font-mono text-xs font-bold">01</span>
              </div>
              <div>
                <div className="mb-4 text-spectra-navy"><ScanFace size={32} /></div>
                <h3 className="text-2xl font-sans font-semibold mb-3 text-spectra-navy">Personalized<br/>Recommendations</h3>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                   Recommendation help you find the perfect frames that fit your unique needs.
                </p>
              </div>
           </div>

           {/* Card 2: Custom Fit (Light Gray) */}
           <div className={`bg-gray-50 p-8 md:p-12 rounded-[2.5rem] flex flex-col justify-between min-h-[300px] transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                 <span className="font-mono text-xs font-bold">02</span>
              </div>
              <div>
                <div className="mb-4 text-spectra-navy"><User size={32} /></div>
                <h3 className="text-2xl font-sans font-semibold mb-3 text-spectra-navy">Custom Fit<br/>Frame</h3>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                   Get expert recommendations tailored to your face shape and personal style.
                </p>
              </div>
           </div>

           {/* Card 3: Consultation (Pinkish) */}
           <div className={`bg-[#FFF0F5] p-8 md:p-12 rounded-[2.5rem] flex flex-col justify-between min-h-[300px] transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                 <span className="font-mono text-xs font-bold">03</span>
              </div>
              <div>
                <div className="mb-4 text-spectra-navy"><Stethoscope size={32} /></div>
                <h3 className="text-2xl font-sans font-semibold mb-3 text-spectra-navy">Eyecare<br/>Consultation</h3>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                   Receive expert guidance tailored to your vision needs with our eyecare consultations.
                </p>
              </div>
           </div>

           {/* Card 4: Prescription (Beige) */}
           <div className={`bg-[#F5F5DC] p-8 md:p-12 rounded-[2.5rem] flex flex-col justify-between min-h-[300px] transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                 <span className="font-mono text-xs font-bold">04</span>
              </div>
              <div>
                <div className="mb-4 text-spectra-navy"><FileText size={32} /></div>
                <h3 className="text-2xl font-sans font-semibold mb-3 text-spectra-navy">Prescription<br/>Glasses</h3>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                   We'll guide you to the ideal glasses that enhance your vision and fit your style.
                </p>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};