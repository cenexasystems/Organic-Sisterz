import { motion } from 'motion/react';

export default function Sourcing() {
  return (
    <section className="py-24 md:py-32 bg-surface-container-low">
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-1 lg:col-span-6 relative h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden group"
          >
            <img 
              src="/multi-millet-health-mix.jpeg" 
              alt="Mahizham Multi Millet Health Mix packaging showing natural grains and roasted nuts" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s] ease-in-out"
            />
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-700" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="col-span-1 lg:col-span-5 lg:col-start-8 space-y-10"
          >
            <div className="space-y-6">
              <h2 className="font-display text-4xl lg:text-5xl text-primary font-medium tracking-tight">Sourcing Transparency</h2>
              <div className="w-12 h-px bg-outline-variant"></div>
            </div>
            
            <div className="space-y-6 text-on-surface-variant font-body text-base leading-relaxed">
              <p>
                True efficacy begins at the source. Our rigorous selection process involves direct partnerships with traditional farmers across India who cultivate native crops like Shikakai, Aavaram Senna, and Amla using chemical-free, pesticide-free methods.
              </p>
              <p>
                Every leaf, pod, and flower is carefully hand-sorted, sun-dried, and finely pulverized to preserve their raw potency. We guarantee 100% natural, whole-ingredient composition with absolutely zero synthetic fillers, sulfates, or chemical preservatives.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-6 md:p-8 bg-white/50 backdrop-blur-md rounded-xl border border-white">
                <span className="block font-display text-5xl text-primary mb-3">99%</span>
                <span className="font-body text-xs font-semibold tracking-widest uppercase text-on-surface-variant">Bioavailability</span>
              </div>
              <div className="p-6 md:p-8 bg-white/50 backdrop-blur-md rounded-xl border border-white">
                <span className="block font-display text-5xl text-primary mb-3">0%</span>
                <span className="font-body text-xs font-semibold tracking-widest uppercase text-on-surface-variant">Synthetic Fillers</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
