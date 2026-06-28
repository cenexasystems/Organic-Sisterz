import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl -z-10" />

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
                <Sparkles className="w-4 h-4" /> Visual Evidence
              </span>
              <h2 className="font-display text-4xl lg:text-5xl text-primary font-medium tracking-tight leading-tight">
                Clinically Witnessed Transformations
              </h2>
            </div>
            
            <p className="font-body text-base text-on-surface-variant leading-relaxed">
              Experience the difference at a microscopic level. Our ancient Mahizham formulation combines 40 active traditional herbs like Shikakai, Amla, and Vetiver to rebuild structural bonds, restore follicle-nourishing lipids, and actively eliminate dandruff and dry flaking.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-secondary font-bold text-xs shrink-0 mt-1">1</div>
                <div>
                  <h4 className="font-display text-lg text-primary font-medium">Rebuilt Cuticle Structure</h4>
                  <p className="font-body text-sm text-on-surface-variant">Shikakai and Arappu gently clean sebum without stripping lipids, smoothing rough cuticles to lock in moisture.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-secondary font-bold text-xs shrink-0 mt-1">2</div>
                <div>
                  <h4 className="font-display text-lg text-primary font-medium">Follicular Density Restoration</h4>
                  <p className="font-body text-sm text-on-surface-variant">Infusions of Karisalankanni (Bhringraj) and Vetiver stimulate scalp microcirculation to combat hair thinning.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Slider Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-1 lg:col-span-7 flex flex-col items-center"
          >
            <div 
              ref={containerRef}
              className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl select-none cursor-ew-resize border border-outline-variant/30"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
            >
              {/* After Image (Full Background) */}
              <img 
                src="https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=1200" 
                alt="After clinical formulation treatment" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute top-4 right-4 bg-primary text-on-primary font-body text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-md bg-opacity-80">
                After 12 Weeks
              </div>

              {/* Before Image (Clipped Overlay) */}
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1626015276681-2b446c6a22b7?auto=format&fit=crop&q=80&w=1200" 
                  alt="Before treatment" 
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: containerRef.current?.offsetWidth || '100%' }}
                />
                <div className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary-container font-body text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-md bg-opacity-85">
                  Before Treatment
                </div>
              </div>

              {/* Slider Line / Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border border-outline-variant flex items-center justify-center shadow-lg pointer-events-none">
                  <div className="flex gap-1">
                    <span className="w-1 h-3 bg-secondary rounded-full"></span>
                    <span className="w-1 h-3 bg-secondary rounded-full"></span>
                  </div>
                </div>
              </div>
            </div>
            
            <span className="mt-4 font-body text-xs text-on-surface-variant tracking-wider uppercase opacity-75 animate-pulse">
              Drag the handle to compare results
            </span>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
