import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-spectra-dark-surface border-t border-gray-100 dark:border-spectra-dark-border pt-16 pb-10 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
           {/* Contact Us */}
           <div className="md:w-1/3">
              <h4 className="font-serif font-bold text-2xl text-spectra-navy dark:text-white mb-6">Contact Us</h4>
              <div className="space-y-4 text-gray-500 dark:text-spectra-dark-muted">
                <p className="leading-relaxed">
                  Our Support and Sales team is available 24/7 to answer your queries.
                </p>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-spectra-navy dark:text-spectra-dark-text">Islamabad, Pakistan</p>
                  <p>+92 300 0000000</p>
                  <p>hello@myeyes.pk</p>
                </div>
              </div>
           </div>

           {/* Socials */}
           <div>
              <h4 className="font-serif font-bold text-2xl text-spectra-navy dark:text-white mb-6">Socials</h4>
              <div className="flex gap-4">
                {/* Facebook */}
                <a href="#" className="w-12 h-12 rounded-full bg-gray-50 dark:bg-spectra-dark-card border border-gray-100 dark:border-spectra-dark-border flex items-center justify-center text-spectra-navy dark:text-spectra-dark-text hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                {/* Instagram */}
                <a href="#" className="w-12 h-12 rounded-full bg-gray-50 dark:bg-spectra-dark-card border border-gray-100 dark:border-spectra-dark-border flex items-center justify-center text-spectra-navy dark:text-spectra-dark-text hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                {/* TikTok */}
                <a href="#" className="w-12 h-12 rounded-full bg-gray-50 dark:bg-spectra-dark-card border border-gray-100 dark:border-spectra-dark-border flex items-center justify-center text-spectra-navy dark:text-spectra-dark-text hover:bg-[#000000] hover:text-white hover:border-[#000000] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                </a>
                {/* X (Twitter) */}
                <a href="#" className="w-12 h-12 rounded-full bg-gray-50 dark:bg-spectra-dark-card border border-gray-100 dark:border-spectra-dark-border flex items-center justify-center text-spectra-navy dark:text-spectra-dark-text hover:bg-[#000000] hover:text-white hover:border-[#000000] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
           </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 dark:border-spectra-dark-border text-xs text-gray-400 dark:text-spectra-dark-muted">
           <p>Copyright &copy; 2026 My Eyes. All rights reserved.</p>
           <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-spectra-navy dark:hover:text-white transition-colors">Terms & Conditions</a>
             <a href="#" className="hover:text-spectra-navy dark:hover:text-white transition-colors">Privacy Policy</a>
           </div>
        </div>
      </div>
    </footer>
  );
};
