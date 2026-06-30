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
    id: "shikakai",
    name: "Shikakai",
    scientificName: "Acacia Concinna",
    extraction: "Traditional Sun-Drying & Pulverization",
    activeCompound: "Saponins (Natural Foaming Glycosides)",
    bioavailability: "96%",
    clinicalBenefit:
      "Mild natural surfactant that cleanses scalp build-up while preserving healthy follicle lipids.",
    image: "/herbal shikakai powder.jpeg",
    details:
      "Shikakai (literally meaning \"fruit for hair\") has been India's premier hair wash for centuries. The bark and pods contain natural saponins which lather mildly when mixed with water. It dissolves sebum, prevents dandruff, and conditions the cuticle without stripping the scalp's delicate acid mantle.",
  },
  {
    id: "aavaram-senna",
    name: "Aavaram Senna",
    scientificName: "Senna Auriculata",
    extraction: "Low-Temp Vacuum Preservation",
    activeCompound: "Polyphenols & Flavonoids",
    bioavailability: "94%",
    clinicalBenefit:
      "Soothes sunburn, eliminates dark spots, and reduces skin pigmentation naturally.",
    image: "/face-pack-and-bath-powder.jpeg",
    details:
      "Aavaram Senna (Aavarampoo) is a brilliant golden-yellow flower celebrated for its skin hydrating properties. Our low-temperature vacuum milling ensures its polyphenolic antioxidants remain stable, allowing them to treat acne, prevent body odor, and clear facial tan when used daily.",
  },
  {
    id: "amla",
    name: "Amla Fruit",
    scientificName: "Phyllanthus Emblica",
    extraction: "Cold-Press & Centrifugation",
    activeCompound: "Ascorbic Acid (Vitamin C)",
    bioavailability: "98%",
    clinicalBenefit:
      "Neutralizes root oxidative stress, delaying premature greying and strengthening the keratin sheath.",
    image: "/herbal-hair-oil.jpeg",
    details:
      "Amla is a powerful organic source of Vitamin C. It strengthens hair follicles from within by promoting collagen synthesis, helping to keep hair roots firmly anchored while maintaining natural dark pigment cells.",
  },
  {
    id: "kasthuri-manjal",
    name: "Kasthuri Manjal",
    scientificName: "Curcuma Aromatica",
    extraction: "Superfine Pulverization & Triple Sifting",
    activeCompound: "Curcuminoids (3.5%) & Essential Oils",
    bioavailability: "92%",
    clinicalBenefit:
      "Regulates skin sebum, suppresses acne-causing pathogens, and brightens complexion.",
    image: "/mahizham_hair_oil.png",
    details:
      "Wild Turmeric (Kasthuri Manjal) is renowned for its cosmetic efficacy. Unlike cooking turmeric, it does not stain the skin yellow. It acts as a powerful natural antibiotic and anti-inflammatory, resolving deep acne and protecting the skin barrier.",
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
              layoutId={`card-${ingredient.id}`}
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
                  layoutId={`card-${selectedIngredient.id}`}
                  className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 w-full max-w-4xl h-[90vh] md:h-auto max-h-[85vh] flex flex-col md:flex-row pointer-events-auto relative"
                >
                  <button
                    onClick={() => setSelectedIngredient(null)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-primary border border-outline-variant/30 hover:bg-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Left Column: Image/Visual */}
                  <div className="w-full md:w-1/2 relative h-48 md:h-auto min-h-[250px]">
                    <img
                      src={selectedIngredient.image}
                      alt={selectedIngredient.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-transparent to-transparent md:from-transparent" />
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
