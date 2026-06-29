import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Beaker, Check, HelpCircle, AlertCircle } from 'lucide-react';

interface Concern {
  id: string;
  label: string;
  desc: string;
}

const concerns: Concern[] = [
  { id: 'thinning', label: 'Hair Thinning & Fall', desc: 'Shedding, weak roots, and slow hair growth.' },
  { id: 'dandruff', label: 'Dandruff & Dry Scalp', desc: 'Flaking, itchiness, and dry scalp irritation.' },
  { id: 'damage', label: 'Frizz & Damage Repair', desc: 'Split ends, chemical damage, and rough hair texture.' },
  { id: 'greying', label: 'Premature Greying', desc: 'Loss of natural melanin pigment and dull color.' }
];

interface HerbRatio {
  name: string;
  color: string;
  basePercent: number;
  boostedPercent: number;
  description: string;
}

const herbData: Record<string, HerbRatio> = {
  bringaraj: {
    name: 'Bringaraj (False Daisy)',
    color: 'bg-emerald-800',
    basePercent: 25,
    boostedPercent: 45,
    description: 'Increases follicle stimulation, prevents hair fall, and stimulates thick growth.'
  },
  amla: {
    name: 'Amla (Gooseberry)',
    color: 'bg-amber-600',
    basePercent: 25,
    boostedPercent: 45,
    description: 'Rich in Vitamin C, synthesizes collagen, and prevents premature greying.'
  },
  rosemary: {
    name: 'Rosemary Active Extract',
    color: 'bg-emerald-600',
    basePercent: 25,
    boostedPercent: 40,
    description: 'Improves blood circulation in the scalp and stimulates cell division.'
  },
  hibiscus: {
    name: 'Hibiscus Flower Infusion',
    color: 'bg-red-700',
    basePercent: 25,
    boostedPercent: 40,
    description: 'Acts as a natural conditioner, seals cuticles, and smooths split ends.'
  }
};

