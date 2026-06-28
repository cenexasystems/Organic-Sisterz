import { motion } from 'motion/react';
import { Star, ShieldCheck } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  stars: number;
  tag: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    role: "Clinical Dermatologist",
    quote: "The scalp dryness and persistent micro-inflammation I battled for years vanished in 3 weeks. The HPLC purity rating is the real deal.",
    stars: 5,
    tag: "Dermatologist Verified"
  },
  {
    id: 2,
    name: "Priya Mehta",
    role: "Verified Purchaser",
    quote: "My hair density has visibly improved near the parting. The scent is beautifully luxury-herbaceous, and it doesn't weigh my roots down.",
    stars: 5,
    tag: "3-Month Regimen"
  },
  {
    id: 3,
    name: "Marcus Vance",
    role: "Scalp Health advocate",
    quote: "As someone with highly sensitive eczema-prone skin, this is the only botanical treatment that didn't trigger a redness reaction. Incredible.",
    stars: 5,
    tag: "Sensitive Skin"
  },
  {
    id: 4,
    name: "Elena Rostova",
    role: "Cosmetics Chemist",
    quote: "From a compounding perspective, the extraction quality here is outstanding. The lipid absorption speeds are fast, leaving no heavy residue.",
    stars: 5,
    tag: "Science Approved"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-surface-container-low overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <div className="max-w-2xl space-y-4">
          <span className="font-body text-xs font-semibold text-secondary tracking-[0.2em] uppercase">
            Clinical Verification
          </span>
          <h2 className="font-display text-4xl lg:text-5xl text-primary font-medium tracking-tight">
            Loved by Experts. Proven on Scalps.
          </h2>
        </div>
      </div>

      {/* Scrolling Testimonial Container */}
      <div className="flex w-max gap-8 animate-marquee hover:[animation-play-state:paused] cursor-grab select-none">
        {/* Double items for seamless infinite scroll */}
        {[...testimonials, ...testimonials].map((t, index) => (
          <motion.div
            key={`${t.id}-${index}`}
            whileHover={{ y: -4, borderColor: 'var(--color-secondary)' }}
            className="w-[350px] md:w-[420px] bg-white p-8 md:p-10 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shrink-0 shadow-sm transition-all duration-300"
          >
            <div className="space-y-6">
              {/* Stars & Tag */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-tertiary-container fill-current" />
                  ))}
                </div>
                <span className="font-body text-[9px] font-bold tracking-wider uppercase bg-surface-container px-3 py-1 rounded-full text-on-surface-variant flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-secondary" /> {t.tag}
                </span>
              </div>

              {/* Quote */}
              <p className="font-body text-base text-on-surface-variant leading-relaxed italic">
                "{t.quote}"
              </p>
            </div>

            {/* Author */}
            <div className="mt-8 pt-6 border-t border-outline-variant/20 flex items-center gap-3">
              <div>
                <span className="block font-display text-lg text-primary font-medium">{t.name}</span>
                <span className="block font-body text-xs text-on-surface-variant">{t.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Styling for marquee marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 16px)); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
