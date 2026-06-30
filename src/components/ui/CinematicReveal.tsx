import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function CinematicReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of this container relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Animate width, height, scale, and border radius as scroll progresses
  // Starts centered and rounded, expands to cover the entire viewport (full-bleed)
  const scale = useTransform(scrollYProgress, [0.1, 0.45], [0.75, 1.02]);
  const borderRadius = useTransform(scrollYProgress, [0.1, 0.45], ["40px", "0px"]);
  const maxWidth = useTransform(scrollYProgress, [0.1, 0.45], ["85vw", "100vw"]);
  const maxHeight = useTransform(scrollYProgress, [0.1, 0.45], ["70vh", "100vh"]);

  // Animate text overlay fade-in and translation
  const textOpacity = useTransform(scrollYProgress, [0.38, 0.52], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.38, 0.52], [40, 0]);

  // Subtle dark overlay to ensure high text contrast
  const overlayOpacity = useTransform(scrollYProgress, [0.1, 0.45], [0.2, 0.45]);

  return (
    <div ref={containerRef} className="relative h-[180vh] bg-[#FAF9F5] z-30">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ 
            scale,
            borderRadius,
            width: maxWidth,
            height: maxHeight,
          }}
          className="relative overflow-hidden shadow-2xl bg-primary flex items-center justify-center w-full h-full"
        >
          {/* Main Cinematic Image */}
          <img 
            src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1600" 
            alt="Gold oil droplet details compounding" 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark gradient overlay for text legibility */}
          <motion.div 
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
          />

          {/* Overlaid Editorial Content */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="absolute bottom-16 md:bottom-24 left-6 right-6 md:left-24 md:right-24 max-w-4xl text-left text-white space-y-6 z-10"
          >
            <div className="flex items-center gap-2">
              <span className="w-8 h-[1px] bg-white/60" />
              <span className="font-body text-xs font-bold tracking-[0.25em] uppercase text-white/80">
                Purity Redefined
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1]">
              Every Drop a <span className="font-semibold italic">Sacred</span> Ritual.
            </h2>
            <p className="font-body text-sm md:text-base text-white/85 max-w-xl leading-relaxed">
              No mineral oils. No artificial colorants. No synthetic fragrances. Just raw, unrefined wild botanicals matured under the sun to awaken your scalp and hair follicles.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
