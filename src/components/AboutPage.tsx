import React from 'react';
import { Eye, Shield, Award, AwardIcon, Compass } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const AboutPage: React.FC = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.1);
  
  const stats = [
    { value: '100%', label: 'Certified Lenses' },
    { value: '24h', label: 'Islamabad / Rawalpindi Delivery' },
    { value: '10k+', label: 'Happy Customers' },
    { value: '0', label: 'Middleman Markup' }
  ];

  const coreValues = [
    {
      icon: <Eye className="text-spectra-orange" size={28} />,
      title: 'Optician-Approved Lenses',
      desc: 'Every single lens prescription is hand-reviewed and verified by certified laboratory opticians before mounting.'
    },
    {
      icon: <Shield className="text-spectra-orange" size={28} />,
      title: 'Premium Handcrafted Frames',
      desc: 'Our frames use block-cut Italian acetate, aerospace-grade carbon fiber, and lightweight surgical titanium.'
    },
    {
      icon: <Award className="text-spectra-orange" size={28} />,
      title: 'Direct Manufacturing',
      desc: 'We cut retail markups. By sourcing directly from the worlds leading eyewear factories, we deliver luxury at retail cost.'
    },
    {
      icon: <Compass className="text-spectra-orange" size={28} />,
      title: 'Digital Prescription Tailoring',
      desc: 'We map facial frame dimensions to align lens centers perfectly with your pupillary distance (PD).'
    }
  ];

  return (
    <div className="bg-spectra-cream dark:bg-spectra-dark-bg min-h-screen transition-colors duration-300">
      
      {/* Premium Hero Header */}
      <section className="py-20 md:py-32 relative overflow-hidden bg-white dark:bg-spectra-dark-surface border-b border-spectra-border dark:border-spectra-dark-border">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-spectra-orange/5 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10 text-center" ref={headerRef}>
          <div className={`transition-all duration-1000 transform ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-spectra-orange text-xs font-bold uppercase tracking-widest inline-block mb-6 shadow-sm">
              Our Vision
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold italic text-spectra-navy dark:text-white mb-6">
              About MY EYES
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
              We started with a simple hypothesis: premium custom eyewear should be accessible, medically flawless, and priced transparently.
            </p>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-16 md:py-24 max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-spectra-navy dark:text-white mb-6 leading-tight">
            Luxury is not a price tag.<br/>
            <span className="italic text-spectra-orange">It is a standard.</span>
          </h2>
          <div className="space-y-6 text-gray-600 dark:text-gray-400 font-light text-base leading-relaxed">
            <p>
              Traditional retailers markup glasses up to <strong>1000%</strong> to cover license fees, distribution middlemen, and expensive physical showrooms.
            </p>
            <p>
              At <strong className="text-spectra-navy dark:text-white font-bold">MY EYES</strong>, we work directly with the world's elite manufacturers—the same factories that fabricate frames for luxury designer houses. By bypassing importers, distributors, and physical store rentals, we bring top-tier optics straight to your doorstep.
            </p>
            <p>
              Our custom prescription lenses use advanced double-sided coatings to provide UV400 block, multi-layer anti-reflective shielding, and high-performance blue light protection.
            </p>
          </div>
        </div>
        
        {/* Visual Callout */}
        <div className="bg-spectra-navy text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-spectra-orange/10 to-transparent"></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-spectra-amber">Our Quality Code</h3>
            <p className="text-2xl font-serif italic font-light leading-relaxed">
              "We believe that vision correction is health care first, and luxury fashion second. We never compromise on lens integrity."
            </p>
            <div className="pt-6 border-t border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-spectra-orange">
                <Shield size={24} />
              </div>
              <div>
                <h5 className="font-bold text-sm">Optician-Certified</h5>
                <p className="text-xs text-white/50">Islamabad Laboratory, PK</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-white dark:bg-spectra-dark-surface border-y border-spectra-border dark:border-spectra-dark-border py-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-2 border-r last:border-r-0 border-gray-150 dark:border-spectra-dark-border/50">
              <h3 className="text-3xl md:text-4xl font-bold text-spectra-orange font-sans tracking-tight">{stat.value}</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-20 md:py-28 max-w-[1440px] mx-auto px-6 md:px-12 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-serif font-bold text-spectra-navy dark:text-white">Our Foundations</h2>
          <p className="text-gray-500 text-sm">Every pair of glasses we build rests upon three fundamental guarantees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coreValues.map((value, idx) => (
            <div key={idx} className="bg-white dark:bg-spectra-dark-surface p-8 rounded-3xl border border-spectra-border dark:border-spectra-dark-border hover:shadow-lg transition-all duration-300 flex items-start gap-6">
              <div className="p-4 bg-orange-50 dark:bg-spectra-dark-card rounded-2xl flex-shrink-0">
                {value.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-spectra-navy dark:text-white">{value.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light">{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
