import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Heart, ShieldCheck } from "lucide-react";
import ProductDetailModal from "../ui/ProductDetailModal";
import { getStoredProducts } from "../../utils/store";
import type { Product } from "../../utils/store";

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const updateProducts = () => {
      const stored = getStoredProducts();
      setProducts(stored);
    };

    updateProducts();
    window.addEventListener("mahizham_products_updated", updateProducts);
    return () =>
      window.removeEventListener("mahizham_products_updated", updateProducts);
  }, []);

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (id: string, size?: string) => {

    const event = new CustomEvent("mahizham_add_to_cart_triggered", {
      detail: { productId: id, size: size || "" },
    });
    window.dispatchEvent(event);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="products-catalog"
      className="py-24 md:py-32 bg-[#FAF9F5] relative overflow-hidden"
    >
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => {
            const prices = product.sizes.map((s) => s.price);
            const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
            const isFav = !!favorites[product.id];

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-outline-variant/20 hover:border-secondary/40 hover:shadow-lg transition-all duration-500"
              >
                {/* Image Section */}
                <div
                  onClick={() => handleOpenModal(product)}
                  className="relative aspect-square overflow-hidden bg-white cursor-pointer flex items-center justify-center p-6 border-b border-outline-variant/10"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-[2s] group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Floating Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                        isFav
                          ? "bg-secondary text-white"
                          : "bg-white/80 text-primary hover:bg-white border border-outline-variant/20"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>

                  <div className="absolute top-4 left-4 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 border border-outline-variant/10">
                    <span className="font-body text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                      {product.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-primary/80 backdrop-blur-md px-2.5 py-1 rounded-md text-on-primary">
                    <span className="font-body text-[9px] font-semibold tracking-wider uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-secondary-container" />{" "}
                      {product.herbs}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6 flex flex-col flex-grow space-y-5">
                  <div
                    onClick={() => handleOpenModal(product)}
                    className="space-y-2 cursor-pointer group/title"
                  >
                    <h3 className="font-display text-xl text-primary font-medium group-hover/title:text-secondary transition-colors duration-300 leading-snug">
                      {product.name}
                    </h3>
                    <p className="font-body text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  {/* Bullet Benefits */}
                  <ul className="space-y-1.5 border-t border-b border-outline-variant/10 py-3 mt-auto">
                    {product.benefits.slice(0, 3).map((benefit, bIndex) => (
                      <li
                        key={bIndex}
                        className="font-body text-[10px] text-on-surface-variant flex items-start gap-1"
                      >
                        <span className="text-secondary font-bold">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Pricing and Select Options */}
                  <div className="flex items-center justify-between pt-2 gap-2">
                    <div className="min-w-0">
                      <span className="font-body text-[9px] text-on-surface-variant uppercase tracking-widest block opacity-75 truncate">
                        Starting at
                      </span>
                      <span className="font-display text-xl font-bold text-primary block truncate">
                        ₹{lowestPrice}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenModal(product)}
                      className="shrink-0 font-body text-[10px] font-semibold tracking-widest uppercase px-5 py-3 rounded-full flex items-center gap-1.5 bg-primary text-on-primary hover:bg-primary-container transition-all duration-300 select-none cursor-pointer"
                    >
                      Select Options <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={(id, size) => {
          handleAddToCart(id, size);
        }}
      />
    </section>
  );
}
