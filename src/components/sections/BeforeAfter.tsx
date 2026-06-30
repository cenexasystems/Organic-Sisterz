import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRightLeft } from "lucide-react";

export default function BeforeAfter() {
  const [showAfter, setShowAfter] = useState(false);

  // Automatically toggle every 3 seconds for a smooth, effortless experience
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAfter((prev) => !prev);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="before-after"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-1 lg:col-span-5 space-y-8"
          >
            <div className="space-y-4">
              <span className="font-body text-xs font-semibold text-secondary tracking-[0.2em] uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" /> Customer Results
              </span>
              <h2 className="font-display text-4xl lg:text-5xl text-primary font-medium tracking-tight leading-tight">
                Real Results
              </h2>
            </div>

            <p className="font-body text-base text-on-surface-variant leading-relaxed">
              See the difference. Our herbal products use pure natural
              ingredients to clear dandruff, stop hair fall, and restore healthy
              shine naturally.
            </p>

            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-secondary font-bold text-xs shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-display text-lg text-primary font-medium">
                    Stops Hair Fall
                  </h4>
                  <p className="font-body text-sm text-on-surface-variant mt-1">
                    Natural herbs like Bhringraj and Amla strengthen hair roots
                    and reduce hair loss.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-secondary font-bold text-xs shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-display text-lg text-primary font-medium">
                    Clears Dandruff
                  </h4>
                  <p className="font-body text-sm text-on-surface-variant mt-1">
                    Gentle cleansing properties keep the scalp clean and prevent
                    dryness and flaking.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Framer Motion Crossfade Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-1 lg:col-span-7 flex flex-col items-center relative"
          >
            <div
              className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 bg-white cursor-pointer group"
              onClick={() => setShowAfter(!showAfter)}
            >
              <AnimatePresence initial={false}>
                {!showAfter ? (
                  <motion.div
                    key="before"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=1200"
                      alt="Before treatment"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#4A2E1B] text-[#FAF9F5] font-body text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-lg">
                      Before Treatment
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="after"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1595959183075-c1d09e519690?auto=format&fit=crop&q=80&w=1200"
                      alt="After treatment"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-[#061B0E] text-[#FAF9F5] font-body text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-lg">
                      After 12 Weeks
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Interaction Hint */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-white px-5 py-2.5 rounded-full flex items-center gap-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRightLeft className="w-4 h-4 text-secondary" />
                <span className="font-body text-[10px] font-bold tracking-widest text-primary uppercase">
                  Click to Swap
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
