import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const ContactPage: React.FC = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.1);
  const { ref: bodyRef, isVisible: bodyVisible } = useScrollAnimation(0.1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    // Basic regex validation for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (formData.message.trim().length < 10) {
      setErrorMsg('Please write a message of at least 10 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg(data.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      setErrorMsg('A network error occurred. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const contactOptions = [
    {
      icon: <Phone size={24} className="text-spectra-orange" />,
      title: 'Phone Support',
      detail: '+92 300 0000000',
      description: 'Available 24/7 for urgent consultations and orders.'
    },
    {
      icon: <Mail size={24} className="text-spectra-orange" />,
      title: 'Email Queries',
      detail: 'hello@myeyes.pk',
      description: 'For corporate inquiries, partner options, and custom lens orders.'
    },
    {
      icon: <MessageSquare size={24} className="text-spectra-orange" />,
      title: 'WhatsApp Concierge',
      detail: 'Start Chat',
      description: 'Send prescription photos directly to our opticians.',
      link: 'https://wa.me/923000000000'
    }
  ];

  return (
    <div className="bg-spectra-cream dark:bg-spectra-dark-bg min-h-screen transition-colors duration-300 pb-20">
      
      {/* Premium Hero Header */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-white dark:bg-spectra-dark-surface border-b border-spectra-border dark:border-spectra-dark-border">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-spectra-orange/5 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10 text-center" ref={headerRef}>
          <div className={`transition-all duration-1000 transform ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-spectra-orange text-xs font-bold uppercase tracking-widest inline-block mb-6 shadow-sm">
              Contact Center
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold italic text-spectra-navy dark:text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
              Have questions about your prescription lens options or need styling advice? Our expert optician team is ready to help.
            </p>
          </div>
        </div>
      </section>

      {/* Main Split Section */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-16 md:mt-24" ref={bodyRef}>
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-start transition-all duration-1000 transform ${bodyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Left Column: Info & Location Cards */}
          <div className="lg:col-span-5 space-y-8">
            
            <h2 className="text-3xl font-serif font-bold text-spectra-navy dark:text-white mb-2 leading-tight">
              Connect with our <br/>
              <span className="italic text-spectra-orange">Prescription Lab</span>
            </h2>
            <p className="text-gray-500 font-light leading-relaxed mb-8">
              Whether you need to submit custom pupillary distance (PD) measurements or request changes to a placed order, we are here.
            </p>

            <div className="space-y-6">
              {contactOptions.map((opt, idx) => (
                <div key={idx} className="bg-white dark:bg-spectra-dark-surface p-6 rounded-2xl border border-spectra-border dark:border-spectra-dark-border flex items-start gap-5 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-orange-50 dark:bg-spectra-dark-card rounded-xl flex-shrink-0">
                    {opt.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-spectra-navy dark:text-white">{opt.title}</h4>
                    {opt.link ? (
                      <a href={opt.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-spectra-orange hover:underline block">
                        {opt.detail} &rarr;
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-spectra-navy dark:text-spectra-dark-text">{opt.detail}</p>
                    )}
                    <p className="text-xs text-gray-400 font-light">{opt.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Lab Map Card */}
            <div className="bg-spectra-navy text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-spectra-orange/10 to-transparent"></div>
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-2 text-spectra-amber font-bold text-xs uppercase tracking-widest">
                  <MapPin size={16} />
                  Main Laboratory & Head Office
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-serif">Islamabad Tech-Mounting Facility</h3>
                  <p className="text-sm text-gray-300 font-light leading-relaxed">
                    Plot 48, Sector I-9/3 Industrial Area,<br/>
                    Islamabad, Pakistan
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center gap-6 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-spectra-orange" />
                    <span>09:00 AM - 08:00 PM</span>
                  </div>
                  <div>• Mon - Sat</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-white dark:bg-spectra-dark-surface p-8 md:p-12 rounded-[2.5rem] border border-spectra-border dark:border-spectra-dark-border shadow-lg relative">
            
            <h3 className="text-2xl font-serif font-bold text-spectra-navy dark:text-white mb-6">
              Send a Direct Message
            </h3>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                <AlertTriangle size={18} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-spectra-dark-muted">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-spectra-dark-border focus:border-spectra-orange outline-none bg-white dark:bg-spectra-dark-card text-spectra-navy dark:text-white text-sm transition-all focus:shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-spectra-dark-muted">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@domain.com"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-spectra-dark-border focus:border-spectra-orange outline-none bg-white dark:bg-spectra-dark-card text-spectra-navy dark:text-white text-sm transition-all focus:shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-spectra-dark-muted">
                  Subject Category
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-spectra-dark-border focus:border-spectra-orange outline-none bg-white dark:bg-spectra-dark-card text-spectra-navy dark:text-white text-sm transition-all focus:shadow-sm"
                >
                  <option value="">Select a subject...</option>
                  <option value="Prescription Help">Prescription Consultation</option>
                  <option value="Order Status">Order Status & Shipping</option>
                  <option value="Returns & Swaps">Returns & Swaps</option>
                  <option value="Corporate / Partnership">Corporate / Brand Partnership</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-spectra-dark-muted">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can our opticians help you today?"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-spectra-dark-border focus:border-spectra-orange outline-none bg-white dark:bg-spectra-dark-card text-spectra-navy dark:text-white text-sm transition-all focus:shadow-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-spectra-navy dark:bg-spectra-orange text-white py-4 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-orange-600 transition-all shadow-md flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                {loading ? 'Submitting Inquiry...' : 'Submit Inquiry'}
              </button>
            </form>

            {/* Success Overlay Modal */}
            {success && (
              <div className="absolute inset-0 bg-white/95 dark:bg-spectra-dark-surface/95 rounded-[2.5rem] z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6 shadow-sm">
                  <CheckCircle size={44} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-spectra-navy dark:text-white mb-3">
                  Inquiry Submitted!
                </h3>
                <p className="text-gray-500 dark:text-spectra-dark-muted max-w-sm mb-8 text-sm leading-relaxed">
                  Thank you for contacting us. Your message has been routed to our certified optician desk. We will review and reply within 1-2 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-orange-50 border border-orange-100 text-spectra-orange px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-orange-100 transition-colors"
                >
                  Send another message
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};
