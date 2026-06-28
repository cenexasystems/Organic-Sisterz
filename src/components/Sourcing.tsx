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
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbH6pEP1GOJKIPT7NYoRe3timqwuvNo59cNJ1Fc1-rF5SWWChqsr1daktfJS1MISMeP3dzhMYv8-0pFEnQQkHxOPPQwflDCfSG1W48KVXabP5IJ2h3ggrgtt_j_zbY4tIgOwu7hW-HK_VfdD7ag9d8miqpcG1vT0swmsO7vkF2MdZAeiP8zwc--n3CaW1KAX8_n3nyceN65olG1JpwMR5mioR5wUN2DADoFUybag0dlH0kJ3xA5THzwVsTTtOQAPoLDSasPnBvjNo" 
              alt="Clinical botanical extraction process in laboratory" 
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
                True efficacy begins at the source. Our rigorous selection process involves direct partnerships with cultivators who employ regenerative farming practices, ensuring the highest concentration of bioactive compounds.
              </p>
              <p>
                Every botanical is subjected to advanced high-performance liquid chromatography (HPLC) to verify purity and potency before it enters our laboratory. We do not compromise on clinical integrity.
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
