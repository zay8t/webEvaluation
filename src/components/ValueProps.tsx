import React from 'react';
import { Glasses, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export const ValueProps: React.FC = () => {
  return (
    <div className="border-y border-gray-100 bg-white">
      <div className="max-w-[1440px] mx-auto py-8 px-6 md:px-12">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
            <Glasses size={18} className="text-spectra-navy shrink-0" />
            <span className="text-xs md:text-sm font-medium text-spectra-navy">Subscribers buy 1 get 1 free everytime</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
            <ShieldCheck size={18} className="text-spectra-navy shrink-0" />
            <span className="text-xs md:text-sm font-medium text-spectra-navy">Over 15 years of experience in opticianry</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
             <Truck size={18} className="text-spectra-navy shrink-0" />
            <span className="text-xs md:text-sm font-medium text-spectra-navy">Free 24 hour delivery in Islamabad & Rawalpindi</span>
          </div>
        </div>
      </div>
    </div>
  );
};