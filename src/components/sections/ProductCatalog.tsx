import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import ProductDetailModal from "../ui/ProductDetailModal";
import { fetchProducts } from "../../utils/db";
import type { Product } from "../../utils/store";

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const updateProducts = async () => {
      try {
        const stored = await fetchProducts();
        const sorted = [...stored].sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          if (a.id === 'herbal-hair-oil' || aName.includes('herbal hair oil') || aName.includes('hair oil')) return -1;
          if (b.id === 'herbal-hair-oil' || bName.includes('herbal hair oil') || bName.includes('hair oil')) return 1;
          return 0;
        });
        setProducts(sorted);
      } catch (err) {
        console.error("Failed to load products from database:", err);
      }
    };

    updateProducts();
    
    // Optional: Keep listening for custom events if the catalog needs to update dynamically in the same tab
    const handleUpdateEvent = () => updateProducts();
    window.addEventListener("mahizham_products_updated", handleUpdateEvent);
    return () =>
      window.removeEventListener("mahizham_products_updated", handleUpdateEvent);
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
    setIsModalOpen(false);
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
          
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => {
            const prices = product.sizes.map((s) => s.price);
            const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;

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
                <div
                  onClick={() => handleOpenModal(product)}
                  className="relative h-[280px] w-full overflow-hidden bg-white cursor-pointer flex items-center justify-center p-8 border-b border-outline-variant/10"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-[2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 border border-outline-variant/10 shadow-sm w-fit">
                      <span className="font-body text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                        {product.category}
                      </span>
                    </div>
                    {product.id === 'herbal-hair-oil' && (
                      <div className="bg-secondary text-white px-3 py-1.5 rounded-full flex items-center gap-1 border border-secondary/20 shadow-sm w-fit">
                        <span className="font-body text-[10px] font-bold tracking-widest uppercase">
                          🔥 Most Selling
                        </span>
                      </div>
                    )}
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
