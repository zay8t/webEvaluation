import React from 'react';
import { UserCheck, MessageCircle, Truck } from 'lucide-react';
import { HeroSection } from './HeroSection';
import { MembershipOffer } from './MembershipOffer';
import { Testimonials } from './Testimonials';
import { FAQ } from './FAQ';
import { LensFeatures } from './LensFeatures';
// import { UltraCuratedFrames } from './UltraCuratedFrames';
// import { AiFaceAnalysis } from './AiFaceAnalysis';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <>
      <HeroSection onNavigate={onNavigate} />
      
      {/* Precision in Every Frame - Service Qualities */}
      <section className="py-12 md:py-24 bg-gray-50">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-4xl font-serif text-spectra-navy mb-4">Precision in Every Frame</h2>
                <p className="text-gray-500 max-w-xl mx-auto">We combine medical expertise with premium craftsmanship to deliver the best vision experience.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white p-8 rounded-[2rem] hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                      <UserCheck size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-spectra-navy mb-3">Expert Opticians</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                      Every order is reviewed by a certified optician to ensure your prescription is perfectly matched to your frame choice.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-8 rounded-[2rem] hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-spectra-orange mb-6">
                      <MessageCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-spectra-navy mb-3">Personalized Service</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                      Personalized customer service over WhatsApp or phone by experienced representatives to guide your choices.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-8 rounded-[2rem] hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
                      <Truck size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-spectra-navy mb-3">Fast Turnaround</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                      Fast turnaround and delivered all across Pakistan, with exclusive 24-hour delivery in Islamabad and Rawalpindi.
                  </p>
                </div>
            </div>
          </div>
      </section>

      {/* <AiFaceAnalysis /> */}
      {/* <UltraCuratedFrames /> */}
      <LensFeatures />
      <MembershipOffer onNavigate={onNavigate} />
      <Testimonials />
      <FAQ />
    </>
  );
};