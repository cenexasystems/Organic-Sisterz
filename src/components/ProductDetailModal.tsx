import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Shield, Leaf, Sparkles, ChevronDown, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  sizeOption1: string;
  sizeOption2: string;
  priceOption1: number;
  priceOption2: number;
  image: string;
  herbs: string;
  benefits: string[];
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (id: string, size: 'opt1' | 'opt2') => void;
}

// Custom specifications matching the exact packaging images provided by the user
const productSpecs: Record<string, {
  tamilName: string;
  rating: string;
  details: string;
  ingredients: string;
  benefitsList: string[];
  usage: string;
  nutritionalInfo?: { label: string; value: string }[];
  fssai?: string;
  features: { icon: string; title: string; subtitle: string }[];
}> = {
  'herbal-hair-oil': {
    tamilName: 'மூலிகை கூந்தல் எண்ணெய்',
    rating: '4.8',
    details: 'Mahizham Herbal Hair Oil is compiled using traditional cold-pressed sesame and coconut oil lipids infused with 40 premium whole-plant botanicals, keeping the scalp cool and roots nourished.',
    ingredients: 'Cold pressed coconut oil, Sesame oil, Amla (Nellikai), Bhringraj (Karisalankanni), Vetiver (Ramacham), Neem leaves, Hibiscus flowers, Curry leaves, Aloe vera, and unique rare herbs.',
    benefitsList: [
      'Controls active hair fall and strengthens follicles from the root.',
      'Cools the scalp, relieves headaches, and reduces stress/body heat.',
      'Prevents premature hair greying and combats itchy dandruff conditions.'
    ],
    usage: 'Apply Mahizham Herbal Hair oil on your scalp and massage gently with fingertips regularly. For deep conditioning, apply to the scalp, massage for a few minutes, soak for an hour, then wash it with Mahizham Shikakai or a mild chemical-free shampoo.',
    features: [
      { icon: 'leaf', title: '100% Natural', subtitle: 'Raw Herbs & Oils' },
      { icon: 'sparkles', title: 'Double Infused', subtitle: '40 Herbs' },
      { icon: 'plant', title: 'Scalp Cooling', subtitle: 'Stress Relief' },
      { icon: 'shield', title: 'Zero Chemicals', subtitle: 'No Mineral Oil' }
    ]
  },
  'shikakai-powder': {
    tamilName: 'சிகைக்காய் பொடி',
    rating: '4.7',
    details: 'A traditional bio-cleanser prepared with 40 wild-harvested herbs, acting as a complete daily alternative to chemical shampoos. Gently washes hair while preserving natural sebum layers.',
    ingredients: 'Shikakai, Methi (Fenugreek), Reetha (Soapnut), Avuri (Indigo), Hibiscus, Green Gram, Vetiver, Aloe vera, Curry Leaves, Bringaraj, Neem, Amla, Kadukkai (Haritaki), Poolankizhangu (White Turmeric), Avaram Flower, Rose Flower, Henna, Karisalankanni, with unique and rare herbs.',
    benefitsList: [
      'Strengthens hair roots and promotes a healthy scalp environment.',
      'Prevents hair loss and controls premature greying.',
      'Acts as a powerful, non-drying natural anti-dandruff agent.'
    ],
    usage: 'Daily Bio Wash: Take a small quantity of Shikakai Powder, mix with water to form a smooth paste, apply to wet hair and scalp, massage gently and rinse thoroughly.\n\nHair Pack: Apply the paste to hair, leave it on for 10 minutes to let the 40 herbs absorb, and rinse off completely with clean water.',
    features: [
      { icon: 'leaf', title: '100% Natural', subtitle: 'Pure & Handpicked' },
      { icon: 'sparkles', title: 'Fresh & Herbaceous', subtitle: 'Traditional Aroma' },
      { icon: 'plant', title: 'Foaming Herbs', subtitle: 'Reetha & Shikakai' },
      { icon: 'shield', title: 'Safe Hair Wash', subtitle: 'Hygienically Packed' }
    ]
  },
  'face-pack-bath-powder': {
    tamilName: 'குளியல் பொடி & ஃபேஸ் பேக்',
    rating: '4.9',
    details: 'A luxury skin-toning daily bath powder formulated with 50 herbs designed to cleanse, exfoliate, and protect both male and female skin barriers without chemical surfactants.',
    ingredients: 'Green Gram, Urad dhal, Wheat, Rosemary, Hibiscus, Manjista, Dhriviya Pattai, Neeradi Muthu, Badham, Kadukaai, Mahizham Flower, Shenbaga Flower, Dry Aloevera, Red Sandal, Beetroot Dry, and rare herbs.',
    benefitsList: [
      'Controls active acne, pimples, and unsightly blackheads.',
      'Removes dead skin cells, clears sunburn/tan, and softens skin texture.',
      'Improves skin tone and complexion while preventing scaling, germs, and skin rashes.'
    ],
    usage: 'Bath Powder (Soap Alternate): Apply a few drops of coconut oil or ghee to your skin, mix the required amount of Bath Powder with water to form a paste, apply to face and body, scrub gently, and rinse off.\n\nFace Pack: Apply the paste directly to the face, leave it to dry for 10 minutes, and rinse off with cool water.',
    features: [
      { icon: 'leaf', title: '100% Organic', subtitle: '50 Pure Herbs' },
      { icon: 'sparkles', title: 'Brightening', subtitle: 'Red Sandal & Turmeric' },
      { icon: 'plant', title: 'Soap Alternate', subtitle: 'Daily Body Scrub' },
      { icon: 'shield', title: 'Acne Control', subtitle: 'Anti-Bacterial' }
    ]
  },
  'multi-millet-mix': {
    tamilName: 'சத்து மாவு',
    rating: '4.8',
    details: 'A premium nutrient-dense energy drink mix crafted with 45 traditional grains, nuts, and roasted millets. Highly digestible and perfect for nourishing both kids and adults.',
    ingredients: 'Moongil Rice, Raagi, Red Rice, Thooyamalli Rice, Naattu Kambu, Saamai, Thinai, Kaatu Yanam, Mappillai Samba, Black Kavuni, Navara Rice, Kuthiraivaali, Moongdhal, Black Urad Dhal, Kuzhiadichan Rice, Kadaikani Rice, Panivaragu, Samba Wheat, Badham, Pista, Cashew, Black Channa, White Channa, Rajma, Kollu, Red Aval, Red Corn, Red Karamani, Makka Cholam, Elachi, Sukku, Fried Gram, Varagu, Barley, Javarasi, Flax Seed, Poongaar Rice, Karunkuravai Rice, Neelam Zamba, Pumpkin Seed, Kullakaar Rice, Soya Beans, Valan Zamba, Double Beans, Kudavazhai Rice.',
    benefitsList: [
      'Packed with natural dietary fiber, plant proteins, and essential minerals.',
      'Provides sustained energy and keeps the digestive system clean.',
      '100% free of preservatives, chemical sweeteners, or synthetic colors.'
    ],
    usage: 'Health Drink: Mix a spoonful of Wellness Mix with a little water to form a lump-free paste. Boil a glass of water, add the mixture, and cook for 10 minutes on a medium flame while stirring. Turn off the flame and add milk & jaggery (or buttermilk & salt).\n\nOther Uses: Can also be used to prepare nutritious Ladoos, high-fiber Dosas, and traditional Adais.',
    nutritionalInfo: [
      { label: 'Energy', value: '431 Kcal' },
      { label: 'Carbohydrates', value: '63.9 g' },
      { label: 'Total Fat', value: '13.3 g' },
      { label: 'Protein', value: '13.8 g' },
      { label: 'Dietary Fiber', value: '9.80 g' },
      { label: 'Total Sugars', value: 'BDL (Below Detection Limit)' },
      { label: 'Sodium', value: '74.9 mg' }
    ],
    fssai: '22424524000080',
    features: [
      { icon: 'leaf', title: '45 Grains & Nuts', subtitle: '100% Whole Food' },
      { icon: 'sparkles', title: 'Nutrient Rich', subtitle: 'High Protein & Fiber' },
      { icon: 'plant', title: 'FSSAI Approved', subtitle: 'Lic: 22424524000080' },
      { icon: 'shield', title: 'Preservative Free', subtitle: 'No Artificial Additives' }
    ]
  }
};

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart }: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<'opt1' | 'opt2'>('opt1');
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
  const [isSaved, setIsSaved] = useState(false);

  if (!product) return null;

  const spec = productSpecs[product.id] || {
    tamilName: '',
    rating: '4.7',
    details: product.description,
    ingredients: product.herbs,
    benefitsList: product.benefits,
    usage: 'Apply as directed on the label.',
    features: [
      { icon: 'leaf', title: '100% Natural', subtitle: 'Pure Botanical' },
      { icon: 'shield', title: 'Safe Purity', subtitle: 'Hygienically Packed' }
    ]
  };

  const currentPrice = selectedSize === 'opt1' ? product.priceOption1 : product.priceOption2;
  const currentSizeText = selectedSize === 'opt1' ? product.sizeOption1 : product.sizeOption2;

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'leaf':
        return <Leaf className="w-5 h-5 text-secondary" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-secondary" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-secondary" />;
      default:
        return <Leaf className="w-5 h-5 text-secondary" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative bg-white w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] z-10 border border-outline-variant/20"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/95 border border-outline-variant/30 hover:border-secondary flex items-center justify-center text-primary hover:text-secondary shadow-md transition-all duration-300 z-30 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Image Area */}
            <div className="w-full md:w-1/2 bg-[#F9F7F0] p-6 md:p-10 flex flex-col justify-between relative overflow-y-auto border-b md:border-b-0 md:border-r border-outline-variant/20">
              {/* Badges */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-body text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
                  Premium Selection
                </span>
                <span className="font-body text-[10px] font-bold tracking-widest uppercase bg-secondary/15 text-secondary px-3 py-1.5 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Main Product Image Card */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-outline-variant/35 bg-white p-6 shadow-sm flex items-center justify-center my-auto group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-103 transition-transform duration-700"
                />
                
                {/* Botanical leaves watermarking overlay (aesthetic) */}
                <div className="absolute top-4 right-4 opacity-5 pointer-events-none">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 8C8 10 7 19 7 19S11 11 17 8M17 8C19.7 7 21 4 21 4S19.5 7 17 8M7 19S6 20 4 21C4 21 5 19 7 19Z"/>
                  </svg>
                </div>
              </div>

              {/* Thumbnail Bar */}
              <div className="flex gap-3 mt-6">
                <div className="w-16 h-16 rounded-xl border-2 border-secondary bg-white p-1 overflow-hidden cursor-pointer shadow-sm">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            {/* Right Column: details and specifications */}
            <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto flex flex-col justify-between">
              <div>
                {/* Green Subtitle & Title */}
                <div className="space-y-2">
                  <span className="font-body text-xs font-bold text-secondary tracking-widest uppercase block">
                    Mahizham Organic
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl text-primary font-bold tracking-tight">
                    {product.name}
                  </h2>
                  {spec.tamilName && (
                    <span className="block font-display text-lg text-on-surface-variant font-medium opacity-85">
                      {spec.tamilName}
                    </span>
                  )}
                </div>

                {/* Ratings Row */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-1 bg-[#FDF8E2] text-[#B8860B] px-2.5 py-1 rounded-full text-xs font-bold border border-[#EEDB88]">
                    <span>★</span>
                    <span>{spec.rating}</span>
                  </div>
                  <span className="font-body text-xs text-on-surface-variant/80">
                    Trusted by 1000+ devotees & families
                  </span>
                </div>

                {/* Price Display */}
                <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-outline-variant/30 mt-6 flex justify-between items-center">
                  <div>
                    <span className="font-body text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider block mb-1">
                      MRP (INCLUSIVE OF TAXES)
                    </span>
                    <span className="font-display text-3xl font-extrabold text-primary">
                      ₹{currentPrice}
                    </span>
                  </div>
                  <span className="font-body text-xs text-secondary font-semibold">
                    100% Premium Quality
                  </span>
                </div>

                {/* Pack Size Selector */}
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-xs font-bold text-primary uppercase tracking-wider">
                      PACK SIZE
                    </span>
                    <button
                      onClick={() => setIsSaved(!isSaved)}
                      className={`flex items-center gap-1 text-xs font-bold py-1.5 px-3 rounded-full border transition-all duration-300 ${
                        isSaved 
                          ? 'bg-secondary text-white border-secondary' 
                          : 'bg-white text-on-surface-variant border-outline-variant/40 hover:border-secondary'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedSize('opt1')}
                      className={`px-5 py-3.5 rounded-xl font-body text-sm font-bold border transition-all duration-300 ${
                        selectedSize === 'opt1'
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'bg-white text-primary border-outline-variant/30 hover:border-secondary'
                      }`}
                    >
                      {product.sizeOption1}
                    </button>
                    <button
                      onClick={() => setSelectedSize('opt2')}
                      className={`px-5 py-3.5 rounded-xl font-body text-sm font-bold border transition-all duration-300 ${
                        selectedSize === 'opt2'
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'bg-white text-primary border-outline-variant/30 hover:border-secondary'
                      }`}
                    >
                      {product.sizeOption2}
                    </button>
                  </div>
                  <p className="font-body text-[10px] text-on-surface-variant/80">
                    Net Weight: {currentSizeText} • Total price: ₹{currentPrice}
                  </p>
                </div>

                {/* Grid of 4 Attributes */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {spec.features.map((feat, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/15 flex gap-3 items-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                        {renderIcon(feat.icon)}
                      </div>
                      <div>
                        <span className="block font-display text-xs font-bold text-primary">{feat.title}</span>
                        <span className="block font-body text-[10px] text-on-surface-variant">{feat.subtitle}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Accordions */}
                <div className="mt-8 space-y-3">
                  {/* Product Details */}
                  <div className="border-b border-outline-variant/20 pb-3">
                    <button
                      onClick={() => toggleAccordion('details')}
                      className="w-full flex justify-between items-center py-2.5 font-display text-sm font-bold text-primary hover:text-secondary transition-colors"
                    >
                      <span>PRODUCT DETAILS</span>
                      <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${activeAccordion === 'details' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeAccordion === 'details' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 pb-3 text-xs text-on-surface-variant font-body leading-relaxed space-y-3">
                            <p>{spec.details}</p>
                            <div>
                              <span className="font-bold text-primary block mb-1">Ingredients:</span>
                              <p className="italic bg-surface-container-low p-3 rounded-xl border border-outline-variant/10 text-on-surface-variant/90">{spec.ingredients}</p>
                            </div>
                            {spec.fssai && (
                              <p className="text-[10px] font-bold text-secondary">FSSAI Licence No: {spec.fssai}</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Benefits */}
                  <div className="border-b border-outline-variant/20 pb-3">
                    <button
                      onClick={() => toggleAccordion('benefits')}
                      className="w-full flex justify-between items-center py-2.5 font-display text-sm font-bold text-primary hover:text-secondary transition-colors"
                    >
                      <span>BENEFITS & CLAIMS</span>
                      <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${activeAccordion === 'benefits' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeAccordion === 'benefits' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 pb-3 text-xs text-on-surface-variant font-body leading-relaxed">
                            <ul className="space-y-2">
                              {spec.benefitsList.map((ben, idx) => (
                                <li key={idx} className="flex gap-2 items-start">
                                  <span className="text-secondary font-bold text-sm leading-none">✓</span>
                                  <span>{ben}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* How to Use */}
                  <div className="border-b border-outline-variant/20 pb-3">
                    <button
                      onClick={() => toggleAccordion('usage')}
                      className="w-full flex justify-between items-center py-2.5 font-display text-sm font-bold text-primary hover:text-secondary transition-colors"
                    >
                      <span>HOW TO USE</span>
                      <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${activeAccordion === 'usage' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeAccordion === 'usage' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 pb-3 text-xs text-on-surface-variant font-body leading-relaxed whitespace-pre-line bg-surface-container-low p-3 rounded-xl border border-outline-variant/10 text-on-surface-variant/90">
                            {spec.usage}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Nutritional Info (Only for multi millet mix) */}
                  {spec.nutritionalInfo && (
                    <div className="border-b border-outline-variant/20 pb-3">
                      <button
                        onClick={() => toggleAccordion('nutrition')}
                        className="w-full flex justify-between items-center py-2.5 font-display text-sm font-bold text-primary hover:text-secondary transition-colors"
                      >
                        <span>NUTRITIONAL FACTS (PER 100G)</span>
                        <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${activeAccordion === 'nutrition' ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeAccordion === 'nutrition' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 pb-3">
                              <table className="w-full text-xs text-on-surface-variant font-body border border-outline-variant/20 rounded-xl overflow-hidden">
                                <thead>
                                  <tr className="bg-surface-container-low border-b border-outline-variant/20">
                                    <th className="px-4 py-2.5 text-left font-bold text-primary">Nutrient</th>
                                    <th className="px-4 py-2.5 text-right font-bold text-primary">Approx. Value</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {spec.nutritionalInfo.map((row, idx) => (
                                    <tr key={idx} className="border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-lowest">
                                      <td className="px-4 py-2 text-on-surface-variant">{row.label}</td>
                                      <td className="px-4 py-2 text-right font-bold text-primary">{row.value}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="mt-10 pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant/70 uppercase block">Total</span>
                  <span className="font-display text-2xl font-extrabold text-primary">₹{currentPrice}.00</span>
                </div>
                <button
                  onClick={() => {
                    onAddToCart(product.id, selectedSize);
                    onClose();
                  }}
                  className="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-body text-xs font-bold tracking-widest uppercase px-12 py-4 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
