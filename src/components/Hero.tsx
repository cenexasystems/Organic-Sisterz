import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center pt-24 pb-20 md:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="col-span-1 lg:col-span-5 flex flex-col justify-center space-y-8 z-10 order-2 lg:order-1"
        >
          <div className="space-y-4">
            <span className="font-body text-xs font-semibold text-secondary tracking-[0.2em] uppercase">
              Clinical Botanical
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary leading-[1.1] font-medium tracking-tight">
              The Art of Botanical Healing.
            </h1>
          </div>
          <p className="font-body text-lg text-on-surface-variant max-w-md leading-relaxed">
            Meticulously sourced, scientifically validated. We bridge the gap between ancient herbal wisdom and modern clinical efficacy.
          </p>
          <div className="pt-4">
            <button className="bg-primary text-on-primary font-body text-xs font-semibold tracking-[0.1em] uppercase px-8 py-4 rounded-full hover:bg-primary-container transition-colors duration-300">
              Explore Formulations
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="col-span-1 lg:col-span-7 relative h-[50vh] md:h-[70vh] w-full order-1 lg:order-2 overflow-hidden rounded-2xl group"
        >
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi8gtIvyu44eI0wdsqxbA3swpU1w3pmT32gR3aeELcR8HMw9Lqu1ePVaCnJd5mOiUfUQfglThoYVm_jprlrJXCCo9hGtXPDOOlfAP7v7R9HYgr2Lv-Bvpus9JkSO8IPXhZY0r5mt_u9W6kCxVxUaMJpVKzrlj9f4I1WcbmTDPBOETdysU2-8ImOe2GUIJR6cU60OtKvhfe_jcVfw2znUvNGeOxv0dzktdVBpHWEU4tILo8VB9Pkx4MWk72XaEbD9pmncIGI9DGZoE" 
            alt="Organic Sistez Herbal Hair Oil bottle on travertine stone" 
            className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-[2s] ease-out"
          />
        </motion.div>
      </div>
    </section>
  );
}
