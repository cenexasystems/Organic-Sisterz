import { motion, useMotionValue, useTransform } from 'motion/react';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  onConsultationClick: () => void;
}

export default function Hero({ onConsultationClick }: HeroProps) {
  const titleWords = "The Art of Botanical Healing.".split(" ");

  // Motion values for interactive 3D mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Calculate values between -0.5 and 0.5
    const x = (clientX / width) - 0.5;
    const y = (clientY / height) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Transform layers for offset parallax (surrounding elements move in opposition to center)
  const textX = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  const textY = useTransform(mouseY, [-0.5, 0.5], [-10, 10]);

  // Image 1: Top Left (moves slowly)
  const img1X = useTransform(mouseX, [-0.5, 0.5], [-25, 25]);
  const img1Y = useTransform(mouseY, [-0.5, 0.5], [-25, 25]);
  
  // Image 2: Middle Right (moves in opposition)
  const img2X = useTransform(mouseX, [-0.5, 0.5], [30, -30]);
  const img2Y = useTransform(mouseY, [-0.5, 0.5], [30, -30]);

  // Image 3: Bottom Left/Center (moves vertically active)
  const img3X = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const img3Y = useTransform(mouseY, [-0.5, 0.5], [35, -35]);

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[100vh] flex flex-col justify-center items-center pt-24 pb-20 md:pb-32 overflow-hidden bg-gradient-to-b from-background via-surface-container-lowest to-background select-none"
    >
      {/* Decorative blurred background shapes */}
      <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-primary-fixed-dim/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '9s' }} />
      <div className="absolute bottom-10 left-10 w-[550px] h-[550px] bg-secondary-container/80 rounded-full blur-3xl -z-10 opacity-10" />

      {/* Floating Botanical Leaf 1 */}
      <motion.div
        animate={{ 
          y: [0, -12, 0],
          rotate: [0, 6, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[22%] left-[45%] w-6 h-6 opacity-30 pointer-events-none -z-10"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-secondary w-full h-full">
          <path d="M17 8C8 10 7 19 7 19S11 11 17 8M17 8C19.7 7 21 4 21 4S19.5 7 17 8M7 19S6 20 4 21C4 21 5 19 7 19Z"/>
        </svg>
      </motion.div>

      {/* SURROUNDING IMAGE 1: Top Left Corner */}
      <motion.div
        style={{ x: img1X, y: img1Y }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[12%] left-[4%] md:top-[16%] md:left-[6%] w-24 h-24 md:w-44 md:h-44 rounded-2xl overflow-hidden shadow-lg border border-white/60 z-10 group hover:scale-103 transition-transform duration-500 cursor-pointer"
      >
        <img 
          src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400" 
          alt="Lush green botanical leaf detail" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-black/3 group-hover:opacity-0 transition-opacity" />
      </motion.div>

      {/* SURROUNDING IMAGE 2: Middle Right Corner */}
      <motion.div
        style={{ x: img2X, y: img2Y }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[20%] right-[3%] md:top-[22%] md:right-[6%] w-28 h-36 md:w-56 md:h-[350px] rounded-3xl overflow-hidden shadow-xl border border-white/60 z-10 group hover:scale-103 transition-transform duration-500 cursor-pointer"
      >
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi8gtIvyu44eI0wdsqxbA3swpU1w3pmT32gR3aeELcR8HMw9Lqu1ePVaCnJd5mOiUfUQfglThoYVm_jprlrJXCCo9hGtXPDOOlfAP7v7R9HYgr2Lv-Bvpus9JkSO8IPXhZY0r5mt_u9W6kCxVxUaMJpVKzrlj9f4I1WcbmTDPBOETdysU2-8ImOe2GUIJR6cU60OtKvhfe_jcVfw2znUvNGeOxv0dzktdVBpHWEU4tILo8VB9Pkx4MWk72XaEbD9pmncIGI9DGZoE" 
          alt="Organic Sistez Herbal Hair Oil bottle on travertine stone" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-black/3 group-hover:opacity-0 transition-opacity" />
      </motion.div>

      {/* SURROUNDING IMAGE 3: Bottom Left/Center Corner */}
      <motion.div
        style={{ x: img3X, y: img3Y }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-[10%] left-[8%] md:bottom-[12%] md:left-[18%] w-24 h-24 md:w-44 md:h-44 rounded-2xl overflow-hidden shadow-lg border border-white/60 z-10 group hover:scale-103 transition-transform duration-500 cursor-pointer"
      >
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbH6pEP1GOJKIPT7NYoRe3timqwuvNo59cNJ1Fc1-rF5SWWChqsr1daktfJS1MISMeP3dzhMYv8-0pFEnQQkHxOPPQwflDCfSG1W48KVXabP5IJ2h3ggrgtt_j_zbY4tIgOwu7hW-HK_VfdD7ag9d8miqpcG1vT0swmsO7vkF2MdZAeiP8zwc--n3CaW1KAX8_n3nyceN65olG1JpwMR5mioR5wUN2DADoFUybag0dlH0kJ3xA5THzwVsTTtOQAPoLDSasPnBvjNo" 
          alt="Clinical laboratory botanical compounding and distillation" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-black/3 group-hover:opacity-0 transition-opacity" />
      </motion.div>

      {/* CENTER TEXT BLOCK */}
      <motion.div 
        style={{ x: textX, y: textY }}
        className="max-w-4xl px-6 text-center z-20 flex flex-col items-center space-y-8"
      >
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4 flex flex-col items-center"
        >
          <span className="font-body text-xs font-semibold text-secondary tracking-[0.25em] uppercase">
            Clinical Botanical
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary leading-[1.1] font-medium tracking-tight max-w-3xl flex flex-wrap justify-center">
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.07, ease: [0.215, 0.61, 0.355, 1] }}
                className="inline-block mr-4 last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="font-body text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed"
        >
          Meticulously sourced, scientifically validated. We bridge the gap between ancient herbal wisdom and modern clinical efficacy.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="pt-4"
        >
          <motion.button 
            onClick={onConsultationClick}
            whileHover={{ scale: 1.04, backgroundColor: 'var(--color-primary-container)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="bg-primary text-on-primary font-body text-xs font-semibold tracking-[0.1em] uppercase px-10 py-4.5 rounded-full shadow-md hover:shadow-xl cursor-pointer"
          >
            Explore Formulations
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight * 0.95, behavior: 'smooth' })}
      >
        <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-secondary" />
        </motion.div>
      </motion.div>
    </section>
  );
}


