import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFinished(true);
            setTimeout(onComplete, 1200); // Allow staggered panel exit to fully run
          }, 500);
          return 100;
        }
        // Realistic step increments for loading
        const increment = Math.floor(Math.random() * 6) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  const getStatusText = (prog: number) => {
    if (prog < 25) return "Sourcing Wild Botanicals";
    if (prog < 50) return "Supercritical Cold Extraction";
    if (prog < 75) return "Bio-Standardizing Active Compounds";
    return "Optimizing Transdermal Delivery";
  };

  const title = "ORGANIC SISTERZ";

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="fixed inset-0 z-[999] select-none overflow-hidden"
        >
          {/* Panel 3: Premium Cream Beige (Top Layer - containing Content) */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0 }}
            className="absolute inset-0 bg-[#f5f2eb] z-[3] flex flex-col items-center justify-center text-[#061b0e]"
          >
            {/* Ambient biological lighting */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#cee6c9]/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#819986]/10 rounded-full blur-[100px]" />

            {/* Glowing circular backdrop */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Spinning Botanical Seal */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="mb-10 relative"
              >
                {/* Thin outer circular border */}
                <div className="w-24 h-24 rounded-full border border-[#061b0e]/15 flex items-center justify-center relative bg-white/20 backdrop-blur-sm shadow-[0_4px_24px_rgba(6,27,14,0.03)]">
                  {/* Rotating circular dash ring */}
                  <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      stroke="#061b0e"
                      strokeWidth="1"
                      strokeDasharray="4 8"
                      fill="none"
                      opacity="0.25"
                    />
                  </svg>
                  
                  {/* Leaf Icon inside */}
                  <svg className="w-8 h-8 text-[#061b0e] opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 3c-4.5 0-8 3.5-8 8s3.5 8 8 10M12 3c4.5 0 8 3.5 8 8s-3.5 8-8 10M4 11c3 0 6 2 8 5M20 11c-3 0-6 2-8 5" />
                  </svg>
                </div>
              </motion.div>

              {/* Title: letter by letter reveal */}
              <div className="flex gap-[0.1em] justify-center mb-2">
                {title.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.2 + index * 0.04,
                      duration: 0.8,
                      ease: [0.215, 0.61, 0.355, 1]
                    }}
                    className="font-accent text-3xl md:text-4xl font-normal tracking-widest text-[#061b0e]"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="font-body text-[9px] tracking-[0.35em] uppercase text-[#061b0e] font-semibold mb-14"
              >
                Clinical Botanical Science
              </motion.p>

              {/* Modern Minimalist Easing Progress Bar */}
              <div className="w-56 space-y-4">
                <div className="h-[1px] w-full bg-[#061b0e]/10 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full bg-[#061b0e] rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
                
                <div className="flex flex-col items-center space-y-1">
                  <span className="font-body text-[9px] font-bold tracking-widest uppercase text-[#061b0e]/85">
                    {getStatusText(progress)}
                  </span>
                  <span className="font-body text-[11px] font-medium tracking-widest text-[#061b0e]/50">
                    {progress}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Panel 2: Soft Sage Green (Middle Layer) */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.08 }}
            className="absolute inset-0 bg-[#819986] z-[2]"
          />

          {/* Panel 1: Deep Forest Green (Bottom Layer) */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.16 }}
            className="absolute inset-0 bg-[#061b0e] z-[1]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
