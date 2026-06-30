import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Sun, Beaker, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Ethical Wild Harvesting',
    subtitle: 'Nurtured in Southern Indian Hills',
    desc: 'Our journey begins in the pristine hill farms of Tamil Nadu and Kerala. We partner with local farming collectives to handpick native herbs (Bringaraj, Amla, Aavaram Senna, and Rosemary) at their absolute seasonal peak, ensuring maximum concentration of raw active therapeutic compounds.',
    icon: Leaf,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    number: '02',
    title: 'Natural Solar Dehydration',
    subtitle: 'Regulated Enzymatic Stabilization',
    desc: 'To lock in volatile oils and natural vitamins, the harvested herbs undergo solar dehydration under regulated shade temperature. This slow, natural moisture extraction ensures the plant’s delicate cellular structure and active healing enzymes remain 100% intact and bio-active.',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    color: 'bg-amber-50 text-amber-700 border-amber-100'
  },
  {
    number: '03',
    title: 'Slow Cold-Press Compounding',
    subtitle: '21-Day Sun Infusion & Maturation',
    desc: 'The dry botanicals are slowly infused into wood-pressed organic oils. We mature the compound in glass vessels for 21 days without applying external heat, preserving 98% bioavailability. We filter the batch manually, yielding a concentrated, nutrient-rich elixir.',
    icon: Beaker,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    color: 'bg-rose-50 text-rose-700 border-rose-100'
  }
];

export default function BotanicalJourney() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 md:py-36 bg-[#FAF9F5] relative overflow-hidden">
      {/* Decorative light grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2b3e2f03_1px,transparent_1px),linear-gradient(to_bottom,#2b3e2f03_1px,transparent_1px)] bg-[size:5rem_5rem] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-6 mb-20 md:mb-28 text-left">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-secondary/50" />
            <span className="font-body text-xs font-bold text-secondary tracking-[0.2em] uppercase">
              Seed To Bottle Ritual
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary font-medium tracking-tight">
            The Journey of Pure Extraction
          </h2>
          <p className="font-body text-sm md:text-base text-on-surface-variant max-w-xl leading-relaxed">
            Scroll down to explore our transparent, slow-infusion method that transforms raw traditional plants into premium hair & wellness formulations.
          </p>
        </div>

        {/* Dynamic Sticky Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
          
          {/* Left Column: STICKY Visual Showcase & Step Progress */}
          <div className="col-span-1 lg:col-span-6 lg:sticky lg:top-36 flex flex-col gap-8">
            <div className="relative w-full h-[320px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/20 bg-[#FAF9F5]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStep}
                  src={steps[activeStep].image}
                  alt={steps[activeStep].title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Overlay with current step index badge */}
              <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2">
                <span className="text-xs font-bold text-secondary tracking-widest uppercase">Ritual Phase</span>
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-extrabold flex items-center justify-center">
                  {steps[activeStep].number}
                </span>
              </div>
            </div>

            {/* Visual Progress Steps Indicators */}
            <div className="flex gap-4 items-center">
              {steps.map((st, idx) => (
                <button
                  key={st.number}
                  onClick={() => {
                    const el = document.getElementById(`ritual-step-${idx}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeStep === idx ? 'w-10 bg-primary' : 'w-3 bg-outline-variant/40 group-hover:bg-outline-variant/80'
                  }`} />
                  <span className={`text-[10px] font-bold tracking-wider ${
                    activeStep === idx ? 'text-primary' : 'text-gray-400 group-hover:text-primary'
                  }`}>
                    {st.number}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: SCROLLING Text Blocks */}
          <div className="col-span-1 lg:col-span-6 space-y-[35vh] lg:space-y-[45vh] pb-[25vh]">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              
              return (
                <motion.div
                  id={`ritual-step-${idx}`}
                  key={step.number}
                  onViewportEnter={() => setActiveStep(idx)}
                  viewport={{ amount: 0.5, margin: "-10% 0px -40% 0px" }}
                  className={`space-y-6 transition-opacity duration-500 text-left border-l-2 pl-6 md:pl-10 ${
                    isActive ? 'border-primary opacity-100' : 'border-outline-variant/35 opacity-40 hover:opacity-75'
                  }`}
                >
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-secondary uppercase tracking-widest leading-none mb-1">
                        {step.subtitle}
                      </span>
                      <h3 className="font-display text-2xl md:text-3xl text-primary font-medium tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Key Achievement Bullet */}
                  <div className="flex items-center gap-2 pt-2 text-xs font-bold text-primary">
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    <span>Verified Bio-Potency: {idx === 0 ? 'Pure Raw Actives' : idx === 1 ? '100% Enzyme Retention' : '98% Absorption Rate'}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
