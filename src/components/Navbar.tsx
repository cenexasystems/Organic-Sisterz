import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-outline-variant/30 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <a href="#" className="font-display text-2xl md:text-3xl font-medium tracking-tight text-primary">
          Organic Sistez
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`font-body text-xs font-semibold tracking-widest uppercase transition-colors duration-300 ${
                link.active
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary hover:bg-black/5 px-3 py-2 rounded'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button className="hidden md:block bg-primary text-on-primary font-body text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded-full hover:bg-primary-container transition-colors duration-300">
            Consultation
          </button>
          <button className="text-primary hover:text-primary-container transition-colors duration-300 p-2 hover:bg-black/5 rounded-full">
            <ShoppingBag className="w-5 h-5" />
          </button>
          <button
            className="md:hidden text-primary p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

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
              <button className="bg-primary text-on-primary font-body text-xs font-semibold tracking-widest uppercase px-6 py-4 rounded-full mt-4 w-full">
                Consultation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
