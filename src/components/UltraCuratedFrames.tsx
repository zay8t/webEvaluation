import React from 'react';
import { Camera, Sparkles, ScanFace, Lock } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const UltraCuratedFrames: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-bold uppercase tracking-widest mb-6">
                <Sparkles size={14} />
                Coming Soon
            </div>
            
            <h2 className="text-4xl md:text-6xl font-serif text-spectra-navy mb-8 leading-tight">
              Hyper-Realistic <br/>
              AI Virtual Try-On
            </h2>
            
            <p className="text-xl text-gray-500 leading-relaxed mb-6 max-w-2xl mx-auto">
              Once you've selected your favorite frames, see exactly how they look on you. We are building a premium feature that generates hyper-realistic images of you wearing our frames.
            </p>
            
            <p className="text-sm text-gray-400 mb-16 max-w-lg mx-auto italic border-l-2 border-gray-200 pl-4">
               Note: Because of the high computational cost of generative AI rendering, this advanced visualization may be offered as a paid add-on or exclusive to members.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-spectra-navy mb-6 shadow-sm">
                        <Camera size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-spectra-navy mb-2">Photo Input</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Simply upload a photo. We generate the look without the need for live camera permissions or awkward angles.</p>
                </div>

                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-spectra-navy mb-6 shadow-sm">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-spectra-navy mb-2">Generative AI</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Powered by advanced GenAI to render photorealistic materials, reflections, and accurate facial mapping.</p>
                </div>

                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-spectra-navy mb-6 shadow-sm">
                        <Lock size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-spectra-navy mb-2">Premium Tier</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Experience a studio-quality fitting session from your home. This feature delivers superior accuracy to standard AR.</p>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};