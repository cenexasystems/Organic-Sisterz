import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ShieldCheck } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  stars: number;
  tag: string;
}

const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    role: "Clinical Dermatologist",
    quote:
      "The scalp dryness and persistent micro-inflammation I battled for years vanished in 3 weeks. The HPLC purity rating is the real deal.",
    stars: 5,
    tag: "Dermatologist Verified",
  },
  {
    id: 2,
    name: "Priya Mehta",
    role: "Verified Purchaser",
    quote:
      "My hair density has visibly improved near the parting. The scent is beautifully luxury-herbaceous, and it doesn't weigh my roots down.",
    stars: 5,
    tag: "3-Month Regimen",
  },
  {
    id: 3,
    name: "Marcus Vance",
    role: "Scalp Health advocate",
    quote:
      "As someone with highly sensitive eczema-prone skin, this is the only botanical treatment that didn't trigger a redness reaction. Incredible.",
    stars: 5,
    tag: "Sensitive Skin",
  },
  {
    id: 4,
    name: "Elena Rostova",
    role: "Cosmetics Chemist",
    quote:
      "From a compounding perspective, the extraction quality here is outstanding. The lipid absorption speeds are fast, leaving no heavy residue.",
    stars: 5,
    tag: "Science Approved",
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>(initialTestimonials);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newTag, setNewTag] = useState("Verified Purchaser");
  const [newQuote, setNewQuote] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newQuote) return;

    const newReview: Testimonial = {
      id: Date.now(),
      name: newName,
      role: "Verified Customer",
      quote: newQuote,
      stars: newRating,
      tag: newTag || "Verified Purchaser",
    };

    setReviews([newReview, ...reviews]);
    setIsSuccess(true);

    setNewName("");
    setNewQuote("");
    setNewTag("Verified Purchaser");
    setNewRating(5);

    setTimeout(() => {
      setIsSuccess(false);
      setIsFormOpen(false);
    }, 2000);
  };

  return (
    <section
      id="testimonials"
      className="py-24 md:py-32 bg-surface-container-low overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <span className="font-body text-xs font-semibold text-secondary tracking-[0.2em] uppercase">
            Clinical Verification
          </span>
          <h2 className="font-display text-4xl lg:text-5xl text-primary font-medium tracking-tight">
            Loved by Experts. Proven on Scalps.
          </h2>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-primary hover:bg-[#1b3022] text-[#FAF9F5] font-body text-xs font-bold tracking-[0.1em] uppercase px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {isFormOpen ? "Cancel Review" : "Write a Customer Review"}
          </button>
        </div>
      </div>

      {/* Slide-out Review Input Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-xl mx-auto px-6 mb-16 overflow-hidden"
          >
            <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-lg space-y-6">
              <h3 className="font-display text-xl text-primary font-bold">
                Write Your Customer Review
              </h3>
              {isSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-semibold text-center animate-pulse">
                  Thank you! Your review has been submitted successfully.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Sarah Miller"
                        className="w-full bg-[#FAFBF9] border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">
                        Regimen / Tag
                      </label>
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="e.g. 6-Week Treatment"
                        className="w-full bg-[#FAFBF9] border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">
                      Rating
                    </label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="text-outline-variant hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${star <= newRating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-outline-variant"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">
                      Your Review
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newQuote}
                      onChange={(e) => setNewQuote(e.target.value)}
                      placeholder="Tell us how the botanical formulation worked for you..."
                      className="w-full bg-[#FAFBF9] border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-secondary hover:bg-[#3c4e3a] text-white font-body text-xs font-bold tracking-[0.1em] uppercase py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrolling Testimonial Container */}
      <div className="flex w-max gap-8 animate-marquee hover:[animation-play-state:paused] cursor-grab select-none">
        {/* Double items for seamless infinite scroll */}
        {[...reviews, ...reviews].map((t, index) => (
          <motion.div
            key={`${t.id}-${index}`}
            whileHover={{ y: -4, borderColor: "var(--color-secondary)" }}
            className="w-[350px] md:w-[420px] bg-white p-8 md:p-10 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shrink-0 shadow-sm transition-all duration-300"
          >
            <div className="space-y-6">
              {/* Stars & Tag */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[#D4AF37] fill-current"
                    />
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
                <span className="block font-display text-lg text-primary font-medium">
                  {t.name}
                </span>
                <span className="block font-body text-xs text-on-surface-variant">
                  {t.role}
                </span>
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
