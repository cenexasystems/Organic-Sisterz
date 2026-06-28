import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I prepare and use the Herbal Shikakai Powder as a bio hair wash?",
    answer: "Take a small quantity of Shikakai powder and mix it with water in a bowl to form a smooth, medium-thick paste. Wet your hair thoroughly, apply the paste to your scalp and strands, massage gently, leave on for 10 minutes to allow the 40 herbs to activate, and rinse completely with water. There is no need to use chemical shampoo afterwards."
  },
  {
    question: "How long does it take to see visible reduction in hair fall?",
    answer: "Most users experience a significant reduction in active hair fall and improved scalp cooling within 3 to 4 weeks of consistent use (applying the Herbal Hair Oil twice weekly and washing with the Shikakai Bio Wash). For new hair density and follicle restoration, we recommend completing the full 12-week organic regimen."
  },
  {
    question: "Can I use the Face Pack & Bath Powder daily instead of soap?",
    answer: "Yes, absolutely. Our Face Pack & Bath Powder is formulated with 50 traditional herbs like Aavaram Senna and Wild Turmeric. It is 100% chemical-free and contains no sulfate or artificial foaming agents. It gently lifts dead skin, clears sunburn/tan, and prevents acne while keeping the skin barrier soft, making it an excellent daily soap replacement."
  },
  {
    question: "How should I store these organic formulations?",
    answer: "Since our powders and oils are 100% natural and contain zero synthetic preservatives, it is important to store them in a cool, dry place away from direct sunlight. Ensure the zipper pouch is sealed tightly after every use, and avoid using wet spoons or letting water get inside the bags. Best used within 6 months from the date of packing."
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
