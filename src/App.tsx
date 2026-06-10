import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { Home } from './components/Home';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ComingSoonPage } from './components/ComingSoonPage';
import { PrescriptionPage } from './components/PrescriptionPage';
import { MembershipPage } from './components/MembershipPage';
import ProductCatalog from './components/ProductCatalog';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { PortfolioPage } from './components/PortfolioPage';

const AppContent: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'home-lenses') {
      navigate('/');
      // Allow time for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById('lenses');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (page === 'profile') {
      window.location.href = 'profile.html';
    } else if (page === 'orders') {
      window.location.href = 'orders-history.html';
    } else if (page === 'admin') {
      window.location.href = 'admin.html';
    } else if (page === 'reviews') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('testimonials');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(`/${page}`);
    }
  };

  // Determine current page ID for Header styling
  const getCurrentPageId = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    return path.substring(1); // remove leading slash
  };

  return (
    <div className="font-sans text-spectra-navy dark:text-spectra-dark-text bg-white dark:bg-spectra-dark-bg min-h-screen flex flex-col relative selection:bg-spectra-orange selection:text-white transition-colors duration-300">
      
      <Header 
        onNavigate={handleNavigate} 
        scrolled={scrolled} 
        currentPage={getCurrentPageId()}
      />

      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<Home onNavigate={handleNavigate} />} />
          <Route path="/eyeglasses" element={<ProductCatalog initialCategory="Eyeglasses" />} />
          <Route path="/sunglasses" element={<ProductCatalog initialCategory="Sunglasses" />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/prescriptions" element={<PrescriptionPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;