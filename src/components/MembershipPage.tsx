import React, { useState } from 'react';
import { Check, Star, ShieldCheck, Gift, X, ArrowRight, Smartphone, MessageCircle, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { GoBackButton } from './GoBackButton';

export const MembershipPage: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [phone, setPhone] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      setShowPopup(true);
      setPhone(''); // Clear input after submission
      // Hide popup after 6 seconds automatically or let user close it
      setTimeout(() => setShowPopup(false), 6000);
    }
  };

  const benefits = [
    {
      icon: <Gift size={24} />,
      title: "Buy 1 Get 1 Free Forever",
      desc: "As a founding member, the BOGO offer applies to every purchase you make in 2026. No limits."
    },
    {
      icon: <Star size={24} />,
      title: "Priority Access",
      desc: "Shop the collection 48 hours before the public on January 1st, 2026."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Price Lock",
      desc: "Lock in the PKR 1000 annual rate. Future membership costs will be significantly higher."
    },
    {
        icon: <Check size={24} />,
        title: "Free Face Analysis",
        desc: "Unlimited access to our AI Style Consultant to find your perfect fit."
      }
  ];

  return (
    <section className="min-h-screen bg-white pt-8 md:pt-12 pb-24 md:pb-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-spectra-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-spectra-teal/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-12 relative z-10" ref={ref}>
        
        <GoBackButton />

        {/* Header Section */}
        <div className={`text-center max-w-3xl mx-auto mb-12 md:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-spectra-orange font-bold uppercase tracking-widest text-xs mb-4 block">Limited Time Pre-Launch Offer</span>
          <h1 className="text-4xl md:text-7xl font-serif text-spectra-navy mb-4 md:mb-6">
            Become a <br/> Founding Member
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed px-2">
            Join the exclusive club that is redefining eyewear in Pakistan. Secure your annual pass for just <strong className="text-spectra-navy">PKR 1000</strong>.
          </p>
        </div>

        {/* Main Content: Benefits & Form */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mb-24 md:mb-32">
          
          {/* Left: Benefits Grid */}
          <div className={`flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {benefits.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-100 hover:border-spectra-teal/30 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-spectra-navy mb-4 md:mb-6 group-hover:bg-spectra-navy group-hover:text-white transition-colors shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-spectra-navy mb-2 md:mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Right: Registration Card */}
          <div className={`w-full lg:w-[450px] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-spectra-navy rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
              {/* Card Texture */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                    <div>
                        <h3 className="text-xl md:text-2xl font-serif">Registration</h3>
                        <p className="text-gray-400 text-xs md:text-sm mt-1">Step 1 of 2</p>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-lg text-sm font-bold text-spectra-orange backdrop-blur-sm border border-white/10">
                        PKR 1000
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      placeholder="03XX XXXXXXX" 
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:bg-white/20 focus:border-white/40 outline-none transition-all"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="pt-2 md:pt-4">
                    <button type="submit" className="w-full bg-white text-spectra-navy py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 group shadow-lg">
                       Register Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                    <p className="text-[10px] text-center text-gray-500 mt-4">
                        By clicking register, you agree to receive messages on WhatsApp.
                    </p>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
                <ShieldCheck size={16} /> Secure Registration
            </div>
          </div>
        </div>

        {/* Integrated: How It Works / Simple & Seamless */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-serif text-spectra-navy mb-4">Simple & Seamless</h2>
                <div className="w-12 h-1 bg-spectra-teal mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-8 left-0 w-full h-px bg-gray-200 z-0"></div>
                
                {/* Step 1 */}
                <div className="relative z-10 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm text-center group hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-spectra-offwhite rounded-full flex items-center justify-center text-spectra-navy mb-4 md:mb-6 mx-auto group-hover:bg-spectra-navy group-hover:text-white transition-colors">
                        <Smartphone size={28} md:size={32} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-bold text-spectra-teal uppercase tracking-widest mb-2 block">Step 01</span>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-spectra-navy mb-2 md:mb-3">Register Mobile</h3>
                    <p className="text-gray-500 font-light text-sm leading-relaxed">Join the club. Your digital membership is instantly linked to your phone number.</p>
                </div>
                
                {/* Step 2 */}
                <div className="relative z-10 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm text-center group hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-spectra-offwhite rounded-full flex items-center justify-center text-spectra-navy mb-4 md:mb-6 mx-auto group-hover:bg-spectra-navy group-hover:text-white transition-colors">
                        <MessageCircle size={28} md:size={32} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-bold text-spectra-teal uppercase tracking-widest mb-2 block">Step 02</span>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-spectra-navy mb-2 md:mb-3">WhatsApp Alert</h3>
                    <p className="text-gray-500 font-light text-sm leading-relaxed">Receive your exclusive access code and catalogue link on Jan 1, 2026.</p>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm text-center group hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-spectra-offwhite rounded-full flex items-center justify-center text-spectra-navy mb-4 md:mb-6 mx-auto group-hover:bg-spectra-navy group-hover:text-white transition-colors">
                        <CheckCircle size={28} md:size={32} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-bold text-spectra-teal uppercase tracking-widest mb-2 block">Step 03</span>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-spectra-navy mb-2 md:mb-3">Select & Save</h3>
                    <p className="text-gray-500 font-light text-sm leading-relaxed">Use our Face Shape Analysis to find your fit. BOGO applied automatically.</p>
                </div>
            </div>
        </div>

      </div>

      {/* Black Popup Notification */}
      {showPopup && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6">
          <div className="bg-black text-white p-6 rounded-2xl shadow-2xl flex items-start gap-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
             <div className="p-2 bg-green-500/20 rounded-full shrink-0 text-green-500">
               <Check size={20} />
             </div>
             <div className="flex-1">
               <h3 className="font-bold text-lg mb-1">Registration Successful</h3>
               <p className="text-gray-300 text-sm leading-relaxed">
                 You are registered, our representative will get in touch shortly for further processing or steps.
               </p>
             </div>
             <button 
               onClick={() => setShowPopup(false)}
               className="text-gray-500 hover:text-white transition-colors pt-1"
             >
               <X size={20} />
             </button>
          </div>
        </div>
      )}

    </section>
  );
};