import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is HPLC Chromatography and why does it matter?",
    answer: "High-Performance Liquid Chromatography (HPLC) is a scientific method we use to separate and measure every chemical compound in our botanical extracts. This guarantees that each bottle contains precisely 1.8% wedelolactone and 2.5% carnosic acid for clinical efficacy, with absolute zero synthetic fillers or pesticides."
  },
  {
    question: "How long does it take to see visible results?",
    answer: "Clinical trials indicate an increase in hair density and a 42% acceleration in cellular turnover within 28 days of consistent application. For structural follicle strengthening and hair shaft elasticity, we recommend a 3-month continuous regimen."
  },
  {
    question: "Are your formulations safe for colored or chemically-treated hair?",
    answer: "Yes, our formulations are 100% color-safe. Because we use vacuum centrifugation and avoid synthetic sulfates, parabens, or silicones, our oils and serums reinforce the hair's natural keratin bonds rather than stripping color or creating build-up."
  },
  {
    question: "How often should I use the Hair & Scalp Oil?",
    answer: "We recommend applying the Hair & Scalp Oil 2-3 times per week. Gently massage 4-5 drops into your scalp, focus on areas of thinning, and leave it on for at least 45 minutes before rinsing with a mild shampoo. For deep nourishment, it can be left on overnight."
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-body text-xs font-semibold text-secondary tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4 text-secondary" /> Common Inquiries
          </span>
          <h2 className="font-display text-4xl lg:text-5xl text-primary font-medium tracking-tight">
            Science & Usage FAQ
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className="border-b border-outline-variant/30 pb-4 transition-all duration-300"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full flex justify-between items-center py-4 text-left font-display text-lg md:text-xl text-primary font-medium hover:text-secondary transition-colors cursor-pointer group"
                >
                  <span>{faq.question}</span>
                  <span className="ml-4 shrink-0 w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-secondary-container transition-colors">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed pb-6 pr-12">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-surface-container-low border border-outline-variant/20 p-8 rounded-2xl">
          <p className="font-body text-sm text-on-surface-variant mb-4">
            Have a custom scalp diagnostic question or require bulk clinic orders?
          </p>
          <a 
            href="#" 
            className="inline-block bg-primary text-on-primary font-body text-xs font-semibold tracking-widest uppercase px-6 py-3.5 rounded-full hover:bg-primary-container transition-all duration-300"
          >
            Speak to a Trichologist
          </a>
        </div>

      </div>
    </section>
  );
}
