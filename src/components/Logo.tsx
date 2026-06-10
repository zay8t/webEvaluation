import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "h-10 w-auto" }) => (
  <svg viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0%" stopColor="#FFC107" />
         <stop offset="100%" stopColor="#FF5722" />
      </linearGradient>
    </defs>

    {/* Left Eye Group */}
    <g>
        {/* Circle: Center 16,16 Radius 9. Stroke with gap. */}
        <circle cx="16" cy="16" r="9" stroke="url(#logo-grad)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="42 100" transform="rotate(110 16 16)" />
        
        {/* Pupil: Looking right */}
        <circle cx="19" cy="16" r="3.5" fill="black" />
        
        {/* Arm/Tick: Top Left */}
        <path d="M9 10 L6 7" stroke="url(#logo-grad)" strokeWidth="3.5" strokeLinecap="round" />
    </g>

    {/* Right Eye Group */}
    <g>
        {/* Circle: Center 44,16 Radius 9 */}
        <circle cx="44" cy="16" r="9" stroke="url(#logo-grad)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="42 100" transform="rotate(190 44 16)" />
        
        {/* Pupil: Looking right */}
        <circle cx="47" cy="16" r="3.5" fill="black" />
        
        {/* Arm/Tick: Top Right */}
        <path d="M51 10 L54 7" stroke="url(#logo-grad)" strokeWidth="3.5" strokeLinecap="round" />
    </g>
  </svg>
);

export const LogoText: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-baseline select-none ${className}`}>
    <span className="font-sans font-black text-2xl tracking-tighter text-spectra-navy leading-none">my</span>
    <span className="font-sans font-black text-2xl tracking-tighter bg-gradient-to-b from-[#FFC107] to-[#FF5722] bg-clip-text text-transparent leading-none">eyes</span>
  </div>
);

export const Logo: React.FC<{ className?: string }> = ({ className = "h-10" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon className="h-full w-auto" />
      <LogoText />
    </div>
  );
};