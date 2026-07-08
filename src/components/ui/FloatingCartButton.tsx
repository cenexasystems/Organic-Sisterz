import { ShoppingCart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStoredCart } from "../../utils/store";
import { useAuth } from "../../hooks/useAuth";

export default function FloatingCartButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [cartItems, setCartItems] = useState(getStoredCart());

  useEffect(() => {
    const handleCartUpdate = () => setCartItems(getStoredCart());
    const handleAddEvent = () => setTimeout(() => setCartItems(getStoredCart()), 50);

    window.addEventListener("cart_updated", handleCartUpdate);
    window.addEventListener("mahizham_add_to_cart_triggered", handleAddEvent);
    
    return () => {
      window.removeEventListener("cart_updated", handleCartUpdate);
      window.removeEventListener("mahizham_add_to_cart_triggered", handleAddEvent);
    };
  }, []);

  // Hide on cart, login, admin, invoice pages
  const hidden = ["/cart", "/login", "/admin", "/profile", "/gift"].includes(location.pathname) 
    || location.pathname.startsWith("/invoice");
  
  if (hidden) return null;

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {totalQuantity > 0 && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] cursor-pointer w-auto"
          onClick={() => navigate(user ? "/cart" : "/login?redirect=/cart")}
        >
          <div className="bg-[#1B3022] hover:bg-[#0c1510] active:scale-95 transition-all text-white rounded-full px-5 py-3 md:px-6 md:py-3.5 flex items-center gap-4 md:gap-5 shadow-2xl border border-white/10 w-auto justify-center">
            {/* Cart Icon + Badge */}
            <div className="relative shrink-0 flex items-center">
              <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2.5} />
              <span className="absolute -top-2 -right-2.5 bg-[#81B29A] text-[#1B3022] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-sm">
                {totalQuantity}
              </span>
            </div>

            {/* Price */}
            <div className="font-display font-extrabold text-base md:text-lg tracking-tight">
              ₹{totalPrice.toFixed(0)}
            </div>

            <div className="w-[1px] h-5 bg-white/30 hidden md:block"></div>

            {/* CTA */}
            <div className="flex items-center gap-1.5 font-body text-[11px] md:text-xs font-bold tracking-widest uppercase text-white/90">
              {user ? "Checkout" : "Sign In & Checkout"}
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
