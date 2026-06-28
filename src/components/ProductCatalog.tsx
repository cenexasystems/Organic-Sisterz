import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight, Heart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price50ml: number;
  price100ml: number;
  image: string;
}

const products: Product[] = [
  {
    id: 'hair-oil',
    name: 'Clinical Botanical Hair & Scalp Oil',
    category: 'Hair Treatment',
    description: 'Proprietary formulation of sage extract, cold-pressed bhringraj, and botanical lipids to accelerate thickness and soothe irritation.',
    price50ml: 45,
    price100ml: 78,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi8gtIvyu44eI0wdsqxbA3swpU1w3pmT32gR3aeELcR8HMw9Lqu1ePVaCnJd5mOiUfUQfglThoYVm_jprlrJXCCo9hGtXPDOOlfAP7v7R9HYgr2Lv-Bvpus9JkSO8IPXhZY0r5mt_u9W6kCxVxUaMJpVKzrlj9f4I1WcbmTDPBOETdysU2-8ImOe2GUIJR6cU60OtKvhfe_jcVfw2znUvNGeOxv0dzktdVBpHWEU4tILo8VB9Pkx4MWk72XaEbD9pmncIGI9DGZoE'
  },
  {
    id: 'follicle-serum',
    name: 'Follicle Active Restoration Serum',
    category: 'Scalp Care',
    description: 'Lightweight water-soluble serum containing dense peptides and adaptogenic ginseng to awaken root activity and block DHT topically.',
    price50ml: 52,
    price100ml: 88,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'scalp-scrub',
    name: 'Rosemary & Sea Salt Scalp Scrub',
    category: 'Exfoliation',
    description: 'Invigorating pre-wash exfoliator designed to clear sebum build-up, remove flakes, and increase blood circulation to follicles.',
    price50ml: 38,
    price100ml: 64,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600'
  }
];

export default function ProductCatalog() {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, '50ml' | '100ml'>>({
    'hair-oil': '100ml',
    'follicle-serum': '50ml',
    'scalp-scrub': '100ml'
  });

  const [addedProduct, setAddedProduct] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const handleSizeChange = (id: string, size: '50ml' | '100ml') => {
    setSelectedSizes(prev => ({ ...prev, [id]: size }));
  };

  const handleAddToCart = (id: string) => {
    setAddedProduct(id);
    setTimeout(() => setAddedProduct(null), 2000);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-24 md:py-32 bg-surface-container-low relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 max-w-xl"
          >
            <span className="font-body text-xs font-semibold text-secondary tracking-[0.2em] uppercase">
              The Formulations
            </span>
            <h2 className="font-display text-4xl lg:text-5xl text-primary font-medium tracking-tight">
              Clinical Botanical Solutions
            </h2>
          </motion.div>
          <motion.a 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            href="#" 
            className="group flex items-center gap-2 font-body text-xs font-semibold tracking-widest uppercase text-primary hover:text-secondary-container transition-colors duration-300"
          >
            View Full Collection 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product, index) => {
            const size = selectedSizes[product.id];
            const price = size === '50ml' ? product.price50ml : product.price100ml;
            const isAdded = addedProduct === product.id;
            const isFav = !!favorites[product.id];

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-outline-variant/20 hover:border-secondary/40 hover:shadow-lg transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-high">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button 
                      onClick={() => toggleFavorite(product.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                        isFav 
                          ? 'bg-secondary text-white' 
                          : 'bg-white/80 text-primary hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="absolute top-4 left-4 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <span className="font-body text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-8 flex flex-col flex-grow space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl text-primary font-medium group-hover:text-secondary transition-colors duration-300 leading-tight">
                      {product.name}
                    </h3>
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Size Selector */}
                  <div className="flex items-center gap-4">
                    <span className="font-body text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase">
                      Volume:
                    </span>
                    <div className="flex gap-2 bg-surface-container-low p-1 rounded-full border border-outline-variant/20">
                      {(['50ml', '100ml'] as const).map(vol => (
                        <button
                          key={vol}
                          onClick={() => handleSizeChange(product.id, vol)}
                          className={`relative px-4 py-1.5 rounded-full font-body text-[10px] font-semibold tracking-wider uppercase transition-colors duration-300 ${
                            size === vol
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'text-on-surface-variant hover:text-primary'
                          }`}
                        >
                          {vol}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Add to Cart */}
                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30 mt-auto">
                    <div>
                      <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest block opacity-75">
                        Price ({size})
                      </span>
                      <span className="font-display text-2xl font-semibold text-primary">
                        ${price}.00
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className={`relative overflow-hidden font-body text-xs font-semibold tracking-widest uppercase px-6 py-3.5 rounded-full flex items-center gap-2 transition-all duration-500 select-none ${
                        isAdded
                          ? 'bg-secondary text-white'
                          : 'bg-primary text-on-primary hover:bg-primary-container'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isAdded ? (
                          <motion.span
                            key="added"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-1"
                          >
                            Added <span className="text-secondary-fixed">✓</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="add"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                          >
                            Add to Cart <ShoppingBag className="w-3.5 h-3.5" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
