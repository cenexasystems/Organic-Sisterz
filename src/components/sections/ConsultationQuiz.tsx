import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Activity, ShieldCheck, HeartPulse } from 'lucide-react';

interface ConsultationQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: { label: string; value: string; description: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    title: "Identify Your Hair Texture",
    subtitle: "Select the option that matches your natural, dry hair strand shape.",
    options: [
      { label: "Straight & Fine", value: "straight", description: "Lies flat, easily weighed down by heavy botanical lipids." },
      { label: "Wavy & Medium", value: "wavy", description: "Gentle 'S' shapes, prone to light frizz and dry ends." },
      { label: "Curly & Thick", value: "curly", description: "Defined loops, requires regular structural moisture." },
      { label: "Coily & Textured", value: "coily", description: "Tight corkscrews, highly porous, needs intense lipid protection." }
    ]
  },
  {
    id: 2,
    title: "Primary Scalp Concern",
    subtitle: "What is the key obstacle you would like to target clinically?",
    options: [
      { label: "Follicle Thinning & Loss", value: "thinning", description: "Increasing scalp visibility, wider parting, or excessive shedding." },
      { label: "Dryness, Flakes & Itchiness", value: "dryness", description: "Tight scalp sensation, dry white flakes, easily irritated." },
      { label: "Excessive Sebum & Oil", value: "sebum", description: "Greasy hair within 24 hours, clogged hair follicles, limp roots." },
      { label: "Frizz & Structural Breakage", value: "breakage", description: "Split ends, rough hair shaft texture, lack of natural elasticity." }
    ]
  },
  {
    id: 3,
    title: "Environmental & Styling Stressors",
    subtitle: "Which factors describe your hair care habits and exposure?",
    options: [
      { label: "Frequent Heat Styling", value: "heat", description: "Blow-drying, flat ironing, or curling weekly." },
      { label: "Chemical or Color Treatments", value: "chemical", description: "Bleached, highlighted, perm, or keratin treated." },
      { label: "High Sun or Hard Water", value: "environment", description: "Regular sun exposure, outdoor activity, or mineral-heavy water." },
      { label: "Minimal Exposure / Untreated", value: "minimal", description: "No regular dyes or high heat, low manipulation." }
    ]
  }
];

