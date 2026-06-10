import React, { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { GoBackButton } from './GoBackButton';

interface ComingSoonPageProps {
  category: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ category }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(phone) {
        setSubmitted(true);
        // Here you would typically send the data to a backend
    }
  };

  return (
    <section className="min-h-[85vh] bg-spectra-offwhite relative overflow-hidden">
       {/* Background Decorative Elements */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-spectra-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-96 h-96 bg-spectra-teal/5 rounded-full blur-[100px] pointer-events-none"></div>

       <div className="max-w-3xl w-full mx-auto px-4 md:px-12 py-12 relative z-10" ref={ref}>
          <GoBackButton />
          
          <div className={`text-center mt-8 md:mt-12 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-spectra-orange text-xs md:text-sm font-bold uppercase tracking-widest mb-6 md:mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-spectra-orange animate-pulse"></span>
                Launching Jan 1st, 2026
            </div>

            <h1 className="text-4xl md:text-7xl font-sans font-bold text-spectra-navy mb-6 md:mb-8 leading-[1.1]">
              The Ultimate Collection of <br/>
              <span className="text-spectra-orange relative inline-block">
                {category}
                <svg className="absolute w-full h-2 md:h-3 -bottom-1 md:-bottom-2 left-0 text-spectra-amber opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
              We are curating hundreds of premium styles for <strong className="text-spectra-navy">Males, Females, and Kids</strong>. 
              From classic shapes to bold statements, experience the perfect fit with our AI try on service.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto relative group px-2 md:px-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="tel" 
                    placeholder="Enter WhatsApp Number" 
                    className="flex-1 px-6 py-4 rounded-xl border border-gray-200 focus:border-spectra-orange outline-none bg-white shadow-sm transition-all focus:shadow-md text-spectra-navy placeholder-gray-400 w-full"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <button type="submit" className="bg-spectra-navy text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 w-full sm:w-auto">
                    <Bell size={18} />
                    Get Notified
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-4 font-medium">
                  Be the first to know when the collection drops.
                </p>
              </form>
            ) : (
              <div className="bg-green-50 border border-green-100 p-8 rounded-2xl max-w-md mx-auto animate-in fade-in zoom-in duration-500">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4 shadow-sm">
                  <Check size={28} strokeWidth={3} />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">You're on the list!</h3>
                <p className="text-green-600 leading-relaxed">We'll send a WhatsApp message to <strong>{phone}</strong> as soon as our {category.toLowerCase()} collection is live.</p>
                <button onClick={() => setSubmitted(false)} className="text-xs font-bold uppercase tracking-wider text-green-700 mt-4 hover:underline">Register another number</button>
              </div>
            )}

          </div>
       </div>
    </section>
  );
};