import { MouseEvent } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
} from "motion/react";
import { ArrowRight, Leaf } from "lucide-react";

interface HeroProps {
  onConsultationClick: () => void;
}

export default function Hero({ onConsultationClick }: HeroProps) {
  const { scrollY } = useScroll();

  // Parallax float values for the crazy floating gallery
  const y1 = useTransform(scrollY, [0, 1000], [0, 150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 250]);
  const y4 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y5 = useTransform(scrollY, [0, 1000], [0, 180]);
  const y6 = useTransform(scrollY, [0, 1000], [0, -250]);
  const y7 = useTransform(scrollY, [0, 1000], [0, 300]);

  // Interactive Mouse Glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }: MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleExploreClick = () => {
    document
      .getElementById("products-catalog")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[100vh] flex flex-col justify-center items-center overflow-hidden bg-background select-none"
    >
      {/* Interactive Mouse Glow Background */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-90 transition duration-300 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              700px circle at ${mouseX}px ${mouseY}px,
              rgba(167, 243, 208, 0.4),
              transparent 80%
            )
          `,
        }}
      />

      {/* CONTINUOUSLY MOVING INTERACTIVE GRID */}
      <motion.div
        animate={{ backgroundPosition: ["0px 0px", "64px 64px"] }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute inset-0 z-0 opacity-200 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #16653425 1px, transparent 1px), linear-gradient(to bottom, #16653425 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />

      {/* REFINED FLOATING GALLERY (4 Images + 1 Video) */}
      <div className="absolute inset-0 w-full h-full max-w-[1400px] mx-auto pointer-events-none z-10 overflow-hidden">
        {/* Floating Image 1 - Top Left */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-[18%] left-[1%] sm:left-[3%] w-32 h-40 sm:w-48 sm:h-56 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/80 rotate-[-6deg]"
        >
          <img
            src="/face-pack-and-bath-powder.jpeg"
            alt="Face Pack"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Floating Image 1 (Replaced Video) - Top Right */}
        <motion.div
          style={{ y: y2 }}
          className="absolute top-[15%] right-[2%] sm:right-[6%] w-36 h-48 sm:w-56 sm:h-72 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/80 rotate-[4deg]"
        >
          <img
            src="/herbal-hair-oil.jpeg"
            alt="Herbal Hair Oil"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Floating Image 2 - Middle Left (Mahizham Hair Oil) */}
        <motion.div
          style={{ y: y3 }}
          className="absolute top-[48%] left-[2%] sm:left-[5%] w-40 h-48 sm:w-56 sm:h-64 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/80 rotate-[8deg] bg-white"
        >
          <img
            src="/mahizham_hair_oil.png"
            alt="Hair Oil"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Floating Image 3 - Bottom Right (Health Mix) */}
        <motion.div
          style={{ y: y4 }}
          className="absolute bottom-[5%] right-[2%] sm:right-[5%] w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden shadow-2xl border-4 border-white/80 rotate-[-4deg]"
        >
          <img
            src="/multi-millet-health-mix.jpeg"
            alt="Health Mix"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Floating Image 4 - Bottom Left (Shikakai Powder) */}
        <motion.div
          style={{ y: y5 }}
          className="absolute bottom-[5%] sm:bottom-[8%] left-[2%] sm:left-[8%] w-32 h-32 sm:w-48 sm:h-48 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/80 rotate-[12deg]"
        >
          <img
            src="/herbal shikakai powder.jpeg"
            alt="Shikakai Powder"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* CENTERED EDITORIAL CONTENT WITH GLASSMORPHISM */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full w-full px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center max-w-4xl w-full pointer-events-auto pt-20"
        >
          {/* Organic Sisterz Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 bg-white/60 px-5 py-2 rounded-full border border-white/80 shadow-sm backdrop-blur-md">
            <Leaf className="w-3.5 h-3.5 animate-pulse text-secondary" />
            <span className="font-body text-xs font-extrabold text-secondary tracking-[0.25em] uppercase">
              Organic Sisterz
            </span>
          </div>

          {/* Centered H1 Heading */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary font-bold tracking-tight leading-[1.05] drop-shadow-sm text-center">
            Pure <span className="italic text-secondary font-light" style={{ fontFamily: 'var(--font-accent)' }}>Herbal</span>{" "}
            <br className="hidden sm:block" /> Products.
          </h1>

          {/* Glassmorphism Wrapper for Text and Buttons */}
          <div className="flex flex-col items-center justify-center p-8 sm:px-12 sm:py-8 mt-10 rounded-[2.5rem] bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_0_32px_rgba(255,255,255,0.4)] max-w-3xl w-full">
            {/* Description */}
            <p className="font-body text-sm sm:text-base md:text-lg text-on-surface-variant leading-relaxed text-center font-medium">
              Try our simple, natural, and chemical-free hair and skin care
              products. Made under sunlight with active Indian herbs to restore your
              natural beauty.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <button
                onClick={handleExploreClick}
                className="bg-primary text-on-primary font-body text-xs font-bold tracking-[0.15em] uppercase px-10 py-5 rounded-full shadow-xl hover:shadow-2xl hover:bg-primary-container transition-all cursor-pointer w-full sm:w-auto text-center"
              >
                Shop Now
              </button>
              
            </div>
          </div>
        </motion.div>
      </div>

      {/* Seamless Transition Gradient to Next Section */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
    </section>
  );
}
