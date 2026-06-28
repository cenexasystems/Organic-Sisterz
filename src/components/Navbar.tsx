import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onConsultationClick: () => void;
}

export default function Navbar({ onConsultationClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Botanicals', href: '#' },
    { name: 'Clinical Science', href: '#', active: true },
    { name: 'Shop', href: '#' },
    { name: 'Philosophy', href: '#' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-outline-variant/30 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <a href="#" className="font-display text-2xl md:text-3xl font-medium tracking-tight text-primary">
            Organic Sisterz
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative font-body text-xs font-semibold tracking-widest uppercase transition-colors duration-300 ${
                  link.active
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.name}
                {link.active && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onConsultationClick}
              className="hidden md:block bg-primary text-on-primary font-body text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded-full hover:bg-primary-container transition-colors duration-300 cursor-pointer"
            >
              Consultation
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-primary hover:text-primary-container transition-colors duration-300 p-2 hover:bg-black/5 rounded-full cursor-pointer relative"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button
              className="md:hidden text-primary p-2 -mr-2 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-outline-variant/30 overflow-hidden"
            >
              <div className="px-6 py-4 space-y-4 flex flex-col">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`font-body text-sm font-semibold tracking-widest uppercase py-2 ${
                      link.active ? 'text-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col p-8 border-l border-outline-variant/30"
            >
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-6 mb-6">
                <h3 className="font-display text-2xl text-primary font-medium flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-secondary" /> Shopping Drawer
                </h3>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-primary hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Content */}
              <div className="flex-grow flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="font-display text-xl text-primary font-medium">Your curation is empty</h4>
                <p className="font-body text-xs text-on-surface-variant max-w-xs leading-relaxed">
                  Browse our Clinical Botanical collections to find a formulation customized for your hair and skin health.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-primary text-on-primary font-body text-xs font-semibold tracking-widest uppercase px-6 py-3.5 rounded-full hover:bg-primary-container transition-colors duration-300 mt-4 cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
              
              {/* Footer */}
              <div className="border-t border-outline-variant/30 pt-6 mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Subtotal:</span>
                  <span className="font-display text-2xl font-bold text-primary">₹0.00</span>
                </div>
                <button className="w-full bg-primary/25 text-white/50 cursor-not-allowed font-body text-xs font-semibold tracking-widest uppercase py-4 rounded-full" disabled>
                  Secure Checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