export default function ConsultationQuiz({ isOpen, onClose }: ConsultationQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSelectOption = (value: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentStep].id]: value }));
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 300);
    } else {
      // Final question answered, run clinical diagnosis simulation
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        generateDiagnosis();
      }, 2500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

    const generateDiagnosis = () => {
      const concern = answers[2]; // concern value
      let recommendation = {
        product: "Herbal Hair Oil",
        routine: "Apply a small quantity directly to hair roots and scalp. Massage gently in circular motions, leave on for 10 to 15 minutes, then wash off.",
        actives: "Amla, Neem, Vetiver & Karisalankanni (40 Herbs)",
        focus: "Arresting active hair fall, cooling scalp tension, and nourishing deep hair roots.",
        efficacy: "42% increase in hair density, 99% organic bioavailability",
        image: "/mahizham_hair_oil.png"
      };
  
      if (concern === "dryness" || concern === "sebum") {
        recommendation = {
          product: "Herbal Shikakai Powder (Bio Hair Wash)",
          routine: "Take a small quantity of Shikakai powder, mix with water to form a smooth paste. Apply evenly to wet hair and scalp, massage gently, wait 10 minutes, and rinse thoroughly.",
          actives: "Shikakai, Arappu, Methi, Amla & Hibiscus (40 Herbs)",
          focus: "Mild natural foaming cleansing, balancing scalp sebum pH, and eradicating active dandruff flakes.",
          efficacy: "100% sulfate-free organic wash, natural anti-dandruff protection",
          image: "/mahizham_shikakai_powder.png"
        };
      } else if (concern === "breakage") {
        recommendation = {
          product: "Face Pack & Bath Powder",
          routine: "Mix powder with water or coconut oil to form a paste. Apply to skin or face, let sit for 10 minutes, and rinse off. Safe to use daily in place of soap.",
          actives: "Aavaram Senna, Wild Turmeric, Vetiver & Red Sandal (50 Herbs)",
          focus: "Deep skin barrier cleansing, clearing acne/pimples, tan removal, and skin softening.",
          efficacy: "65% accelerated skin lipid replenishment, 100% soap-free daily wash",
          image: "/mahizham_bath_powder.png"
        };
      }

    setResult(recommendation);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setIsAnalyzing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/40 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-4 md:inset-auto md:w-full md:max-w-2xl md:h-[650px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 z-50 flex flex-col md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-outline-variant/30 shrink-0">
              <span className="font-body text-xs font-semibold text-secondary tracking-widest uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Scalp Diagnostics
              </span>
              <button 
                onClick={onClose}
                className="p-1 text-primary hover:bg-surface-container rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {/* 1. Analyzing Screen */}
                {isAnalyzing && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center space-y-6 py-12"
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-outline-variant/30 animate-spin border-t-secondary" />
                      <Activity className="w-6 h-6 text-secondary absolute animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl text-primary font-medium">Compounding Diagnostics...</h3>
                      <p className="font-body text-xs text-on-surface-variant max-w-xs mx-auto">
                        Evaluating botanical synergy percentages based on cellular bio-absorption rates and cuticle elasticity.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 2. Results Recommendation */}
                {!isAnalyzing && result && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col md:flex-row gap-8 py-4 h-full"
                  >
                    {/* Visual */}
                    <div className="w-full md:w-2/5 aspect-[4/5] rounded-2xl overflow-hidden relative border border-outline-variant/20 shrink-0 h-48 md:h-auto">
                      <img src={result.image} alt={result.product} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                    </div>

                    {/* details */}
                    <div className="flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div>
                          <span className="font-body text-[10px] font-bold text-secondary tracking-widest uppercase block mb-1">
                            Your Clinical Match
                          </span>
                          <h3 className="font-display text-2xl md:text-3xl text-primary font-medium leading-tight">
                            {result.product}
                          </h3>
                        </div>

                        <div className="space-y-3 font-body text-xs text-on-surface-variant leading-relaxed">
                          <p className="flex gap-2 items-start">
                            <ShieldCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                            <span><strong>Target Focus:</strong> {result.focus}</span>
                          </p>
                          <p className="flex gap-2 items-start">
                            <Sparkles className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                            <span><strong>Active Ingredients:</strong> {result.actives}</span>
                          </p>
                          <p className="flex gap-2 items-start">
                            <HeartPulse className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                            <span><strong>Directions:</strong> {result.routine}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4 border-t border-outline-variant/25">
                        <button
                          onClick={handleReset}
                          className="px-6 py-3.5 rounded-full border border-outline font-body text-[11px] font-semibold tracking-widest uppercase hover:bg-surface-container-low transition-colors cursor-pointer text-primary"
                        >
                          Retake Quiz
                        </button>
                        <button
                          onClick={onClose}
                          className="flex-grow bg-primary text-on-primary font-body text-[11px] font-semibold tracking-widest uppercase py-3.5 rounded-full hover:bg-primary-container transition-colors cursor-pointer text-center"
                        >
                          Add to Formulation Drawer
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. Diagnostic Questions */}
                {!isAnalyzing && !result && (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 h-full flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-body text-[10px] text-on-surface-variant font-bold tracking-widest uppercase block mb-1">
                        Question {currentStep + 1} of {questions.length}
                      </span>
                      <h3 className="font-display text-2xl md:text-3xl text-primary font-medium mb-2 leading-tight">
                        {questions[currentStep].title}
                      </h3>
                      <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                        {questions[currentStep].subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 py-4">
                      {questions[currentStep].options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSelectOption(option.value)}
                          className="text-left p-4 rounded-xl border border-outline-variant/40 hover:border-secondary hover:bg-surface-container-low transition-all duration-300 group cursor-pointer"
                        >
                          <span className="block font-body text-xs font-semibold text-primary group-hover:text-secondary mb-0.5">
                            {option.label}
                          </span>
                          <span className="block font-body text-[11px] text-on-surface-variant">
                            {option.description}
                          </span>
                        </button>
                      ))}
                    </div>

                    {currentStep > 0 && (
                      <button
                        onClick={handleBack}
                        className="font-body text-[10px] font-bold text-on-surface-variant hover:text-primary tracking-widest uppercase mr-auto flex items-center gap-1.5 transition-colors cursor-pointer py-2"
                      >
                        ← Back
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
