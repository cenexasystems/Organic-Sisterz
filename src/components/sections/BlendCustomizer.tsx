import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, AlertCircle } from 'lucide-react';

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
}

const herbData: Record<string, HerbRatio> = {
  panneerRose: {
    name: 'Panneer Rose',
    color: 'bg-[#db2777]', // Pink
    basePercent: 25,
    boostedPercent: 45,
  },
  jadamansi: {
    name: 'Jadamansi Root',
    color: 'bg-[#92400e]', // Amber/Brown
    basePercent: 25,
    boostedPercent: 45,
  },
  mahizhamFlower: {
    name: 'Mahizham Flowers',
    color: 'bg-[#ca8a04]', // Golden/Yellow
    basePercent: 25,
    boostedPercent: 40,
  },
  hibiscus: {
    name: 'Hibiscus Infusion',
    color: 'bg-[#b91c1c]', // Red
    basePercent: 25,
    boostedPercent: 40,
  }
};

export default function BlendCustomizer() {
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(['thinning']);

  const toggleConcern = (id: string) => {
    setSelectedConcerns(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== id);
      }
      return [...prev, id];
    });
  };

  const getRatios = () => {
    let ratios = { panneerRose: 25, jadamansi: 25, mahizhamFlower: 25, hibiscus: 25 };

    if (selectedConcerns.includes('thinning')) {
      ratios.panneerRose = herbData.panneerRose.boostedPercent;
      ratios.mahizhamFlower = 30;
    }
    if (selectedConcerns.includes('dandruff')) {
      ratios.mahizhamFlower = herbData.mahizhamFlower.boostedPercent;
      ratios.panneerRose = Math.max(ratios.panneerRose, 25);
    }
    if (selectedConcerns.includes('damage')) {
      ratios.hibiscus = herbData.hibiscus.boostedPercent;
    }
    if (selectedConcerns.includes('greying')) {
      ratios.jadamansi = herbData.jadamansi.boostedPercent;
    }

    const sum = ratios.panneerRose + ratios.jadamansi + ratios.mahizhamFlower + ratios.hibiscus;
    return {
      panneerRose: Math.round((ratios.panneerRose / sum) * 100),
      jadamansi: Math.round((ratios.jadamansi / sum) * 100),
      mahizhamFlower: Math.round((ratios.mahizhamFlower / sum) * 100),
      hibiscus: Math.round((ratios.hibiscus / sum) * 100)
    };
  };

  const ratios = getRatios();

  const getDynamicMessage = () => {
    if (selectedConcerns.includes('thinning') && selectedConcerns.includes('greying')) {
      return 'Your formulation is heavily concentrated with Panneer Rose and Jadamansi to target weak roots while restoring organic dark pigment to premature grey strands.';
    }
    if (selectedConcerns.includes('thinning') && selectedConcerns.includes('dandruff')) {
      return 'Optimized with therapeutic Mahizham Flowers and Panneer Rose to eradicate dry flakes while boosting root oxygen levels to prevent hair fall.';
    }
    if (selectedConcerns.includes('damage')) {
      return 'Enriched with Hibiscus natural mucilage to restore structural protein, sealing broken cuticles and reviving dry, chemically-treated fibers.';
    }
    return 'Optimized for deep cellular nutrition and protective moisture to stimulate healthy, active follicle growth.';
  };

  return (
    <section className="py-24 bg-[#FAF9F5] border-t border-b border-outline-variant/20 relative">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Quiz & Analysis */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
            <h3 className="font-display text-[28px] text-primary font-medium flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-secondary" /> Step 1: Tell us about your hair
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {concerns.map((concern) => {
                const isSelected = selectedConcerns.includes(concern.id);
                return (
                  <button
                    key={concern.id}
                    onClick={() => toggleConcern(concern.id)}
                    className={`p-5 rounded-[20px] border text-left transition-all duration-300 flex flex-col justify-between min-h-[140px] cursor-pointer ${
                      isSelected 
                        ? 'bg-[#0C1E14] border-[#0C1E14] text-white shadow-md' 
                        : 'bg-white border-outline-variant/35 text-primary hover:border-secondary/45 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-display text-[17px] font-bold leading-tight">{concern.label}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                        isSelected 
                          ? 'bg-[#3E5247] border-[#4A5D52] text-[#A7F3D0]' 
                          : 'border-outline-variant/40 bg-transparent text-transparent'
                      }`}>
                        {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <div className="w-3 h-3" />}
                      </div>
                    </div>
                    <p className={`font-body text-[13px] leading-relaxed mt-4 opacity-90 ${
                      isSelected ? 'text-[#A0AAB2]' : 'text-[#6B7280]'
                    }`}>
                      {concern.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Formulation Analysis Box */}
            <div className="mt-2 bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4 text-[#059669]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-body text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.15em]">
                  Formulation Analysis
                </span>
                <p className="font-body text-[14px] text-[#4B5563] leading-relaxed">
                  {getDynamicMessage()}
                </p>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: Liquid Pill */}
          <div className="col-span-1 lg:col-span-3 flex justify-center lg:mt-10">
            <div className="relative w-64 h-[450px] bg-white rounded-[100px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex justify-center items-center overflow-hidden p-3 border border-outline-variant/20">
              
              {/* Inner Liquid Container */}
              <div className="w-full h-full rounded-[85px] overflow-hidden flex flex-col justify-end relative">
                
                {/* Measurement lines */}
                <div className="absolute left-4 top-16 bottom-16 w-3 border-l border-white/30 flex flex-col justify-between py-2 text-[10px] font-bold text-white/50 z-20">
                  <span>100ml</span>
                  <span>80ml</span>
                  <span>60ml</span>
                  <span>40ml</span>
                  <span>20ml</span>
                </div>

                {/* Hibiscus Layer */}
                <motion.div 
                  animate={{ height: `${ratios.hibiscus}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`${herbData.hibiscus.color} w-full flex flex-col justify-center items-center relative z-10`}
                >
                  <span className="text-[11px] font-bold text-white block pl-8">Hibiscus {ratios.hibiscus}%</span>
                </motion.div>

                {/* Jadamansi Layer */}
                <motion.div 
                  animate={{ height: `${ratios.jadamansi}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`${herbData.jadamansi.color} w-full flex flex-col justify-center items-center relative z-10`}
                >
                  <span className="text-[11px] font-bold text-white block pl-8">Jadamansi {ratios.jadamansi}%</span>
                </motion.div>

                {/* Mahizham Flower Layer */}
                <motion.div 
                  animate={{ height: `${ratios.mahizhamFlower}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`${herbData.mahizhamFlower.color} w-full flex flex-col justify-center items-center relative z-10`}
                >
                  <span className="text-[11px] font-bold text-white block pl-8">Mahizham {ratios.mahizhamFlower}%</span>
                </motion.div>

                {/* Panneer Rose Layer */}
                <motion.div 
                  animate={{ height: `${ratios.panneerRose}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`${herbData.panneerRose.color} w-full flex flex-col justify-center items-center relative z-10`}
                >
                  <span className="text-[11px] font-bold text-white block pl-8">Panneer Rose {ratios.panneerRose}%</span>
                </motion.div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Ratios & Button */}
          <div className="col-span-1 lg:col-span-4 flex flex-col justify-center lg:mt-16 gap-8">
            <h4 className="font-body text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.15em] border-b border-outline-variant/30 pb-3">
              Active Recipe ratios
            </h4>
            
            <div className="flex flex-col gap-6">
              {/* Panneer Rose Detail */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between font-display text-[14px] font-bold text-[#111827]">
                  <span>{herbData.panneerRose.name}</span>
                  <span>{ratios.panneerRose}%</span>
                </div>
                <div className="h-2 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${ratios.panneerRose}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full ${herbData.panneerRose.color}`} 
                  />
                </div>
              </div>

              {/* Mahizham Flower Detail */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between font-display text-[14px] font-bold text-[#111827]">
                  <span>{herbData.mahizhamFlower.name}</span>
                  <span>{ratios.mahizhamFlower}%</span>
                </div>
                <div className="h-2 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${ratios.mahizhamFlower}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full ${herbData.mahizhamFlower.color}`} 
                  />
                </div>
              </div>

              {/* Jadamansi Detail */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between font-display text-[14px] font-bold text-[#111827]">
                  <span>{herbData.jadamansi.name}</span>
                  <span>{ratios.jadamansi}%</span>
                </div>
                <div className="h-2 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${ratios.jadamansi}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full ${herbData.jadamansi.color}`} 
                  />
                </div>
              </div>

              {/* Hibiscus Detail */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between font-display text-[14px] font-bold text-[#111827]">
                  <span>{herbData.hibiscus.name}</span>
                  <span>{ratios.hibiscus}%</span>
                </div>
                <div className="h-2 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${ratios.hibiscus}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full ${herbData.hibiscus.color}`} 
                  />
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => {
                const target = document.getElementById('products-catalog');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-4 w-full bg-[#0C1E14] text-white font-body text-[11px] font-bold tracking-[0.15em] uppercase py-5 rounded-full shadow-[0_10px_20px_rgba(12,30,20,0.2)] hover:bg-[#1A3123] hover:shadow-[0_15px_30px_rgba(12,30,20,0.3)] transition-all duration-300 cursor-pointer text-center"
            >
              View Curated Hair Catalog
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
