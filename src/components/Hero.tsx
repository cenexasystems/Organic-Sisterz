import { motion, useMotionValue, useTransform } from 'motion/react';
import { ArrowDown, Sparkles, ShieldCheck, Heart, Leaf, Star } from 'lucide-react';
import InteractiveParticles from './InteractiveParticles';

interface HeroProps {
  onConsultationClick: () => void;
}

export default function Hero({ onConsultationClick }: HeroProps) {
  // Motion values for interactive 3D mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = (clientX / width) - 0.5;
    const y = (clientY / height) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Parallax shifts for the centerpiece elements
  const bottleX = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const bottleY = useTransform(mouseY, [-0.5, 0.5], [-15, 15]);
  
  const leftCardsX = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const leftCardsY = useTransform(mouseY, [-0.5, 0.5], [-8, 8]);
  
  const rightCardsX = useTransform(mouseX, [-0.5, 0.5], [8, -8]);
  const rightCardsY = useTransform(mouseY, [-0.5, 0.5], [8, -8]);

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[100vh] flex flex-col justify-start items-center pt-32 pb-20 md:pb-28 overflow-hidden bg-[#FAFBF9] select-none z-10"
    >
      {/* 21st.dev / React Bits style Aurora Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Sage Green Blob */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 80, 0],
            scale: [1, 1.25, 0.85, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#E5EFE7] opacity-85 blur-[90px]"
        />

        {/* Olive Green Blob */}
        <motion.div
          animate={{
            x: [0, -90, 60, 0],
            y: [0, 80, -50, 0],
            scale: [1, 0.9, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[650px] h-[650px] rounded-full bg-[#EDF3E6] opacity-80 blur-[100px]"
        />

        {/* Muted Sand Blob */}
        <motion.div
          animate={{
            x: [0, 50, -60, 0],
            y: [0, 70, -70, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[30%] left-[35%] w-[480px] h-[480px] rounded-full bg-[#F4EDE4] opacity-65 blur-[110px]"
        />

        {/* Interactive Neural/Particle Connecting Network */}
        <InteractiveParticles />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        
        {/* Centered Editorial Title Block */}
        <div className="text-center max-w-4xl mx-auto space-y-5 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2"
          >
            <span className="w-6 h-[1px] bg-[#2B3E2F]/40" />
            <span className="font-body text-xs font-bold text-secondary tracking-[0.25em] uppercase">
              Mahizham by Organic Sisterz
            </span>
            <span className="w-6 h-[1px] bg-[#2B3E2F]/40" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary font-medium tracking-tight leading-[1.1] max-w-3xl mx-auto"
          >
            The Art of <span className="font-semibold italic text-secondary">Botanical</span> Healing.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
          >
            Handcrafted, chemical-free hair, skin, and wellness formulations. Revitalizing your hair growth, scalp health, and skin radiance naturally with up to 50 active traditional herbs.
          </motion.p>
        </div>

        {/* 3-Column Explorer Layout (Left Floating Cards, Center Bottle, Right Floating Cards) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center justify-center mt-4">
          
          {/* Left Columns: Interactive Cards (Hidden or stacked on mobile) */}
          <motion.div 
            style={{ x: leftCardsX, y: leftCardsY }}
            className="hidden lg:flex lg:col-span-4 flex-col gap-6 items-end text-right justify-center h-full pr-6"
          >
            {/* Card 1: Rosemary & Follicle */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-md max-w-[320px] transition-all hover:shadow-lg hover:border-secondary/30 relative group"
            >
              <div className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center text-secondary border border-[#D1FAE5]">
                <Leaf className="w-4 h-4 text-secondary" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary mt-2">Active Rosemary</h3>
              <p className="font-body text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Stimulates hair follicles, promotes thickness, and prevents dry scalp naturally.
              </p>
            </motion.div>

            {/* Card 2: 100% Organic Purity */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-md max-w-[320px] transition-all hover:shadow-lg hover:border-secondary/30 relative group"
            >
              <div className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center text-secondary border border-[#D1FAE5]">
                <ShieldCheck className="w-4 h-4 text-secondary" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary mt-2">Chemical-Free</h3>
              <p className="font-body text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Handcrafted formulation without sulfates, parabens, or synthetic fragrance.
              </p>
            </motion.div>
          </motion.div>

          {/* Center Column: Centerpiece Bottle with Sun Halo */}
          <div className="col-span-1 lg:col-span-4 relative flex items-center justify-center min-h-[360px] md:min-h-[460px] z-20">
            
            {/* Rotating Sun / Dial Halo behind bottle */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border border-secondary/15 bg-secondary/3 flex items-center justify-center z-0 pointer-events-none"
            >
              <div className="w-[90%] h-[90%] rounded-full border border-dashed border-secondary/10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary/40 absolute top-0" />
                <div className="w-1.5 h-1.5 rounded-full bg-secondary/40 absolute bottom-0" />
                <div className="w-1.5 h-1.5 rounded-full bg-secondary/40 absolute left-0" />
                <div className="w-1.5 h-1.5 rounded-full bg-secondary/40 absolute right-0" />
              </div>
            </motion.div>

            {/* Glowing Aura */}
            <div className="absolute w-60 h-60 md:w-80 md:h-80 rounded-full bg-[#ECFDF5]/30 blur-2xl z-0" />

            {/* Main Center Product Image */}
            <motion.div
              style={{ x: bottleX, y: bottleY }}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [-8, 8, -8] 
              }}
              transition={{ 
                opacity: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative w-64 h-[350px] md:w-72 md:h-[440px] rounded-t-full rounded-b-3xl overflow-hidden shadow-2xl border-4 border-white z-20 group cursor-pointer"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi8gtIvyu44eI0wdsqxbA3swpU1w3pmT32gR3aeELcR8HMw9Lqu1ePVaCnJd5mOiUfUQfglThoYVm_jprlrJXCCo9hGtXPDOOlfAP7v7R9HYgr2Lv-Bvpus9JkSO8IPXhZY0r5mt_u9W6kCxVxUaMJpVKzrlj9f4I1WcbmTDPBOETdysU2-8ImOe2GUIJR6cU60OtKvhfe_jcVfw2znUvNGeOxv0dzktdVBpHWEU4tILo8VB9Pkx4MWk72XaEbD9pmncIGI9DGZoE" 
                alt="Organic Sisterz Mahizham Herbal Hair Oil bottle" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/3 group-hover:opacity-0 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/85 backdrop-blur-md rounded-2xl p-3 border border-white/60 shadow-lg text-center">
                <span className="block text-[9px] font-bold text-secondary uppercase tracking-widest">Flagship Product</span>
                <span className="block text-xs font-bold text-primary mt-0.5">Mahizham Hair Growth Elixir</span>
              </div>
            </motion.div>
          </div>

          {/* Right Columns: Interactive Cards (Hidden or stacked on mobile) */}
          <motion.div 
            style={{ x: rightCardsX, y: rightCardsY }}
            className="hidden lg:flex lg:col-span-4 flex-col gap-6 items-start text-left justify-center h-full pl-6"
          >
            {/* Card 3: Bringaraj & Amla */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-md max-w-[320px] transition-all hover:shadow-lg hover:border-secondary/30 relative group"
            >
              <div className="absolute left-4 top-4 w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center text-secondary border border-[#D1FAE5]">
                <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary mt-2 pl-9 lg:pl-0">Herbal Actives</h3>
              <p className="font-body text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Contains Amla, Bringaraj, and Hibiscus to maintain natural pigmentation and boost shine.
              </p>
            </motion.div>

            {/* Card 4: Rapid Results */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-md max-w-[320px] transition-all hover:shadow-lg hover:border-secondary/30 relative group"
            >
              <div className="absolute left-4 top-4 w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center text-secondary border border-[#D1FAE5]">
                <Star className="w-4 h-4 text-secondary" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary mt-2 pl-9 lg:pl-0">Rapid Revitalization</h3>
              <p className="font-body text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Clinically balanced formula designed to restore texture and soothe scalps rapidly.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile View Stack (Only visible on screens smaller than desktop lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full max-w-2xl lg:hidden">
          <div className="bg-white/85 backdrop-blur-sm border border-white/60 rounded-2xl p-4.5 shadow-sm text-center">
            <h3 className="font-display text-base font-bold text-primary">100% Organic Purity</h3>
            <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
              No chemicals, sulfates, or parabens. Pure cold-pressed oils and herbal essences.
            </p>
          </div>
          <div className="bg-white/85 backdrop-blur-sm border border-white/60 rounded-2xl p-4.5 shadow-sm text-center">
            <h3 className="font-display text-base font-bold text-primary">Key Herbal Actives</h3>
            <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
              Fortified with Rosemary, Amla, Bringaraj, and Hibiscus for rapid hair revitalization.
            </p>
          </div>
        </div>

        {/* CTA & Actions Centered at Bottom */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
        >
          <motion.button 
            onClick={onConsultationClick}
            whileHover={{ scale: 1.03, backgroundColor: 'var(--color-primary-container)' }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary text-on-primary font-body text-xs font-bold tracking-[0.15em] uppercase px-12 py-4.5 rounded-full shadow-md hover:shadow-xl cursor-pointer w-full sm:w-auto text-center"
          >
            Explore Formulations
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer z-30"
        onClick={() => window.scrollTo({ top: window.innerHeight * 0.95, behavior: 'smooth' })}
      >
        <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#6B7280]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
