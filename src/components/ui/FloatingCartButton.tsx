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
    const handleCartUpdate = () => {
      setCartItems(getStoredCart());
    };
    
    const handleAddEvent = () => {
      // Navbar saves it, so wait a tiny bit then read
      setTimeout(() => {
        setCartItems(getStoredCart());
      }, 50);
    };

    window.addEventListener("cart_updated", handleCartUpdate);
    window.addEventListener("mahizham_add_to_cart_triggered", handleAddEvent);
    
    return () => {
      window.removeEventListener("cart_updated", handleCartUpdate);
      window.removeEventListener("mahizham_add_to_cart_triggered", handleAddEvent);
    };
  }, []);

  // Hide on cart, login, admin, etc.
  if (
    location.pathname === "/cart" || 
    location.pathname === "/login" || 
    location.pathname === "/admin" ||
    location.pathname.startsWith("/invoice")
  ) {
    return null;
  }

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {totalQuantity > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 100, opacity: 0, x: "-50%" }}
          className="fixed bottom-6 left-1/2 z-[100] cursor-pointer"
          onClick={() => navigate(user ? "/cart" : "/login?redirect=/cart")}
        >
          <div className="bg-[#1B3022] hover:bg-[#0c1510] transition-colors text-white rounded-full px-6 py-3.5 flex items-center gap-5 shadow-2xl border border-white/10">
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2.5} />
              <span className="absolute -top-2.5 -right-2.5 bg-[#81B29A] text-[#1B3022] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-sm">
                {totalQuantity}
              </span>
            </div>
            
            <div className="font-display font-extrabold text-lg tracking-tight">
              ₹{totalPrice.toFixed(0)}
            </div>

            <div className="w-[1px] h-6 bg-white/30"></div>

            <div className="flex items-center gap-2 font-body text-xs font-bold tracking-widest uppercase text-white/90">
              {user ? "Checkout" : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
