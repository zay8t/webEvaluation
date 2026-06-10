import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FaqItemProps } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const faqData: FaqItemProps[] = [
  {
    question: "Is the PKR 1000 a monthly fee?",
    answer: "No. The PKR 1000 is a one-time annual membership fee. It covers your membership benefits for the entire year and is not a recurring monthly charge."
  },
  {
    question: "When will I receive my eyewear?",
    answer: "We officially launch and start shipping on January 1st. You will be able to place your orders and receive deliveries starting from that date."
  },
  {
    question: "What is Face Shape Analysis?",
    answer: "Our Face Shape Analysis helps you find the perfect fit in two ways: you can either take our Style Quiz, or use our upcoming AI feature that recommends frames based on your unique face shape and generates hyper-realistic pictures of you wearing them."
  },
  {
    question: "Do you deliver outside the Twin Cities?",
    answer: "Yes. While free 24-hour delivery is exclusive to Islamabad & Rawalpindi, we offer nationwide shipping to all other cities at an additional delivery cost."
  },
  {
    question: "Is membership nationwide?",
    answer: "Yes, you can become a member from anywhere in Pakistan. Your benefits apply regardless of your location."
  }
];

export const FAQ: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="faq" className="py-20 md:py-32 bg-white">
      <div 
        ref={ref}
        className={`max-w-3xl mx-auto px-6 md:px-12 transition-all duration-1000 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-4xl font-serif text-spectra-navy mb-12 text-center">Inquiries</h2>
        <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
          {faqData.map((item, index) => (
            <AccordionItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

const AccordionItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-8 text-left focus:outline-none hover:bg-gray-50 transition-colors px-4 -mx-4 rounded-lg"
      >
        <span className={`text-lg font-serif ${isOpen ? 'text-spectra-teal italic' : 'text-spectra-navy'}`}>{question}</span>
        <span className={`text-spectra-navy transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
           {isOpen ? <Minus strokeWidth={1} /> : <Plus strokeWidth={1} />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-40 opacity-100 mb-8' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-gray-500 font-light leading-relaxed max-w-xl">
          {answer}
        </p>
      </div>
    </div>
  );
};