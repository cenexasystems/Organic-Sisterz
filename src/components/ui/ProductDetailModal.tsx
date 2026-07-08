import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Leaf, Sparkles, ChevronDown, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Product } from '../../utils/store';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (id: string, size: string) => void;
}

// Exact wording from the images provided
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
    details: 'NO Chemicals\nArtificial Scents\nArtificial Flavours\n\nMRP : 220/-\nBest before 6 months from the Mfd.\nPacked & Marketed by :\nMahizham Natural Products Pvt. Ltd., Chennai\nEmail : caremahizham@gmail.com',
    ingredients: 'Hibiscus, Rosemary, Rose Petals, Jatamansi Flax Seeds, Bhringraj, Amla, Alovera, Henna, Avuri, Fenugreek with unique & rare herbs.',
    benefitsList: [
      '* Controls premature greying',
      '* Boosts volume and hair growth',
      '* Protects from UV Rays',
      '* Reduce dandruff',
      '* Suitable for all ages'
    ],
    usage: 'Suggested Use :\n* Apply Mahizham Herbal Hair oil on your scalp and massage with finger tips its regular usage.\n* Apply Hair Oil to the scalp gently massage few mins soak for an hour, then wash it with shikakai or mild shampoo ensure effectiveness.',
    features: [
      { icon: 'leaf', title: '100% Organic', subtitle: 'Pure & Handcrafted' },
      { icon: 'sparkles', title: 'Scalp Nourishing', subtitle: 'Restores Root Lipids' },
      { icon: 'plant', title: 'Dandruff Control', subtitle: 'Anti-Microbial Herbs' },
      { icon: 'shield', title: 'Sulfate Free', subtitle: 'Zero Mineral Oils' }
    ]
  },
  'shikakai-powder': {
    tamilName: 'சிகைக்காய் பொடி',
    rating: '4.7',
    details: 'Net Weight : 100 gm\nMRP : 140/-\nPacked & Marketed by :\nMahizham Natural Products\nEmail : caremahizham@gmail.com\nBest before 6 months from the date of packing',
    ingredients: 'Shitakai, Methi Reetha, Avuri, Hibiscus, Green Garam, Vetiver, Aloe, Curry Leaves, Bringaraj, Neem,Amla, Kadukkai, Poolankizhangu, Avaram Flower,Rose Flower, Henna, Karisalankani With Unique and rare Herbs.',
    benefitsList: [
      '*Strengthens hair root and healthy scalp.',
      '* Prevents hair loss and pre-mature greying.',
      '* Act as a anti-dandruff agent.'
    ],
    usage: 'Usage :\nTake Little Quantity of Shikakai Powder Mix with water apply to hair & wash it or\nHair Pack : Apply with your hair Leave it with 10 minutes then rinse off with water',
    features: [
      { icon: 'leaf', title: '100% Botanical', subtitle: 'Pure & Sun-Dried' },
      { icon: 'sparkles', title: 'pH Balanced', subtitle: 'Safe on Sensitive Scalps' },
      { icon: 'plant', title: 'Natural Lather', subtitle: 'Rich in Saponins' },
      { icon: 'shield', title: 'Zero Chemicals', subtitle: 'Sulfates & Parabens Free' }
    ]
  },
  'face-pack-bath-powder': {
    tamilName: 'குளியல் பொடி & ஃபேஸ் பேக்',
    rating: '4.9',
    details: 'Net Weight : 100gm\nMRP : 180/-\nPacked & Marketed by :\nMahizham Natural Products Pvt. Ltd., Chennai\nEmail : caremahizham@gmail.com\nBest before 6 months from the date of packing',
    ingredients: 'Green Gram, Uraddhal, Wheat, Rosemary, Hibiscus,Manjista, Dhriviya Pattai, Neeradi Muthu, Badham, Kadukaai, Mahizham Flower, Shenbaga Flower, Dry Aloevera, Red Sandal, Beetroot Dry with unique & rare herbs.',
    benefitsList: [
      '* Controls Acne Pimples, Blackheads.',
      '* Removes dead Skin, Sunburn, Tan and softness skin.',
      '* Improves skin complexion.',
      '* Ideal for daily usage instead of soap.',
      '* Prevents white scaling, germs and rashes in the skin.'
    ],
    usage: 'Usage :\nBath Powder : Apply Coconut oil or Ghee & take the required amount of Bath Powder mixed with water to form a paste. Apply For Face and entire body, Scrub well & wash it\n\nFace Pack : Apply the paste and leave it to dry or 10 minutes and rinse off.',
    features: [
      { icon: 'leaf', title: '100% Herbal', subtitle: 'Wild Turmeric & Senna' },
      { icon: 'sparkles', title: 'Deep Cleansing', subtitle: 'Clear Acne & Spots' },
      { icon: 'plant', title: 'Skin Radiance', subtitle: 'Restores Natural Glow' },
      { icon: 'shield', title: 'Gentle Exfoliator', subtitle: 'Safe for Daily Bathing' }
    ]
  },
  'multi-millet-mix': {
    tamilName: 'சத்து மாவு',
    rating: '4.8',
    details: 'MRP : 220/-\nNET WEIGHT : 250gm\nBEST BEFORE : 6 Months\nBATCH NO. 13.06.2026\nPacked & Marketed by :\nMahizham Natural Products\nChennai\nContact : 87783 11671 / 98406 23527\nSTORAGE INSTRUCTION : Transfer the contents Into a clean dry airtight container & Refrigerate.',
    ingredients: 'Moongil Rice, Raagi, Red Rice, Thooyamalli Rice, Naattu Kambu, Saamai, Thinai, Kaatu Yanam, Mappillai Samba, Black Kavuni , Navara Rice, Kuthiraivaali, Moongdhal, Black Urad Dhal, Kuzhiadichan Rice, Kadaikani Rice, Panivaragu, Samba Wheat, Badham, Pista, Cashew, Black Channa, White Channa, Rajma,Kollu, Red Aval, Red Corn,Red Karamani, Makka Cholam, Elachi, Sukku, Fried Gram, Varagu, Barley, Javarasi, Flax Seed, Poongaar Rice, Karunkuravai Rice,Neelam Zamba, Pumpkin Seed, Kullakaar Rice, Soya Beans, Valan Zamba, Double Beans, Kudavazhai Rice',
    benefitsList: [
      'Note : You can also use this Powder to make Yummy Ladoo, Dosa & Adai.'
    ],
    usage: 'HOW TO PREPARE ?\n* Add Little water to a Spoonful of Mahizham Multi Millet Health Mix\n* Boil a Glass of Water. Add the mixture & cook for 10 mins on a medium flame.\n* Turn off flame. add Required milk & Jaggery Powder (or) buttermilk & salt.',
    nutritionalInfo: [
      { label: 'Energy', value: '431 Kcal' },
      { label: 'Carbohydrates', value: '63.9 g' },
      { label: 'Total Fat', value: '13.3 g' },
      { label: 'Protein', value: '13.8 g' },
      { label: 'Dietary Fiber', value: '9.80 g' },
      { label: 'Total Sugars', value: 'BDL' },
      { label: 'Sodium', value: '74.9 mg' }
    ],
    fssai: '22424524000080',
    features: [
      { icon: 'leaf', title: '100% Nutritious', subtitle: '40+ Ancient Grains' },
      { icon: 'sparkles', title: 'Rich in Fiber', subtitle: 'Supports Healthy Gut' },
      { icon: 'plant', title: 'High Protein', subtitle: 'Naturally Energizing' },
      { icon: 'shield', title: 'Lab Tested', subtitle: 'Certified Food Standards' }
    ]
  }
};

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart }: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (product && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].size);
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!product) return null;

  // Read details, herbs, benefits, and howToUse dynamically from the product object
  const spec = {
    tamilName: product.tamilName || '',
    rating: '4.8',
    details: product.details || product.description,
    ingredients: product.herbs,
    benefitsList: product.benefits,
    usage: product.howToUse || 'Apply as directed on the label.',
    features: (productSpecs[product.id] || {
      features: [
        { icon: 'leaf', title: '100% Organic', subtitle: 'Pure & Handcrafted' },
        { icon: 'sparkles', title: 'Fresh & Organic', subtitle: 'Restores Root Lipids' },
        { icon: 'plant', title: 'Premium Herbs', subtitle: 'No Artificial Additives' },
        { icon: 'shield', title: 'Safe Packaging', subtitle: 'Zero Mineral Oils' }
      ]
    }).features,
    fssai: productSpecs[product.id]?.fssai,
    nutritionalInfo: productSpecs[product.id]?.nutritionalInfo
  };

  const activeSizeStr = selectedSize || (product.sizes[0]?.size || '');
  const sizeObj = product.sizes.find(s => s.size === activeSizeStr) || product.sizes[0];
  const currentPrice = sizeObj ? sizeObj.price : 0;

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
            data-lenis-prevent
            className="relative bg-white w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-6xl md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-y-auto z-10 md:border md:border-outline-variant/20"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/95 border border-outline-variant/30 hover:border-secondary flex items-center justify-center text-primary hover:text-secondary shadow-md transition-all duration-300 z-30 cursor-pointer"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>

            {/* Left Column: Image Area */}
            <div className="w-full md:w-1/2 bg-[#F9F7F0] pt-16 pb-6 px-4 md:p-10 flex flex-col relative shrink-0 border-b md:border-b-0 md:border-r border-outline-variant/20 md:h-full">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-start mb-2 md:mb-6">
                <span className="font-body text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
                  Premium Selection
                </span>
                <span className="font-body text-[10px] font-bold tracking-widest uppercase bg-secondary/15 text-secondary px-3 py-1.5 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Main Product Image */}
              <div className="relative w-full flex-1 mx-auto flex items-center justify-center my-auto group p-2 md:p-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full max-h-[250px] md:max-h-[450px] object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl mix-blend-multiply"
                />
              </div>
            </div>

            {/* Right Column: details and specifications */}
            <div className="w-full md:w-1/2 flex flex-col bg-white shrink-0 md:h-full md:max-h-[90vh]">
              {/* Scrolling details content */}
              <div className="flex-1 md:overflow-y-auto p-5 md:p-10 space-y-6">
                {/* Green Subtitle & Title */}
                <div className="space-y-2">
                  <span className="font-body text-xs font-bold text-secondary tracking-widest uppercase block">
                    Mahizham Organic
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl text-primary font-bold tracking-tight">
                    {product.name}
                  </h2>
                </div>

                {/* Price Display Moved Up */}
                <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-outline-variant/30 flex justify-between items-center">
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
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((sObj, idx) => {
                      const isSizeAvailable = sObj.isAvailable !== false;
                      const isSelected = activeSizeStr === sObj.size;
                      return (
                        <button
                          key={idx}
                          disabled={!isSizeAvailable}
                          onClick={() => setSelectedSize(sObj.size)}
                          className={`px-5 py-3.5 rounded-xl font-body text-sm font-bold border transition-all duration-300 relative ${
                            !isSizeAvailable
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                              : isSelected
                                ? 'bg-primary text-white border-primary shadow-md cursor-pointer'
                                : 'bg-white text-primary border-outline-variant/30 hover:border-secondary cursor-pointer'
                          }`}
                        >
                          <span>{sObj.size}</span>
                          {!isSizeAvailable && (
                            <span className="absolute -top-2 -right-2 bg-error text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
                              OOS
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="font-body text-[10px] text-on-surface-variant/80">
                    Net Weight: {activeSizeStr} • Total price: ₹{currentPrice}
                  </p>
                </div>

                {/* Grid of 4 Attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8">
                  {spec.features.map((feat, index) => (
                    <div 
                      key={index} 
                      className="p-3 sm:p-4 bg-surface-container-low rounded-2xl border border-outline-variant/15 flex gap-3 items-center min-w-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                        {renderIcon(feat.icon)}
                      </div>
                      <div className="min-w-0">
                        <span className="block font-display text-xs font-bold text-primary break-words">{feat.title}</span>
                        <span className="block font-body text-[10px] text-on-surface-variant break-words">{feat.subtitle}</span>
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
                            <div className="whitespace-pre-line bg-surface-container-low p-3 rounded-xl border border-outline-variant/10 text-on-surface-variant/90 font-semibold mb-2">
                              {spec.details}
                            </div>
                            {spec.fssai && (
                              <p className="text-[10px] font-bold text-secondary">fssai {spec.fssai}</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Dedicated Ingredients Accordion */}
                  <div className="border-b border-outline-variant/20 pb-3">
                    <button
                      onClick={() => toggleAccordion('ingredients')}
                      className="w-full flex justify-between items-center py-2.5 font-display text-sm font-bold text-primary hover:text-secondary transition-colors"
                    >
                      <span>INGREDIENTS</span>
                      <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${activeAccordion === 'ingredients' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeAccordion === 'ingredients' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 pb-3 text-xs text-on-surface-variant font-body leading-relaxed">
                            <div className="italic bg-surface-container-low p-3 rounded-xl border border-outline-variant/10 text-on-surface-variant/90">
                              {spec.ingredients}
                            </div>
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
                      <span>BENEFITS</span>
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
                            <ul className="space-y-2 bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
                              {spec.benefitsList.map((ben, idx) => (
                                <li key={idx} className="text-on-surface-variant">
                                  {ben}
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
              <div className="p-4 md:px-10 md:py-6 border-t border-outline-variant/20 flex flex-row gap-3 items-center justify-between bg-[#FAF9F5] md:bg-[#FAF9F5]/40 backdrop-blur-sm shrink-0 sticky bottom-0 z-20">
                <div className="flex flex-col min-w-[70px]">
                  <span className="text-[10px] font-bold text-on-surface-variant/70 uppercase block">Total</span>
                  <span className="font-display text-lg md:text-2xl font-extrabold text-primary">₹{currentPrice * quantity}</span>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center bg-white rounded-full border border-outline-variant/30 h-10 md:h-12 px-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-primary font-bold hover:bg-surface-container-low rounded-full cursor-pointer">-</button>
                  <span className="w-5 md:w-6 text-center font-bold text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-primary font-bold hover:bg-surface-container-low rounded-full cursor-pointer">+</button>
                </div>

                  <button
                  disabled={product.isAvailable === false || (sizeObj && sizeObj.isAvailable === false) || isAdding}
                  onClick={() => {
                    if (isAdding) return;
                    setIsAdding(true);
                    for(let i=0; i<quantity; i++) {
                       onAddToCart(product.id, activeSizeStr);
                    }
                    setTimeout(() => {
                      setIsAdding(false);
                    }, 2000);
                  }}
                  className={`font-body text-[10px] md:text-xs font-bold tracking-widest uppercase px-5 md:px-8 py-3.5 md:py-4 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
                    product.isAvailable === false || (sizeObj && sizeObj.isAvailable === false) || isAdding
                      ? 'bg-gray-400 text-white cursor-not-allowed shadow-none'
                      : 'bg-primary hover:bg-primary-container text-on-primary cursor-pointer'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 hidden sm:block" />
                  <span>
                    {product.isAvailable === false || (sizeObj && sizeObj.isAvailable === false)
                      ? 'Out of Stock'
                      : isAdding ? 'Added ✓' : 'Add to Cart'}
                  </span>
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
