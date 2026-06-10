import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const shapes = [
  {
    id: 'round',
    label: 'Round',
    path: <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
  },
  {
    id: 'square',
    label: 'Square',
    path: <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
  },
  {
    id: 'rectangle',
    label: 'Rectangle',
    path: <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
  },
  {
    id: 'cateye',
    label: 'Cat Eye',
    path: <path d="M2 14C2 14 4 8 12 8C20 8 22 14 22 14V16H2V14Z" stroke="currentColor" strokeWidth="2" fill="none" /> 
    // Simplified abstraction of cat eye top rim
  },
  {
    id: 'aviator',
    label: 'Aviator',
    path: <path d="M12 14C12 14 11 8 4 8C3 8 2 9 2 11V14C2 17 5 18 7 18C9 18 11 16 12 14ZM12 14C12 14 13 8 20 8C21 8 22 9 22 11V14C22 17 19 18 17 18C15 18 13 16 12 14Z" stroke="currentColor" strokeWidth="2" fill="none" />
  }
];

export const ShapeSelector: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div className="bg-white pt-10 pb-6 border-b border-gray-50">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Filter by Shape</p>
        
        <div 
          ref={ref}
          className={`flex flex-wrap gap-4 transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {shapes.map((shape) => (
            <button 
              key={shape.id}
              className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-spectra-navy hover:shadow-md transition-all duration-300 min-w-[100px] flex-1 md:flex-none"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                className="text-gray-400 group-hover:text-spectra-teal transition-colors"
              >
                {shape.path}
              </svg>
              <span className="text-xs font-medium uppercase tracking-wide text-spectra-navy group-hover:font-bold">
                {shape.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
