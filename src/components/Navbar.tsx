import {
  ShoppingBag,
  Menu,
  X,
  Settings,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Leaf,
  Sparkles,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getStoredProducts, addOrder } from "../utils/store";

interface NavbarProps {
  onConsultationClick: () => void;
  onAdminClick: () => void;
}

interface CartItem {
  productId: string;
  size: string;
  quantity: number;
}

export default function Navbar({
  onConsultationClick,
  onAdminClick,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "success">(
    "cart",
  );
  const [products, setProducts] = useState(getStoredProducts());

  // Checkout Form State
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [placedOrderId, setPlacedOrderId] = useState("");

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
    const handleProductsUpdate = () => {
      setProducts(getStoredProducts());
    };

    window.addEventListener("mahizham_products_updated", handleProductsUpdate);
    return () =>
      window.removeEventListener(
        "mahizham_products_updated",
        handleProductsUpdate,
      );
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

      setCartItems((prev) => {
        const existing = prev.find(
          (item) => item.productId === productId && item.size === size,
        );
        if (existing) {
          return prev.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...prev, { productId, size, quantity: 1 }];
      });
      setIsCartOpen(true);
      setCheckoutStep("cart");
    };

    window.addEventListener("mahizham_add_to_cart_triggered", handleAddEvent);
    return () =>
      window.removeEventListener(
        "mahizham_add_to_cart_triggered",
        handleAddEvent,
      );
  }, []);

  // Quantity handlers
  const updateQuantity = (productId: string, size: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const removeCartItem = (productId: string, size: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.size === size),
      ),
    );
  };

  // Cart helper selectors
  const resolvedCartItems = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const sizeObj = product?.sizes.find((s) => s.size === item.size);
      return {
        ...item,
        name: product?.name || "Unknown Formulation",
        image: product?.image || "/herbal-hair-oil.jpeg",
        price: sizeObj ? sizeObj.price : 0,
        totalItemPrice: (sizeObj ? sizeObj.price : 0) * item.quantity,
      };
    })
    .filter((item) => item.price > 0);

  const subtotal = resolvedCartItems.reduce(
    (acc, curr) => acc + curr.totalItemPrice,
    0,
  );
  const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Submit Order Form
  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resolvedCartItems.length === 0) return;

    const orderData = {
      customerName: custName,
      customerPhone: custPhone,
      customerEmail: custEmail,
      customerAddress: custAddress,
      items: resolvedCartItems.map((it) => ({
        productId: it.productId,
        name: it.name,
        size: it.size,
        price: it.price,
        quantity: it.quantity,
      })),
      totalPrice: subtotal,
    };

    const newOrder = addOrder(orderData);
    setPlacedOrderId(newOrder.id);
    setCartItems([]);
    setCheckoutStep("success");

    // Reset Form Fields
    setCustName("");
    setCustPhone("");
    setCustEmail("");
    setCustAddress("");
  };

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
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          {/* Left Side: Logo and Navigation Links */}
          <div className="flex items-center space-x-12">
            <a
              href="#"
              className="font-display text-2xl md:text-3xl font-medium tracking-tight select-none flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-full bg-[#2B3E2F]/10 flex items-center justify-center text-[#2B3E2F] group-hover:bg-[#2B3E2F] group-hover:text-white transition-all duration-500 shadow-sm">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-semibold text-primary">
                Organic{" "}
                <span className="font-medium italic text-secondary">
                  Sisterz
                </span>
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-9">
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
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              className="hidden md:flex items-center gap-2 bg-[#2B3E2F] hover:bg-[#1b3022] text-[#FAF9F5] font-body text-[10px] font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" /> Login
            </button>
            <button
              onClick={() => {
                setIsCartOpen(true);
                setCheckoutStep("cart");
              }}
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
                    onAdminClick();
                  }}
                  className="font-body text-sm font-semibold tracking-widest uppercase py-2 text-left text-on-surface-variant hover:text-primary"
                >
                  Admin Console
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

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-primary/30 backdrop-blur-sm z-50 cursor-pointer"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col p-8 border-l border-outline-variant/30 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-6 mb-6">
                <h3 className="font-display text-2xl text-primary font-medium flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-secondary" />
                  {checkoutStep === "cart" && "Shopping Curation"}
                  {checkoutStep === "form" && "Secure Checkout"}
                  {checkoutStep === "success" && "Order Placed"}
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-primary hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* STEP 1: CART ITEMS VIEW */}
              {checkoutStep === "cart" &&
                (resolvedCartItems.length === 0 ? (
                  <div className="flex-grow flex flex-col justify-center items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h4 className="font-display text-xl text-primary font-medium">
                      Your curation is empty
                    </h4>
                    <p className="font-body text-xs text-on-surface-variant max-w-xs leading-relaxed">
                      Browse our Clinical Botanical collections to find a
                      formulation customized for your hair and skin health.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-primary text-on-primary font-body text-xs font-semibold tracking-widest uppercase px-6 py-3.5 rounded-full hover:bg-primary-container transition-colors duration-300 mt-4 cursor-pointer"
                    >
                      Continue Browsing
                    </button>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
                      {resolvedCartItems.map((item, idx) => (
                        <div
                          key={`${item.productId}-${item.size}`}
                          className="flex gap-4 items-center"
                        >
                          <div className="w-16 h-16 rounded-xl border border-outline-variant/35 bg-[#FAF9F5] p-2 flex items-center justify-center shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-display text-sm font-bold text-primary truncate">
                              {item.name}
                            </h4>
                            <div className="font-body text-[10px] text-on-surface-variant font-bold mt-0.5 uppercase tracking-wider">
                              Size: {item.size} • ₹{item.price}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center border border-outline-variant/30 rounded-lg bg-surface-container-low">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.size,
                                      -1,
                                    )
                                  }
                                  className="px-2.5 py-1 text-primary hover:text-secondary transition-colors"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="px-2 font-body text-xs font-bold text-primary">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.productId, item.size, 1)
                                  }
                                  className="px-2.5 py-1 text-primary hover:text-secondary transition-colors"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              removeCartItem(item.productId, item.size)
                            }
                            className="text-on-surface-variant hover:text-error transition-colors p-1.5 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-outline-variant/30 pt-6 mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                          Subtotal:
                        </span>
                        <span className="font-display text-2xl font-bold text-primary">
                          ₹{subtotal}.00
                        </span>
                      </div>
                      <button
                        onClick={() => setCheckoutStep("form")}
                        className="w-full bg-primary hover:bg-primary-container text-on-primary font-body text-xs font-semibold tracking-widest uppercase py-4 rounded-full transition-colors cursor-pointer"
                      >
                        Secure Checkout
                      </button>
                    </div>
                  </div>
                ))}

              {/* STEP 2: CHECKOUT FORM VIEW */}
              {checkoutStep === "form" && (
                <div className="flex-grow flex flex-col justify-between">
                  <form onSubmit={handlePlaceOrderSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block font-body text-[10px] font-bold text-primary uppercase">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full border border-outline-variant/40 rounded-xl py-3 px-4 font-body text-xs text-primary focus:outline-none focus:border-secondary"
                        placeholder="e.g. Anand Sivaram"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block font-body text-[10px] font-bold text-primary uppercase">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        className="w-full border border-outline-variant/40 rounded-xl py-3 px-4 font-body text-xs text-primary focus:outline-none focus:border-secondary"
                        placeholder="e.g. 9940088786"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block font-body text-[10px] font-bold text-primary uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        className="w-full border border-outline-variant/40 rounded-xl py-3 px-4 font-body text-xs text-primary focus:outline-none focus:border-secondary"
                        placeholder="e.g. caremahizham@gmail.com"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block font-body text-[10px] font-bold text-primary uppercase">
                        Delivery Address
                      </label>
                      <textarea
                        value={custAddress}
                        onChange={(e) => setCustAddress(e.target.value)}
                        rows={3}
                        className="w-full border border-outline-variant/40 rounded-xl py-3 px-4 font-body text-xs text-primary focus:outline-none focus:border-secondary"
                        placeholder="Flat/House No, Street, Area, City, Pincode"
                        required
                      />
                    </div>

                    <div className="border-t border-outline-variant/30 pt-6 mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                          Subtotal:
                        </span>
                        <span className="font-display text-2xl font-bold text-primary">
                          ₹{subtotal}.00
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep("cart")}
                          className="w-1/3 border border-outline-variant/40 text-primary hover:bg-[#FAF9F5] font-body text-xs font-bold tracking-widest uppercase py-3 rounded-full transition-colors cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-body text-xs font-bold tracking-widest uppercase py-3 rounded-full transition-colors shadow cursor-pointer"
                        >
                          Place Order
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 3: ORDER SUCCESS VIEW */}
              {checkoutStep === "success" && (
                <div className="flex-grow flex flex-col justify-center items-center text-center space-y-6 py-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shadow-sm"
                  >
                    <CheckCircle className="w-10 h-10" />
                  </motion.div>
                  <div className="space-y-2">
                    <h4 className="font-display text-xl text-primary font-bold">
                      Order Received!
                    </h4>
                    <p className="font-body text-xs text-on-surface-variant">
                      Thank you for trusting Mahizham Natural Formulations.
                    </p>
                  </div>
                  <div className="bg-[#FAF9F5] border border-outline-variant/35 p-4 rounded-2xl w-full text-center space-y-1">
                    <span className="block font-body text-[10px] text-on-surface-variant uppercase font-semibold">
                      Your Order ID
                    </span>
                    <span className="block font-display text-lg font-extrabold text-primary tracking-wider">
                      {placedOrderId}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-primary hover:bg-primary-container text-on-primary font-body text-xs font-semibold tracking-widest uppercase py-4 rounded-full transition-colors cursor-pointer"
                  >
                    Close & Keep Browsing
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