export default function BlendCustomizer() {
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(['thinning']);

  const toggleConcern = (id: string) => {
    setSelectedConcerns(prev => {
      if (prev.includes(id)) {
        // Keep at least one concern selected to show ratios
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== id);
      }
      return [...prev, id];
    });
  };

  // Calculate customized ratios based on selected concerns
  const getRatios = () => {
    let ratios = { bringaraj: 25, amla: 25, rosemary: 25, hibiscus: 25 };

    if (selectedConcerns.includes('thinning')) {
      ratios.bringaraj = herbData.bringaraj.boostedPercent;
      ratios.rosemary = 30;
    }
    if (selectedConcerns.includes('dandruff')) {
      ratios.rosemary = herbData.rosemary.boostedPercent;
      ratios.bringaraj = Math.max(ratios.bringaraj, 25);
    }
    if (selectedConcerns.includes('damage')) {
      ratios.hibiscus = herbData.hibiscus.boostedPercent;
    }
    if (selectedConcerns.includes('greying')) {
      ratios.amla = herbData.amla.boostedPercent;
    }

    // Normalize so that sum = 100%
    const sum = ratios.bringaraj + ratios.amla + ratios.rosemary + ratios.hibiscus;
    return {
      bringaraj: Math.round((ratios.bringaraj / sum) * 100),
      amla: Math.round((ratios.amla / sum) * 100),
      rosemary: Math.round((ratios.rosemary / sum) * 100),
      hibiscus: Math.round((ratios.hibiscus / sum) * 100)
    };
  };

  const ratios = getRatios();

  const getDynamicMessage = () => {
    if (selectedConcerns.includes('thinning') && selectedConcerns.includes('greying')) {
      return 'Your formulation is heavily concentrated with Bhringraj and Amla to target weak roots while restoring organic dark pigment to premature grey strands.';
    }
    if (selectedConcerns.includes('thinning') && selectedConcerns.includes('dandruff')) {
      return 'Optimized with therapeutic Rosemary oil and Bhringraj to eradicate dry flakes while boosting root oxygen levels to prevent hair fall.';
    }
    if (selectedConcerns.includes('damage')) {
      return 'Enriched with Hibiscus natural mucilage to restore structural protein, sealing broken cuticles and reviving dry, chemically-treated fibers.';
    }
    return 'Optimized for deep cellular nutrition and protective moisture to stimulate healthy, active follicle growth.';
  };

  return (
    <section className="py-24 md:py-32 bg-[#FAF9F5] border-t border-b border-outline-variant/20 relative overflow-hidden">
      {/* Decorative styling */}
      <div className="absolute top-1/3 left-5 w-[300px] h-[300px] bg-secondary-container/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/3 right-5 w-[300px] h-[300px] bg-primary-fixed-dim/15 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
          <span className="font-body text-xs font-semibold text-secondary tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            <Beaker className="w-4 h-4 text-secondary animate-pulse" /> Botanical Lab
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-primary font-medium tracking-tight">
            Compound Your Custom Elixir
          </h2>
          <p className="font-body text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Select your specific hair concerns below and watch our clinical wood-pressed botanical ratios adjust in real-time inside the compounding flask.
          </p>
        </div>

        {/* Customizer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Concern Selectors */}
          <div className="col-span-1 lg:col-span-6 space-y-5 text-left">
            <h3 className="font-display text-2xl text-primary font-medium mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" /> Step 1: Tell us about your hair
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {concerns.map((concern) => {
                const isSelected = selectedConcerns.includes(concern.id);
                return (
                  <button
                    key={concern.id}
                    onClick={() => toggleConcern(concern.id)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-36 cursor-pointer ${
                      isSelected 
                        ? 'bg-primary border-primary text-white shadow-md' 
                        : 'bg-white border-outline-variant/35 text-primary hover:border-secondary/45 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-display text-lg font-medium leading-tight">{concern.label}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected 
                          ? 'bg-secondary border-secondary text-white' 
                          : 'border-outline-variant/40 bg-transparent text-transparent'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                    <p className={`font-body text-xs leading-relaxed mt-2 ${
                      isSelected ? 'text-white/80' : 'text-on-surface-variant'
                    }`}>
                      {concern.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Clinical Summary */}
            <div className="mt-8 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="block font-body text-xs font-bold text-secondary uppercase tracking-widest mb-1">Formulation Analysis</span>
                <p className="font-body text-sm text-[#4B5563] leading-relaxed">
                  {getDynamicMessage()}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Compounding Flask */}
          <div className="col-span-1 lg:col-span-6 flex flex-col md:flex-row items-center gap-10 md:gap-16 justify-center">
            
            {/* Visual Glass Flask */}
            <div className="relative w-64 h-96 flex flex-col justify-end items-center bg-[#FDFDFD] border border-outline-variant/30 rounded-t-[100px] rounded-b-[40px] shadow-2xl p-4 overflow-hidden">
              {/* Bottle Neck Details */}
              <div className="absolute top-0 w-24 h-12 border-b border-outline-variant/30 bg-transparent -mt-6 rounded-b-xl" />
              
              {/* Liquid Layers */}
              <div className="w-full h-full flex flex-col justify-end overflow-hidden rounded-b-3xl">
                
                {/* Hibiscus Layer (soft crimson) */}
                <motion.div 
                  animate={{ height: `${ratios.hibiscus}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`${herbData.hibiscus.color} w-full flex items-center justify-center relative min-h-[5px]`}
                >
                  <span className="text-[10px] font-bold text-white/70 absolute">Hibiscus {ratios.hibiscus}%</span>
                </motion.div>

                {/* Amla Layer (amber) */}
                <motion.div 
                  animate={{ height: `${ratios.amla}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`${herbData.amla.color} w-full flex items-center justify-center relative min-h-[5px]`}
                >
                  <span className="text-[10px] font-bold text-white/70 absolute">Amla {ratios.amla}%</span>
                </motion.div>

                {/* Rosemary Layer (pale green) */}
                <motion.div 
                  animate={{ height: `${ratios.rosemary}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`${herbData.rosemary.color} w-full flex items-center justify-center relative min-h-[5px]`}
                >
                  <span className="text-[10px] font-bold text-white/70 absolute">Rosemary {ratios.rosemary}%</span>
                </motion.div>

                {/* Bringaraj Layer (deep green) */}
                <motion.div 
                  animate={{ height: `${ratios.bringaraj}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`${herbData.bringaraj.color} w-full flex items-center justify-center relative min-h-[5px]`}
                >
                  <span className="text-[10px] font-bold text-white/70 absolute font-body">Bhringraj {ratios.bringaraj}%</span>
                </motion.div>

              </div>
              
              {/* Measurement lines */}
              <div className="absolute left-6 top-24 bottom-16 w-3 border-l border-primary/20 flex flex-col justify-between py-2 text-[9px] font-semibold text-primary/30">
                <span>100ml</span>
                <span>80ml</span>
                <span>60ml</span>
                <span>40ml</span>
                <span>20ml</span>
              </div>
            </div>

            {/* Custom Formula Ingredients Progress Details */}
            <div className="flex-grow w-full max-w-sm space-y-5 text-left">
              <h4 className="font-body text-xs font-bold text-[#6B7280] uppercase tracking-widest border-b border-outline-variant/20 pb-2">
                Active Recipe ratios
              </h4>
              
              <div className="space-y-4">
                {/* Bringaraj Detail */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-primary">{herbData.bringaraj.name}</span>
                    <span className="text-secondary">{ratios.bringaraj}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${ratios.bringaraj}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full ${herbData.bringaraj.color}`} 
                    />
                  </div>
                </div>

                {/* Rosemary Detail */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-primary">{herbData.rosemary.name}</span>
                    <span className="text-secondary">{ratios.rosemary}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${ratios.rosemary}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full ${herbData.rosemary.color}`} 
                    />
                  </div>
                </div>

                {/* Amla Detail */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-primary">{herbData.amla.name}</span>
                    <span className="text-secondary">{ratios.amla}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${ratios.amla}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full ${herbData.amla.color}`} 
                    />
                  </div>
                </div>

                {/* Hibiscus Detail */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-primary">{herbData.hibiscus.name}</span>
                    <span className="text-secondary">{ratios.hibiscus}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${ratios.hibiscus}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full ${herbData.hibiscus.color}`} 
                    />
                  </div>
                </div>
              </div>

              {/* Order Button */}
              <button 
                onClick={() => {
                  const target = document.getElementById('products-catalog');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-primary text-on-primary font-body text-xs font-bold tracking-[0.1em] uppercase py-4 rounded-full shadow-md hover:shadow-lg hover:bg-primary-container transition-all cursor-pointer text-center block mt-6"
              >
                View Curated Hair Catalog
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
