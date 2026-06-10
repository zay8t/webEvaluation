import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const GoBackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Safe fallback logic:
    // Check if the history state has an index greater than 0, which implies we have internal history to go back to.
    // If idx is 0 or undefined (direct landing), navigate to home instead of going back (which might leave the site).
    const state = window.history.state as { idx: number } | null;
    
    if (state && state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <button 
      onClick={handleGoBack}
      className="inline-flex items-center gap-3 group mb-8 transition-all duration-300 ease-out"
      aria-label="Go back"
    >
      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm text-spectra-navy group-hover:bg-spectra-navy group-hover:text-white group-hover:border-spectra-navy transition-all">
        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
      </div>
      <span className="text-sm font-bold uppercase tracking-widest text-gray-500 group-hover:text-spectra-navy transition-colors">
        Go Back
      </span>
    </button>
  );
};