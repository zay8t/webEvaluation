import React, { useState } from 'react';
import { Bell, Check, Info } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { GoBackButton } from './GoBackButton';

export const PrescriptionPage: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(phone) {
        setSubmitted(true);
    }
  };

  const lensPowers = [
    { index: "1.56 Standard", sph: "+/- 12.00", cyl: "+/- 6.00" },
    { index: "1.61 Mid", sph: "+/- 12.00", cyl: "+/- 6.00" },
    { index: "1.67 High", sph: "+/- 12.00", cyl: "+/- 6.00" },
    { index: "1.74 Ultra High", sph: "-16.00", cyl: "-4.00" },
  ];

  const lensOptions = [
    { name: "Blue Light Block", desc: "Filters harmful blue light from screens." },
    { name: "Anti-Reflective (AR)", desc: "Reduces glare for night driving & photos." },
    { name: "Photochromic", desc: "Transitions to dark sunglasses outdoors." },
    { name: "UV Blocking", desc: "100% protection against harmful UVA/UVB rays." },
    { name: "Scratch Resistant (Hard Coated)", desc: "Durable coating to prevent scratches and scuffs." },
    { name: "Progressives", desc: "Multifocal lenses for near & far distance." },
  ];

  return (
    <section className="min-h-screen bg-spectra-offwhite py-8 md:py-12 px-4 md:px-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10" ref={ref}>
        <GoBackButton />
        
        <div className={`text-center mb-10 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs md:text-sm font-bold uppercase tracking-widest mb-6">
                Medical Grade Accuracy
            </div>
            <h1 className="text-3xl md:text-6xl font-serif text-spectra-navy mb-4 md:mb-6">
                Advanced Lens Technology
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed px-2">
                We support complex prescriptions with premium Japanese and German lens technology. 
                Launching Jan 1st, 2026.
            </p>
        </div>

        {/* Lens Power Table */}
        <div className={`bg-white rounded-2xl md:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-12 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg md:text-xl font-bold text-spectra-navy flex items-center gap-2">
                    <Info size={20} className="text-spectra-teal" />
                    Available Power Ranges
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm md:text-base">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 font-medium uppercase text-xs tracking-wider border-b border-gray-100">
                            <th className="px-3 py-3 md:px-6 md:py-4">Lens Index</th>
                            <th className="px-3 py-3 md:px-6 md:py-4">Sphere (SPH)</th>
                            <th className="px-3 py-3 md:px-6 md:py-4">Cylinder (CYL)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {lensPowers.map((lens, i) => (
                            <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-3 py-3 md:px-6 md:py-4 font-bold text-spectra-navy whitespace-nowrap">{lens.index}</td>
                                <td className="px-3 py-3 md:px-6 md:py-4 text-gray-600 whitespace-nowrap">{lens.sph}</td>
                                <td className="px-3 py-3 md:px-6 md:py-4 text-gray-600 whitespace-nowrap">{lens.cyl}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Lens Options Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
             {lensOptions.map((opt, i) => (
                 <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                     <div className="w-8 h-8 rounded-full bg-spectra-orange/10 flex items-center justify-center shrink-0 mt-1">
                         <div className="w-2 h-2 bg-spectra-orange rounded-full"></div>
                     </div>
                     <div>
                         <h3 className="font-bold text-spectra-navy mb-1">{opt.name}</h3>
                         <p className="text-sm text-gray-500">{opt.desc}</p>
                     </div>
                 </div>
             ))}
        </div>

        {/* Notification CTA */}
        <div className={`bg-spectra-navy rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 text-center text-white relative overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-serif mb-4">Get Notified at Launch</h2>
                <p className="text-gray-300 mb-8 max-w-lg mx-auto text-sm md:text-base">
                    Sign up to receive the full lens catalog and price list on WhatsApp when we go live.
                </p>

                {!submitted ? (
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                    <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                        type="tel" 
                        placeholder="Enter WhatsApp Number" 
                        className="flex-1 px-6 py-4 rounded-xl border border-transparent bg-white text-spectra-navy placeholder-gray-400 focus:ring-2 focus:ring-spectra-orange outline-none transition-all shadow-lg"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <button type="submit" className="bg-spectra-orange text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg w-full sm:w-auto">
                        <Bell size={18} />
                        Notify Me
                    </button>
                    </div>
                </form>
                ) : (
                <div className="bg-green-500/20 border border-green-500/30 p-6 rounded-xl inline-block animate-in fade-in zoom-in">
                    <div className="flex items-center gap-3 text-green-300">
                        <Check size={20} />
                        <span className="font-bold">We'll notify you on {phone}</span>
                    </div>
                </div>
                )}
            </div>
        </div>

      </div>
    </section>
  );
};