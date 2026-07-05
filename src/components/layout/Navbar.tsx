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
 
  onGiftClick,
}: NavbarProps) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();



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
      // Removed navigate('/cart') to allow user to continue shopping
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
    { name: "Home", href: "/#hero", id: "hero" },
    { name: "Products", href: "/#products-catalog", id: "products-catalog" },
    { name: "Results", href: "/#before-after", id: "before-after" },
    { name: "Story", href: "/#herbarium", id: "herbarium" },
    { name: "Reviews", href: "/#testimonials", id: "testimonials" },
  ];

  // Handle hash scrolling on page load/navigate
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.substring(1);
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else if (id === "hero") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 300); // give it a moment to render/initialize Lenis
      return () => clearTimeout(timer);
    }
  }, [window.location.hash, window.location.pathname]);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      const targetId = link.id;
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else if (targetId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      navigate(link.href);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#2B3E2F]/10 shadow-[0_2px_15px_rgba(0,0,0,0.02)] py-4 px-6 xl:px-12" 
            : "bg-transparent py-6 px-6 xl:px-12"
        }`}
      >
        <div className="w-full max-w-[1600px] mx-auto grid grid-cols-2 xl:grid-cols-3 items-center">
          
          {/* Left Side: Logo */}
          <div className="flex justify-start">
            <a
              href="/"
              className="font-display text-2xl xl:text-3xl font-extrabold tracking-tight select-none text-primary flex items-center"
            >
              Organic Sisterz
            </a>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden xl:flex justify-center items-center space-x-9">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavLinkClick(e, link)}
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
          <div className="flex items-center justify-end space-x-3 xl:space-x-4">
            <button
              onClick={onGiftClick}
              className="hidden xl:flex items-center gap-2 border border-[#2B3E2F]/20 hover:bg-[#2B3E2F]/5 text-[#2B3E2F] font-body text-[10px] font-bold tracking-[0.15em] uppercase px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" /> Gift a Friend
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
              onClick={() => navigate(user ? '/profile' : '/login')}
              className="hidden xl:flex items-center gap-2 bg-[#2B3E2F] hover:bg-[#1b3022] text-[#FAF9F5] font-body text-[10px] font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" /> {user ? "Profile" : "Login"}
            </button>
            <button
              className="xl:hidden text-primary p-2 -mr-2 cursor-pointer"
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



        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[60] bg-[#FAF9F5] xl:hidden flex flex-col pt-8 px-8 pb-8 h-[100dvh] overflow-y-auto"
            >
              {/* Drawer Header with Close Button */}
              <div className="flex justify-end mb-10">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#1B3022] p-2 hover:bg-[#1B3022]/10 rounded-full transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="flex flex-col gap-6 w-full h-full">
                <div className="flex flex-col gap-4 border-b border-outline-variant/20 pb-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavLinkClick(e, link)}
                      className={`font-display text-2xl font-bold uppercase tracking-widest transition-colors ${
                        link.id === activeSection
                          ? "text-[#1B3022]"
                          : "text-[#6B7280] hover:text-[#1B3022]"
                      }`}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
                
                <div className="flex flex-col gap-4 pt-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(user ? '/profile' : '/login');
                    }}
                    className="font-body text-sm font-semibold tracking-widest uppercase text-[#1B3022] border border-[#1B3022]/20 rounded-full py-4 w-full flex items-center justify-center gap-2 hover:bg-[#1B3022]/5 transition-colors"
                  >
                    <User className="w-4 h-4" /> {user ? "Profile" : "Login"}
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onGiftClick) onGiftClick();
                    }}
                    className="font-body text-sm font-semibold tracking-widest uppercase text-[#D4AF37] border border-[#D4AF37]/30 rounded-full py-4 w-full flex items-center justify-center gap-2 hover:bg-[#D4AF37]/10 transition-colors"
                  >
                    <Gift className="w-4 h-4" /> Gift a Friend
                  </button>

                  
                  
                  
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      
    </>
  );
}
