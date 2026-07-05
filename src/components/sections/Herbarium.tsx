import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Beaker, Shield, Activity, X } from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  scientificName: string;
  extraction: string;
  activeCompound: string;
  bioavailability: string;
  clinicalBenefit: string;
  image: string;
  details: string;
}

const ingredients: Ingredient[] = [
  {
    id: "mahizham-flower",
    name: "Mahizham Flower",
    scientificName: "Mimusops Elengi",
    extraction: "Sun-Drying & Infusion",
    activeCompound: "Tannins & Saponins",
    bioavailability: "95%",
    clinicalBenefit:
      "Natural cooling properties that soothe the scalp and impart a lasting, traditional fragrance.",
    image: "/mahizham_flower.png",
    details:
      "Mahizham flower, also known as Spanish Cherry, is deeply rooted in traditional Ayurvedic hair care. Known for its cooling properties, it helps soothe the scalp while its mild astringent nature strengthens hair roots. Its signature lingering fragrance provides a natural perfume to the hair.",
  },
  {
    id: "jatamansi",
    name: "Jatamansi",
    scientificName: "Nardostachys Jatamansi",
    extraction: "Cold-Press Extraction",
    activeCompound: "Jatamansone",
    bioavailability: "94%",
    clinicalBenefit:
      "Stimulates hair follicles, reduces stress-induced hair fall, and promotes deep, restful sleep.",
    image: "/jatamansi.png",
    details:
      "Jatamansi, a revered Himalayan herb, is exceptional for hair growth and scalp health. Its potent active compounds penetrate deep into the follicles to stimulate growth and delay premature greying. Traditionally used to calm the mind, its application as a hair oil promotes relaxation alongside robust hair health.",
  },
  {
    id: "rose-petals",
    name: "Rose Petals",
    scientificName: "Rosa Centifolia",
    extraction: "Steam Distillation & Powdering",
    activeCompound: "Vitamin C & Phenolics",
    bioavailability: "98%",
    clinicalBenefit:
      "Hydrates, tones, and balances skin pH while reducing redness and inflammation.",
    image: "/rose_petals.png",
    details:
      "Rose petals are a luxurious staple in skincare, offering intense hydration and gentle astringent properties. Rich in antioxidants and natural oils, they help soothe irritated skin, tighten pores, and impart a radiant, youthful glow. Perfect as a face pack base for all skin types.",
  },
  {
    id: "champa",
    name: "Champa",
    scientificName: "Michelia Champaca",
    extraction: "Solvent Extraction",
    activeCompound: "Linalool & Essential Oils",
    bioavailability: "92%",
    clinicalBenefit:
      "Enhances skin elasticity, deeply moisturizes, and provides a calming aromatherapy experience.",
    image: "/champa.png",
    details:
      "Champa flowers are celebrated not only for their intoxicating, exotic aroma but also for their potent skin-conditioning properties. The rich essential oils extracted from Champa help to deeply nourish the skin, improve elasticity, and maintain a youthful, vibrant complexion.",
  },
];

export default function Herbarium() {
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);

  return (
    <section
      id="herbarium"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Background graphic grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#061b0e08_1px,transparent_1px),linear-gradient(to_bottom,#061b0e08_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
          <span className="font-body text-xs font-semibold text-secondary tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            <Compass className="w-4 h-4 animate-spin-slow" /> Extraction &
            Science
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-primary font-medium tracking-tight">
            The Interactive Herbarium
          </h2>
          <p className="font-body text-base text-on-surface-variant leading-relaxed">
            Click on any active botanical below to dissect its molecular
            properties, extraction methods, and clinical verification data.
          </p>
        </div>

        {/* Ingredients Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ingredients.map((ingredient) => (
            <motion.div
              key={ingredient.id}
              onClick={() => setSelectedIngredient(ingredient)}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/30 hover:border-secondary/40 cursor-pointer shadow-sm flex flex-col h-[350px] relative group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="font-body text-[10px] text-secondary font-semibold uppercase tracking-wider block mb-1">
                  {ingredient.scientificName}
                </span>
                <h3 className="font-display text-2xl text-primary font-medium mb-3">
                  {ingredient.name}
                </h3>
                <p className="font-body text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                  {ingredient.clinicalBenefit}
                </p>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-auto group-hover:text-secondary flex items-center gap-1.5 transition-colors">
                  Examine Science <ArrowMicroRight />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal Overlay / Expanded View */}
        <AnimatePresence>
          {selectedIngredient && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedIngredient(null)}
                className="fixed inset-0 bg-primary/40 backdrop-blur-md z-50 cursor-zoom-out"
              />

              {/* Modal Container */}
              <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 w-full max-w-4xl h-[90vh] md:h-auto max-h-[85vh] flex flex-col md:flex-row pointer-events-auto relative"
                >
                  <button
                    onClick={() => setSelectedIngredient(null)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-primary border border-outline-variant/30 hover:bg-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Left Column: Image/Visual (No-zoom containment) */}
                  <div className="w-full md:w-1/2 bg-[#FAF9F6] flex items-center justify-center p-6 h-64 md:h-auto min-h-[300px]">
                    <img
                      src={selectedIngredient.image}
                      alt={selectedIngredient.name}
                      className="max-w-full max-h-full object-contain rounded-2xl shadow-sm"
                    />
                  </div>

                  {/* Right Column: Scientific Details */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col space-y-6">
                    <div>
                      <span className="font-body text-[10px] text-secondary font-bold uppercase tracking-widest block mb-1">
                        {selectedIngredient.scientificName}
                      </span>
                      <h3 className="font-display text-4xl text-primary font-medium">
                        {selectedIngredient.name}
                      </h3>
                    </div>

                    <div className="space-y-4 font-body text-sm text-on-surface-variant leading-relaxed">
                      <p>{selectedIngredient.details}</p>
                    </div>

                    {/* Scientific Stats Cards */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/30">
                      <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 flex items-start gap-3">
                        <Beaker className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-body text-[10px] uppercase tracking-wider text-on-surface-variant">
                            Active Compound
                          </span>
                          <span className="font-body text-xs font-semibold text-primary">
                            {selectedIngredient.activeCompound}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 flex items-start gap-3">
                        <Activity className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-body text-[10px] uppercase tracking-wider text-on-surface-variant">
                            Bioavailability
                          </span>
                          <span className="font-body text-xs font-semibold text-primary">
                            {selectedIngredient.bioavailability}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 flex items-start gap-3 col-span-2">
                        <Shield className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-body text-[10px] uppercase tracking-wider text-on-surface-variant">
                            Extraction Process
                          </span>
                          <span className="font-body text-xs font-semibold text-primary">
                            {selectedIngredient.extraction}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ArrowMicroRight() {
  return (
    <svg
      className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
