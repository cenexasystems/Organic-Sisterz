import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf } from 'lucide-react';

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
            setTimeout(onComplete, 800); // Allow slide-up animation to complete
          }, 400);
          return 100;
        }
        // Increment by random amounts to simulate realistic load
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[999] bg-primary flex flex-col items-center justify-center text-on-primary select-none overflow-hidden"
        >
          {/* Background ambient lighting */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-secondary-container/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-fixed/5 rounded-full blur-3xl" />

          {/* Animated botanical icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md">
              <Leaf className="w-6 h-6 text-on-primary-container animate-pulse" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-3xl md:text-4xl font-medium tracking-wide mb-2 text-center"
          >
            Organic Sistez
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-body text-[10px] tracking-[0.25em] uppercase text-on-primary-container mb-12"
          >
            Clinical Botanical Science
          </motion.p>

          {/* Progress bar and counter */}
          <div className="w-48 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-on-primary-container/80">
              <span>Formulating</span>
              <span>{progress}%</span>
            </div>
            
            <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-on-primary-container rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
