import {
  Menu,
  X,
  User,
  Gift,
  ShoppingBag,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { getStoredProducts, getStoredCart, saveStoredCart } from "../../utils/store";
import { useAuth } from "../../hooks/useAuth";

interface NavbarProps {
  onConsultationClick: () => void;
  onAdminClick: () => void;
  onGiftClick?: () => void;
}



export default function Navbar({
  onConsultationClick,
  onAdminClick,
  onGiftClick,
}: NavbarProps) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const [scrollProgress, setScrollProgress] = useState(0);

  const [cartItems, setCartItems] = useState(getStoredCart());

  // Sync products and cart from local storage
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = [
      "hero",
      "products-catalog",
      "before-after",
      "herbarium",
      "testimonials",
    ];
    const observers = sections
      .map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          },
          { threshold: 0.15, rootMargin: "-25% 0px -45% 0px" },
        );

        observer.observe(el);
        return { observer, el };
      })
      .filter(Boolean) as { observer: IntersectionObserver; el: HTMLElement }[];

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen to catalog Add to Cart triggers
  useEffect(() => {
    const handleAddEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ productId: string; size: string }>;
      const { productId, size } = customEvent.detail;

      const cart = getStoredCart();
      const existing = cart.find(
        (item) => item.productId === productId && item.size === size,
      );
      
      let updatedCart;
      if (existing) {
        updatedCart = cart.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // Need to look up product details to add
        const products = getStoredProducts();
        const product = products.find(p => p.id === productId);
        const sizeInfo = product?.sizes.find(s => s.size === size);
        
        if (product && sizeInfo) {
          updatedCart = [...cart, {
            productId,
            name: product.name,
            size: sizeInfo.size,
            price: sizeInfo.price,
            quantity: 1
          }];
        } else {
          updatedCart = cart;
        }
      }
      
      saveStoredCart(updatedCart);
      setCartItems(updatedCart);
      navigate('/cart');
    };

    window.addEventListener("mahizham_add_to_cart_triggered", handleAddEvent);
    return () =>
      window.removeEventListener(
        "mahizham_add_to_cart_triggered",
        handleAddEvent,
      );
  }, []);


  useEffect(() => {
    const handleCartUpdate = () => {
      setCartItems(getStoredCart());
    };
    window.addEventListener("cart_updated", handleCartUpdate);
    return () => window.removeEventListener("cart_updated", handleCartUpdate);
  }, []);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: "Products", href: "#products-catalog", id: "products-catalog" },
    { name: "Results", href: "#before-after", id: "before-after" },
    { name: "Story", href: "#herbarium", id: "herbarium" },
    { name: "Reviews", href: "#testimonials", id: "testimonials" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF9F5]/90 backdrop-blur-xl shadow-[0_2px_20px_rgba(43,62,47,0.03)] border-b border-[#2b3e2f]/10 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-3 items-center">
          
          {/* Left Side: Logo */}
          <div className="flex justify-start">
            <a
              href="#"
              className="font-display text-2xl md:text-3xl font-extrabold tracking-tight select-none text-primary flex items-center"
            >
              Organic Sisterz
            </a>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex justify-center items-center space-x-9">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative font-body text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 py-1.5 ${
                  link.id === activeSection
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.name}
                {link.id === activeSection && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-secondary"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center justify-end space-x-3 md:space-x-4">
            <button
              onClick={onGiftClick}
              className="hidden md:flex items-center gap-2 border border-[#2B3E2F]/20 hover:bg-[#2B3E2F]/5 text-[#2B3E2F] font-body text-[10px] font-bold tracking-[0.15em] uppercase px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" /> Gift a Friend
            </button>
            <button
              onClick={() => navigate('/login')}
              className="hidden md:flex items-center gap-2 bg-[#2B3E2F] hover:bg-[#1b3022] text-[#FAF9F5] font-body text-[10px] font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" /> {user ? "Profile" : "Login"}
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="text-primary hover:text-secondary hover:bg-[#2B3E2F]/5 transition-all p-2 rounded-full cursor-pointer relative"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary text-white rounded-full flex items-center justify-center font-body text-[8px] font-bold shadow-sm animate-pulse-slow">
                  {totalQuantity}
                </span>
              )}
            </button>
            <button
              className="md:hidden text-primary p-2 -mr-2 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Scroll Progress Indicator */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-secondary transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-outline-variant/30 overflow-hidden"
            >
              <div className="px-6 py-4 space-y-4 flex flex-col">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-body text-sm font-semibold tracking-widest uppercase py-2 ${
                      link.id === activeSection
                        ? "text-primary font-bold"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="font-body text-sm font-semibold tracking-widest uppercase text-primary border border-outline-variant/30 rounded-xl py-3 w-full flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors"
                >
                  <User className="w-4 h-4" /> {user ? "Profile" : "Login"}
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onAdminClick();
                  }}
                  className="font-body text-sm font-semibold tracking-widest uppercase py-2 text-left text-on-surface-variant hover:text-primary"
                >
                  Admin Console
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onGiftClick) onGiftClick();
                  }}
                  className="font-body text-sm font-semibold tracking-widest uppercase py-2 text-left text-secondary hover:text-[#1b3022] flex items-center gap-2"
                >
                  <Gift className="w-4 h-4" /> Gift a Friend
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onConsultationClick();
                  }}
                  className="bg-primary text-on-primary font-body text-xs font-semibold tracking-widest uppercase px-6 py-4 rounded-full mt-4 w-full cursor-pointer"
                >
                  Consultation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      
    </>
  );
}
