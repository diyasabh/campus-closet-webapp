"use client";

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  color: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "Getting Started",
    color: "cc-pink",
    items: [
      {
        question: "Who can use Campus Closet?",
        answer: "Campus Closet is exclusively for Stanford University students, faculty, and staff. You'll need a valid Stanford email address to create an account."
      },
      {
        question: "How do I get started?",
        answer: "Simply sign up with your Stanford email, complete your profile, and start browsing available items or list your own clothes for rent!"
      },
      {
        question: "Is Campus Closet free to use?",
        answer: "Creating an account and using our platform is completely free."
      }
    ]
  },
  {
    title: "Renting Items",
    color: "cc-light-red",
    items: [
      {
        question: "How do I rent an item?",
        answer: "Browse items, select your rental duration (1 day to 1 month), and click 'Rent This Item.' You'll pay the daily rental fee plus a refundable security deposit."
      },
      {
        question: "Where do I pick up and return items?",
        answer: "All pickups and returns happen on Stanford campus. You'll coordinate specific locations with the item owner through email."
      },
      {
        question: "What if an item doesn't fit?",
        answer: "Check the size and measurements carefully before renting. If there's a significant discrepancy from the listing, contact the owner immediately to arrange a return."
      }
    ]
  },
  {
    title: "Listing Your Items",
    color: "cc-orange",
    items: [
      {
        question: "What items can I list?",
        answer: "Clean, good-condition clothing, shoes, and accessories. No undergarments, or significantly damaged items."
      },
      {
        question: "How do I price my items?",
        answer: "Consider the item's original value, condition, and rental demand. Most items rent for $5-25 per day. Check similar listings for pricing guidance."
      },
    ]
  },
  {
    title: "Safety & Trust",
    color: "cc-light-orange",
    items: [
      {
        question: "How do I stay safe when meeting other users?",
        answer: "Always meet in public, well-lit areas on campus, and do not share any personal addresses."
      },
      {
        question: "What if someone doesn't return my item?",
        answer: "First, contact the renter first and if unresolved, reach out to our support team with rental details for assistance."
      },
      {
        question: "How are users verified?",
        answer: "All users must verify their Stanford email address. We also encourage users to complete their profiles with photos and Instagram handles for additional trust."
      }
    ]
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<{[key: string]: boolean}>({});

  const toggleItem = (sectionIndex: number, itemIndex: number) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cc-light-peach to-cc-cream">
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-cc-dark-red mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-lg">Everything you need to know about Campus Closet</p>
        </div>
        
        <div className="space-y-8">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
              <h2 className={`font-serif text-3xl font-semibold mb-6 text-cc-dark-red border-b-2 border-${section.color} pb-2`}>
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => {
                  const isOpen = openItems[`${sectionIndex}-${itemIndex}`];
                  return (
                    <div key={itemIndex} className={`bg-${section.color}/20 rounded-xl overflow-hidden transition-all duration-300`}>
                      <button
                        onClick={() => toggleItem(sectionIndex, itemIndex)}
                        className="w-full text-left p-6 hover:bg-white/30 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-serif text-xl font-medium text-cc-dark-red pr-4">
                            {item.question}
                          </h3>
                          <div className={`text-cc-red transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6">
                          <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-cc-dark-red to-cc-red rounded-2xl p-8 text-center">
          <h3 className="font-serif text-2xl font-semibold mb-4 text-white">Still Have Questions?</h3>
          <p className="text-white/90 text-lg mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-cc-dark-red rounded-full hover:bg-cc-light-peach transition-colors duration-200 font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}