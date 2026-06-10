import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Sparkles, ShoppingBag, X, ChevronLeft, ChevronRight, Check, ShoppingCart, RotateCcw, AlertCircle, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

interface Product {
  product_id: number;
  product_name: string;
  brand: string;
  category: string;
  description: string;
  frame_type: string;
  gender: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  color: string;
  material: string;
  sku: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  
  // Selection states
  const [answers, setAnswers] = useState({
    gender: '',
    faceShape: '',
    category: '',
    aesthetic: ''
  });

  const [addingId, setAddingId] = useState<number | null>(null);

  // Fetch products when quiz is opened
  useEffect(() => {
    if (showQuiz && allProducts.length === 0) {
      setLoading(true);
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAllProducts(data.products || []);
          }
        })
        .catch(err => console.error('Error fetching quiz products:', err))
        .finally(() => setLoading(false));
    }
  }, [showQuiz, allProducts]);

  const handleStartQuiz = () => {
    setAnswers({ gender: '', faceShape: '', category: '', aesthetic: '' });
    setQuizStep(1);
    setShowQuiz(true);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  const handleNextStep = () => {
    setQuizStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setQuizStep(prev => Math.max(1, prev - 1));
  };

  const selectAnswer = (key: keyof typeof answers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    // Auto advance for simple choices
    if (key === 'gender' || key === 'category') {
      setTimeout(() => {
        setQuizStep(prev => prev + 1);
      }, 300);
    }
  };

  // Run Recommendation Logic
  useEffect(() => {
    if (quizStep === 5 && allProducts.length > 0) {
      let filtered = [...allProducts];

      // 1. Filter by category
      if (answers.category) {
        filtered = filtered.filter(p => p.category.toLowerCase() === answers.category.toLowerCase());
      }

      // 2. Filter by gender
      if (answers.gender && answers.gender !== 'unisex') {
        filtered = filtered.filter(p => p.gender.toLowerCase() === answers.gender.toLowerCase() || p.gender.toLowerCase() === 'unisex');
      }

      // 3. Filter by face shape recommendations
      // - Round shape matches structural rectangular/square frames (full_rim, half_rim, wayfarer)
      // - Square shape matches rounder frames (aviator, cat_eye)
      // - Heart shape matches half_rim, browline, aviator frames
      if (answers.faceShape === 'round') {
        filtered = filtered.filter(p => ['full_rim', 'half_rim', 'wayfarer'].includes(p.frame_type.toLowerCase()));
      } else if (answers.faceShape === 'square') {
        filtered = filtered.filter(p => ['aviator', 'cat_eye', 'other'].includes(p.frame_type.toLowerCase()));
      } else if (answers.faceShape === 'heart') {
        filtered = filtered.filter(p => ['half_rim', 'browline', 'aviator'].includes(p.frame_type.toLowerCase()));
      }

      // 4. Filter by aesthetic brands
      if (answers.aesthetic === 'bold') {
        filtered = filtered.filter(p => ['gucci', 'prada', 'vogue'].includes(p.brand.toLowerCase()));
      } else if (answers.aesthetic === 'classic') {
        filtered = filtered.filter(p => ['ray-ban', 'armani', 'silhouette'].includes(p.brand.toLowerCase()));
      } else if (answers.aesthetic === 'sporty') {
        filtered = filtered.filter(p => ['oakley', 'police'].includes(p.brand.toLowerCase()));
      }

      // If nothing matches or list is small, show matching categories as fallback
      if (filtered.length === 0) {
        filtered = allProducts.filter(p => p.category.toLowerCase() === answers.category.toLowerCase()).slice(0, 3);
      }

      // Return max 3 recommendations
      setRecommendations(filtered.slice(0, 3));
    }
  }, [quizStep, allProducts, answers]);

  const addToCart = (product: Product) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.product_id === product.product_id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        product_id: product.product_id,
        product_name: product.product_name,
        price: product.price,
        image_url: product.image_url,
        brand: product.brand,
        quantity: 1
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));

    setAddingId(product.product_id);
    setTimeout(() => setAddingId(null), 1500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-center bg-spectra-offwhite px-4 md:px-12 py-12 md:py-32 overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-spectra-orange/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center relative z-10">
        
        <div 
          ref={ref}
          className={`flex flex-col items-center transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-spectra-orange text-xs md:text-sm font-bold uppercase tracking-widest mb-6 md:mb-8">
            <span className="w-2 h-2 rounded-full bg-spectra-orange animate-pulse"></span>
            Launching 2026
          </div>

          <h1 className="text-4xl md:text-7xl font-sans font-bold leading-tight md:leading-[1.1] text-spectra-navy mb-6 md:mb-8">
            Pakistan's First <br/>
            <span className="text-spectra-orange relative inline-block">
              Prescription Focused
              {/* Underline decoration */}
              <svg className="absolute w-full h-2 md:h-3 -bottom-1 md:-bottom-2 left-0 text-spectra-amber opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span> <br/>
            Eyewear Service.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 mb-8 md:mb-12 max-w-2xl leading-relaxed px-2">
            We don't just sell frames; we engineer perfect vision. Experience medical-grade accuracy with designer aesthetics, delivered directly to your door.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
            <button 
              onClick={handleStartQuiz}
              className="flex items-center justify-center gap-2 bg-spectra-navy text-white px-8 py-4 md:px-10 md:py-5 rounded-xl font-bold text-base md:text-lg hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto"
            >
              <Sparkles size={20} />
              Take Style Quiz
            </button>
            <button 
              onClick={() => onNavigate('eyeglasses')}
              className="flex items-center justify-center gap-2 bg-white text-spectra-navy border border-gray-200 px-8 py-4 md:px-10 md:py-5 rounded-xl font-bold text-base md:text-lg hover:border-spectra-orange hover:text-spectra-orange transition-all hover:-translate-y-1 w-full sm:w-auto"
            >
              <ShoppingBag size={20} />
              Shop Now
            </button>
          </div>
        </div>

      </div>

      {/* ── STYLISH STYLE QUIZ MODAL ── */}
      {showQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleCloseQuiz}
          />
          
          {/* Modal Card */}
          <div className="bg-white dark:bg-spectra-dark-surface rounded-[2.5rem] border border-spectra-border dark:border-spectra-dark-border max-w-2xl w-full p-8 md:p-12 relative z-10 shadow-2xl flex flex-col justify-between min-h-[500px] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-spectra-dark-border mb-6">
              <div className="flex items-center gap-2 text-spectra-orange font-bold text-xs uppercase tracking-widest">
                <Sparkles size={16} />
                Fit & Style Quiz
              </div>
              <button 
                onClick={handleCloseQuiz}
                className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-spectra-dark-card flex items-center justify-center text-gray-500 hover:text-spectra-navy dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quiz Loading State */}
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-spectra-orange border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400 font-light">Loading premium design database...</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between">
                
                {/* Step Content */}
                <div className="mb-8">
                  {quizStep === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="space-y-2">
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-spectra-navy dark:text-white">Who is this eyewear for?</h3>
                        <p className="text-sm text-gray-400 font-light">We offer tailor-fit sizing metrics customized by gender.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { val: 'male', label: "Men's Collection" },
                          { val: 'female', label: "Women's Collection" },
                          { val: 'unisex', label: 'Unisex (Show All)' }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => selectAnswer('gender', opt.val)}
                            className={`p-6 rounded-2xl border text-sm font-bold transition-all text-center ${
                              answers.gender === opt.val
                                ? 'bg-spectra-navy dark:bg-spectra-orange text-white border-spectra-navy dark:border-spectra-orange shadow-md'
                                : 'bg-spectra-offwhite dark:bg-spectra-dark-card border-spectra-border dark:border-spectra-dark-border text-spectra-navy dark:text-spectra-dark-text hover:border-spectra-orange'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {quizStep === 2 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="space-y-2">
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-spectra-navy dark:text-white">Select your face shape</h3>
                        <p className="text-sm text-gray-400 font-light">We will balance frame structures to highlight your facial features.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { val: 'round', label: 'Round Face Shape', desc: 'Prominent cheeks with a soft, circular jawline.' },
                          { val: 'square', label: 'Square Face Shape', desc: 'Strong, angular jaw with balanced forehead width.' },
                          { val: 'oval', label: 'Oval Face Shape', desc: 'Balanced features with slightly tapered chin.' },
                          { val: 'heart', label: 'Heart Face Shape', desc: 'Wider forehead tapering down to a narrow chin.' }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => selectAnswer('faceShape', opt.val)}
                            className={`p-5 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                              answers.faceShape === opt.val
                                ? 'bg-spectra-navy dark:bg-spectra-orange text-white border-spectra-navy dark:border-spectra-orange shadow-md'
                                : 'bg-spectra-offwhite dark:bg-spectra-dark-card border-spectra-border dark:border-spectra-dark-border text-spectra-navy dark:text-spectra-dark-text hover:border-spectra-orange'
                            }`}
                          >
                            <span className="font-bold text-sm">{opt.label}</span>
                            <span className={`text-xs font-light ${answers.faceShape === opt.val ? 'text-gray-300' : 'text-gray-400'}`}>{opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {quizStep === 3 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="space-y-2">
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-spectra-navy dark:text-white">What category do you need?</h3>
                        <p className="text-sm text-gray-400 font-light">Select between clear vision eyeglasses and outdoor protective sunwear.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { val: 'Sunglasses', label: 'Sunglasses Collection', desc: 'Outdoor active wear with high-contrast glare reduction.' },
                          { val: 'Eyeglasses', label: 'Eyeglasses & Prescription', desc: 'Medical-grade lenses custom mounted for daily sight.' }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => selectAnswer('category', opt.val)}
                            className={`p-5 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                              answers.category === opt.val
                                ? 'bg-spectra-navy dark:bg-spectra-orange text-white border-spectra-navy dark:border-spectra-orange shadow-md'
                                : 'bg-spectra-offwhite dark:bg-spectra-dark-card border-spectra-border dark:border-spectra-dark-border text-spectra-navy dark:text-spectra-dark-text hover:border-spectra-orange'
                            }`}
                          >
                            <span className="font-bold text-sm">{opt.label}</span>
                            <span className={`text-xs font-light ${answers.category === opt.val ? 'text-gray-300' : 'text-gray-400'}`}>{opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {quizStep === 4 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="space-y-2">
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-spectra-navy dark:text-white">Choose your aesthetic style</h3>
                        <p className="text-sm text-gray-400 font-light">Identify your styling mood to find matching designer brands.</p>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { val: 'bold', label: 'Bold & High Fashion', desc: 'Turn heads with luxury designs from Prada & Gucci.' },
                          { val: 'classic', label: 'Classic & Professional', desc: 'Timeless structural profiles from Ray-Ban & Silhouette.' },
                          { val: 'sporty', label: 'Active & Sporty', desc: 'Durable, impact-resistant frames from Oakley & Police.' }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => selectAnswer('aesthetic', opt.val)}
                            className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-0.5 ${
                              answers.aesthetic === opt.val
                                ? 'bg-spectra-navy dark:bg-spectra-orange text-white border-spectra-navy dark:border-spectra-orange shadow-md'
                                : 'bg-spectra-offwhite dark:bg-spectra-dark-card border-spectra-border dark:border-spectra-dark-border text-spectra-navy dark:text-spectra-dark-text hover:border-spectra-orange'
                            }`}
                          >
                            <span className="font-bold text-sm">{opt.label}</span>
                            <span className={`text-xs font-light ${answers.aesthetic === opt.val ? 'text-gray-300' : 'text-gray-400'}`}>{opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {quizStep === 5 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="space-y-2 text-center">
                        <span className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-3 shadow-sm">
                          <Check size={24} />
                        </span>
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-spectra-navy dark:text-white">Your Matched Styles</h3>
                        <p className="text-xs text-gray-400 font-light">We matched your face shape and aesthetic preferences against our catalog.</p>
                      </div>

                      {recommendations.length === 0 ? (
                        <div className="p-8 bg-gray-50 dark:bg-spectra-dark-card rounded-2xl text-center space-y-2 text-gray-400 border border-spectra-border dark:border-spectra-dark-border">
                          <AlertCircle size={24} className="mx-auto" />
                          <p className="text-sm font-medium">No direct matches found.</p>
                          <p className="text-xs">Try selecting a different style category.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {recommendations.map(prod => (
                            <div 
                              key={prod.product_id}
                              className="bg-white dark:bg-spectra-dark-card border border-spectra-border dark:border-spectra-dark-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                            >
                              <div className="relative h-36 bg-gray-100">
                                <img src={prod.image_url} alt={prod.product_name} className="w-full h-full object-cover" />
                                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                                  {prod.brand}
                                </span>
                              </div>
                              
                              <div className="p-4 flex-grow flex flex-col justify-between gap-3">
                                <div>
                                  <h4 className="font-bold text-xs text-spectra-navy dark:text-white truncate" title={prod.product_name}>{prod.product_name}</h4>
                                  <p className="text-[10px] text-spectra-orange font-bold mt-1">{formatPrice(prod.price)}</p>
                                </div>
                                
                                <button
                                  onClick={() => addToCart(prod)}
                                  className={`w-full py-2 rounded-xl text-[10px] font-bold shadow-sm transition-all flex items-center justify-center gap-1
                                    ${addingId === prod.product_id
                                      ? 'bg-green-600 text-white'
                                      : 'bg-spectra-navy dark:bg-spectra-orange text-white hover:opacity-90'}`}
                                >
                                  {addingId === prod.product_id ? (
                                    <>
                                      <Check size={12} className="animate-bounce" />
                                      Added!
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingCart size={12} />
                                      Add
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Progress & Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-spectra-dark-border">
                  
                  {/* Step indicators */}
                  {quizStep < 5 ? (
                    <div className="text-xs text-gray-400">
                      Question <span className="font-bold text-spectra-navy dark:text-white">{quizStep}</span> of 4
                    </div>
                  ) : (
                    <button
                      onClick={handleStartQuiz}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-spectra-orange font-bold uppercase transition-colors"
                    >
                      <RotateCcw size={14} />
                      Reset Quiz
                    </button>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-2">
                    {quizStep > 1 && quizStep < 5 && (
                      <button
                        onClick={handlePrevStep}
                        className="px-4 py-2 border border-spectra-border dark:border-spectra-dark-border text-spectra-navy dark:text-white rounded-xl text-xs font-bold transition-all hover:bg-gray-50 dark:hover:bg-spectra-dark-card flex items-center gap-1"
                      >
                        <ChevronLeft size={14} />
                        Back
                      </button>
                    )}
                    
                    {quizStep < 4 ? (
                      // Next is disabled if no answer selected yet for active step
                      <button
                        onClick={handleNextStep}
                        disabled={
                          (quizStep === 1 && !answers.gender) ||
                          (quizStep === 2 && !answers.faceShape) ||
                          (quizStep === 3 && !answers.category)
                        }
                        className="px-4 py-2 bg-spectra-navy dark:bg-spectra-orange text-white rounded-xl text-xs font-bold transition-all hover:opacity-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        Next
                        <ChevronRight size={14} />
                      </button>
                    ) : quizStep === 4 ? (
                      <button
                        onClick={handleNextStep}
                        disabled={!answers.aesthetic}
                        className="px-4 py-2 bg-spectra-orange text-white rounded-xl text-xs font-bold transition-all hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 shadow-md animate-pulse"
                      >
                        Get Matches
                        <Sparkles size={14} />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            handleCloseQuiz();
                            onNavigate(answers.category === 'Sunglasses' ? 'sunglasses' : 'eyeglasses');
                          }}
                          className="px-4 py-2 border border-spectra-border dark:border-spectra-dark-border text-spectra-navy dark:text-white rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-spectra-dark-card transition-all"
                        >
                          Explore Full Catalog
                        </button>
                        <a
                          href="checkout.html"
                          className="px-5 py-2 bg-spectra-orange text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all shadow-md flex items-center gap-1.5"
                        >
                          Checkout Now
                          <ArrowRight size={14} className="text-white" />
                        </a>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
};