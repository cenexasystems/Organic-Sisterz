import type { MouseEvent } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
} from "motion/react";
import { Leaf } from "lucide-react";

export default function Hero() {
  const { scrollY } = useScroll();

  // Parallax float values for the crazy floating gallery
  const y1 = useTransform(scrollY, [0, 1000], [0, 150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 250]);
  const y4 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y5 = useTransform(scrollY, [0, 1000], [0, 180]);
  const y6 = useTransform(scrollY, [0, 1000], [0, -250]);

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

      {/* REFINED FLOATING GALLERY (7 Images) */}
      <div className="absolute inset-0 w-full h-full max-w-[1400px] mx-auto pointer-events-none z-10 overflow-hidden">
        {/* Top Left - Small on mobile */}
        <motion.div
          style={{ y: y1 }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute top-[15%] sm:top-[10%] left-[2%] sm:left-[4%] w-20 h-28 sm:w-48 sm:h-56 rounded-[1rem] sm:rounded-[2rem] overflow-hidden shadow-2xl border-[4px] sm:border-[6px] border-white/90 rotate-[-8deg] pointer-events-auto cursor-pointer will-change-transform bg-white"
        >
          <img
            src="/oil_splash.png"
            alt="Hair Oil"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Top Right - Hidden on mobile, pushed down to avoid navbar */}
        <motion.div
          style={{ y: y2 }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="hidden md:block absolute top-[15%] right-[2%] lg:right-[3%] w-48 h-56 lg:w-56 lg:h-64 rounded-full overflow-hidden shadow-2xl border-[6px] border-white/90 rotate-[10deg] pointer-events-auto cursor-pointer will-change-transform bg-white"
        >
          <img
            src="/oil_splash.png"
            alt="Herbal Hair Oil"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Mid Left - Hidden on mobile */}
        <motion.div
          style={{ y: y3 }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="hidden md:block absolute top-[40%] left-[ -3%] lg:left-[2%] w-48 h-56 lg:w-56 lg:h-64 rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white/90 rotate-[5deg] bg-white pointer-events-auto cursor-pointer will-change-transform"
        >
          <img
            src="/face_hero.png"
            alt="Face Pack"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Mid Right - Made bigger and shifted right */}
        <motion.div
          style={{ y: y6 }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute top-[48%] sm:top-[42%] right-[-5%] sm:right-[2%] w-28 h-28 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl border-[4px] sm:border-[6px] border-white/90 rotate-[-12deg] pointer-events-auto cursor-pointer will-change-transform"
        >
          <img
            src="/millet_hero.png"
            alt="Millet Health Mix"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Bottom Left - Shrunk on mobile */}
        <motion.div
          style={{ y: y5 }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute bottom-[10%] sm:bottom-[12%] left-[-2%] sm:left-[8%] w-24 h-24 sm:w-48 sm:h-48 lg:w-52 lg:h-52 rounded-full overflow-hidden shadow-2xl border-[4px] sm:border-[6px] border-white/90 rotate-[15deg] pointer-events-auto cursor-pointer will-change-transform"
        >
          <img
            src="/shikakai_hero.png"
            alt="Shikakai Powder"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Bottom Right - Hidden on mobile */}
        <motion.div
          style={{ y: y4 }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="hidden md:block absolute bottom-[5%] right-[4%] lg:right-[7%] w-48 h-64 lg:w-56 lg:h-72 rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white/90 rotate-[-8deg] pointer-events-auto cursor-pointer will-change-transform"
        >
          <img
            src="/shikakai_hero.png"
            alt="Shikakai Powder"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* CENTERED EDITORIAL CONTENT WITH GLASSMORPHISM */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full w-full px-4 pointer-events-none">
        {/* Ambient Glow Behind Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A7F3D0]/20 blur-[100px] rounded-full pointer-events-none z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center justify-center max-w-5xl w-full pointer-events-auto pt-20 z-10"
        >
          {/* Organic Sisterz Badge */}
          <div className="flex items-center justify-center gap-2 mb-8 bg-white/70 px-6 py-2.5 rounded-full border border-white shadow-sm backdrop-blur-xl hover:shadow-md transition-shadow cursor-default">
            <Leaf className="w-4 h-4 text-secondary drop-shadow-sm" />
            <span className="font-body text-[11px] font-extrabold text-[#1B3022] tracking-[0.3em] uppercase">
              Organic Sisterz
            </span>
          </div>

          {/* Centered H1 Heading */}
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[110px] text-primary font-extrabold tracking-tighter leading-[0.9] drop-shadow-sm text-center">
            Pure{" "}
            <span
              className="italic font-light bg-clip-text text-transparent bg-gradient-to-r from-[#2B3E2F] to-[#5C7362] pr-2"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              Herbal
            </span>
            <br className="hidden sm:block" />
            <span className="relative inline-block mt-2">
              Products.
              <svg
                className="absolute -bottom-3 left-0 w-full h-4 text-secondary/30"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 15 100 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Glassmorphism Wrapper for Text and Buttons */}
          <div className="flex flex-col items-center justify-center p-8 sm:px-14 sm:py-10 mt-12 sm:mt-16 rounded-[3rem] bg-white/20 backdrop-blur-2xl border border-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.05),inset_0_0_32px_rgba(255,255,255,0.6)] max-w-2xl w-full relative overflow-hidden group">
            {/* Inner hover glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Description */}
            <p className="font-body text-sm sm:text-base md:text-lg text-[#2B3E2F]/80 leading-relaxed text-center font-semibold">
              Try our simple, natural, and chemical-free hair and skin care
              products. Made under sunlight with active Indian herbs to restore
              your natural beauty.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <button
                onClick={handleExploreClick}
                className="bg-primary text-on-primary font-body text-[11px] font-bold tracking-[0.2em] uppercase px-12 py-5 rounded-full shadow-[0_10px_20px_rgba(43,62,47,0.2)] hover:shadow-[0_15px_30px_rgba(43,62,47,0.3)] hover:-translate-y-1 hover:bg-[#1B3022] transition-all duration-300 cursor-pointer w-full sm:w-auto text-center"
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
