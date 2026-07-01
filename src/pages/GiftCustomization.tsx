import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Sparkles, Check, Heart, Plus, Minus, MessageSquare, X, ChevronDown, Trash2 } from 'lucide-react';
import { fetchProducts, insertGiftRequest } from '../utils/db';
import type { Product } from '../utils/store';
import ProductDetailModal from '../components/ui/ProductDetailModal';

export default function GiftCustomization() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, { size: string, price: number, quantity: number, image: string }>>({});
  
  // "From" Details
  const [senderName, setSenderName] = useState('');
  const [senderMobile, setSenderMobile] = useState('');
  
  // "To" Details
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [whatsappLink, setWhatsappLink] = useState("");
  
  const [animState, setAnimState] = useState<'entering' | 'idle' | 'boxing' | 'wrapping' | 'ready'>('idle');
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  const toggleProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const next = { ...prev };
      if (next[product.id]) {
        delete next[product.id];
      } else {
        next[product.id] = { size: product.sizes[0].size, price: product.sizes[0].price, quantity: 1, image: product.image };
      }
      return next;
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setSelectedProducts(prev => {
      const next = { ...prev };
      if (next[id]) {
        const newQuantity = next[id].quantity + delta;
        if (newQuantity <= 0) {
          delete next[id];
        } else {
          next[id] = { ...next[id], quantity: newQuantity };
        }
      }
      return next;
    });
  };

  const updateSize = (id: string, newSize: string) => {
    setSelectedProducts(prev => {
      const next = { ...prev };
      if (next[id]) {
        const product = products.find(p => p.id === id);
        const sizeObj = product?.sizes.find(s => s.size === newSize);
        if (sizeObj) {
          next[id] = { ...next[id], size: newSize, price: sizeObj.price };
        }
      }
      return next;
    });
  };

  const handleCheckout = () => {
    if (Object.keys(selectedProducts).length === 0) {
      alert("Please select at least one product to gift.");
      return;
    }
    if (!senderName || !senderMobile || !recipientName || !recipientAddress) {
      alert("Please fill in all required 'From' and 'To' details.");
      return;
    }

    const items = Object.entries(selectedProducts).map(([id, data]) => {
      const p = products.find(p => p.id === id)!;
      return {
        productId: p.id,
        name: p.name,
        size: data.size,
        price: data.price,
        quantity: data.quantity
      };
    });

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let whatsappNumber = import.meta.env.VITE_ADMIN_WHATSAPP_1 || "917904199050";
    whatsappNumber = whatsappNumber.replace(/\D/g, '');
    if (whatsappNumber.length === 10) {
      whatsappNumber = `91${whatsappNumber}`;
    }

    const orderLines = items.map(it => `${it.quantity}x ${it.name} (${it.size}) - ₹${it.price * it.quantity}`).join("\n");
    const text = `*New Gift Order!*\n\n*From:* ${senderName} (${senderMobile})\n*To:* ${recipientName}\n*Phone:* ${recipientPhone || "N/A"}\n*Address:* ${recipientAddress}\n\n*Products:*\n${orderLines}\n*Total:* ₹${totalPrice}\n\n*Gift Message:*\n"${giftMessage}"`;
    
    setWhatsappLink(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`);

    window.scrollTo(0, 0);
    setAnimState('boxing');
    
    // Boxing Animation
    setTimeout(() => {
      setAnimState('wrapping');
      
      // Wrapping Animation
      setTimeout(() => {
        setAnimState('ready');
        
        // Finalize Order
        insertGiftRequest(
          senderName,
          recipientName,
          recipientPhone || "N/A",
          giftMessage,
          items,
          totalPrice
        ).catch(console.error);
      }, 4500);
    }, 4000);
  };

  const selectedImages = Object.values(selectedProducts).flatMap(p => 
    Array(p.quantity).fill(p.image)
  ).slice(0, 5); // Limit falling images to max 5 for performance

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1B3022] font-body relative overflow-hidden selection:bg-[#1B3022]/20">
      
      {/* Decorative Gift Bow Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] opacity-[0.03] pointer-events-none transform -rotate-12">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22,12 c0-2.8-2.2-5-5-5 c-1.7,0-3.2,0.8-4.1,2.1 c-0.9-1.3-2.4-2.1-4.1-2.1 C6,7,3.8,9.2,3.8,12 c0,2.8,2.2,5,5,5 c1.7,0,3.2-0.8,4.1-2.1 c0.9,1.3,2.4,2.1,4.1,2.1 C19.8,17,22,14.8,22,12z M12.9,12 c0.6-1.5,2.1-2.5,3.8-2.5 c1.4,0,2.5,1.1,2.5,2.5 s-1.1,2.5-2.5,2.5 C15,14.5,13.5,13.5,12.9,12z M8.8,14.5 C7.1,14.5,5.6,13.5,5,12 c0.6-1.5,2.1-2.5,3.8-2.5 c1.4,0,2.5,1.1,2.5,2.5 S10.2,14.5,8.8,14.5z"/></svg>
      </div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] opacity-[0.03] pointer-events-none transform rotate-45">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22,12 c0-2.8-2.2-5-5-5 c-1.7,0-3.2,0.8-4.1,2.1 c-0.9-1.3-2.4-2.1-4.1-2.1 C6,7,3.8,9.2,3.8,12 c0,2.8,2.2,5,5,5 c1.7,0,3.2-0.8,4.1-2.1 c0.9,1.3,2.4,2.1,4.1,2.1 C19.8,17,22,14.8,22,12z"/></svg>
      </div>

      {/* --- MAIN PAGE CONTENT --- */}
      <AnimatePresence>
        {animState === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto px-6 py-12 relative z-10"
          >
            {/* Navigation Header */}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-[#4A5D52] hover:text-[#1B3022] transition-colors mb-8 font-display uppercase tracking-widest text-[11px] font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </button>

            {/* Page Title */}
            <div className="text-center mb-16">
              <span className="flex items-center justify-center gap-2 font-display text-[#1B3022]/60 tracking-[0.3em] text-[10px] font-bold uppercase mb-4">
                <Gift className="w-4 h-4 text-[#D4AF37]" /> The Organic Sisterz Gifting Boutique
              </span>
              <h1 className="font-display text-5xl md:text-6xl text-[#1B3022] font-bold tracking-tight">
                Curate a <span className="italic font-light text-[#D4AF37]" style={{ fontFamily: 'var(--font-accent)' }}>Beautiful</span> Gift
              </h1>
              <p className="font-body text-[#4B5563] mt-6 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                Handpick our premium organic formulations and craft a personalized message. We'll delicately box it, wrap it in our signature ribbon, and deliver the magic directly to their doorstep.
              </p>
            </div>

            {/* 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
              
              {/* LEFT: Product Selection */}
              <div className="flex flex-col gap-6">
                <div className="border-b border-outline-variant/30 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-2xl text-[#1B3022] font-bold">1. Select Products</h3>
                    <p className="text-[#6B7280] text-sm mt-1">Choose items and quantities for your gift box.</p>
                  </div>
                  <Gift className="w-8 h-8 text-[#D4AF37]/50" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map(product => {
                    const isSelected = !!selectedProducts[product.id];
                    const qty = isSelected ? selectedProducts[product.id].quantity : 0;
                    return (
                      <div 
                        key={product.id}
                        className={`group relative p-6 rounded-[20px] border transition-all duration-300 flex flex-col items-center text-center gap-4 overflow-hidden ${
                          isSelected 
                            ? 'bg-[#1B3022] border-[#1B3022] shadow-[0_15px_30px_rgba(27,48,34,0.15)]' 
                            : 'bg-white border-outline-variant/30 hover:border-[#1B3022]/30 hover:shadow-sm'
                        }`}
                      >
                        {isSelected && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleProduct(product);
                            }}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer z-10 shadow-sm"
                            title="Discard from Gift Box"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div 
                          className="flex flex-col items-center w-full"
                        >
                          <div 
                            className={`w-28 h-28 rounded-2xl overflow-hidden border-2 transition-all duration-500 bg-white p-2 flex items-center justify-center cursor-pointer ${isSelected ? 'border-[#D4AF37] scale-105' : 'border-outline-variant/20 group-hover:border-outline-variant/40'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDetailProduct(product);
                              setIsDetailModalOpen(true);
                            }}
                            title="Click to view details"
                          >
                            <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <span 
                            className={`font-display text-sm font-bold tracking-wide mt-4 cursor-pointer text-center ${isSelected ? 'text-[#FAF9F5]' : 'text-[#1B3022]'}`}
                            onClick={() => toggleProduct(product)}
                          >
                            {product.name}
                          </span>
                        </div>
                        
                        {isSelected ? (
                          <div className="flex flex-col gap-2 mt-2 w-full px-2">
                            {product.sizes.length > 1 && (
                              <div className="relative w-full">
                                <select 
                                  value={selectedProducts[product.id].size}
                                  onChange={(e) => updateSize(product.id, e.target.value)}
                                  onClick={e => e.stopPropagation()}
                                  className="w-full bg-white/20 border border-white/30 rounded-lg text-xs py-1.5 pl-3 pr-8 text-white font-body focus:outline-none appearance-none text-left cursor-pointer hover:bg-white/30 transition-colors"
                                >
                                  {product.sizes.map(s => (
                                    <option key={s.size} value={s.size} className="text-[#1B3022]">{s.size} - ₹{s.price}</option>
                                  ))}
                                </select>
                                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            )}
                            <div className="flex items-center justify-between bg-white/10 p-1.5 rounded-full border border-white/20">
                              <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, -1); }} className="w-6 h-6 rounded-full bg-white text-[#1B3022] flex items-center justify-center hover:bg-[#D4AF37] transition-colors"><Minus className="w-3 h-3" /></button>
                              <span className="text-white font-body text-xs font-bold">{qty}</span>
                              <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, 1); }} className="w-6 h-6 rounded-full bg-white text-[#1B3022] flex items-center justify-center hover:bg-[#D4AF37] transition-colors"><Plus className="w-3 h-3" /></button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => toggleProduct(product)}
                            className="mt-2 text-[10px] uppercase tracking-widest font-extrabold px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer bg-[#FAF9F5] border border-[#1B3022]/20 text-[#1B3022] hover:bg-[#1B3022] hover:text-[#FAF9F5] hover:border-[#1B3022] shadow-sm hover:shadow-md"
                          >
                            Add to Gift
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Gift Box Basket Summary */}
                {Object.keys(selectedProducts).length > 0 && (
                  <div className="bg-white p-6 rounded-[20px] border border-outline-variant/30 mt-4 shadow-sm space-y-4">
                    <h4 className="font-display text-sm font-bold text-[#1B3022] uppercase tracking-wider border-b border-outline-variant/20 pb-3">
                      Your Gift Box Basket
                    </h4>
                    <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                      {Object.entries(selectedProducts).map(([id, data]) => {
                        const product = products.find(p => p.id === id);
                        if (!product) return null;
                        return (
                          <div key={id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#FAF9F5] border border-outline-variant/10 hover:shadow-sm transition-all duration-300">
                            {/* Left: Product Info */}
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 bg-white rounded-lg border border-outline-variant/20 flex items-center justify-center p-1.5 shrink-0">
                                <img src={data.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                              </div>
                              <div className="min-w-0">
                                <h5 className="font-display font-bold text-xs text-[#1B3022] truncate">{product.name}</h5>
                                <span className="block text-[9px] text-[#6B7280] font-bold uppercase tracking-wider mt-0.5">
                                  Size: {data.size} • Qty: {data.quantity}
                                </span>
                              </div>
                            </div>
                            
                            {/* Right: Price & Delete */}
                            <div className="flex items-center gap-4 shrink-0">
                              <span className="font-display font-extrabold text-sm text-[#1B3022]">
                                ₹{data.price * data.quantity}
                              </span>
                              <button 
                                type="button"
                                onClick={() => {
                                  setSelectedProducts(prev => {
                                    const next = { ...prev };
                                    delete next[id];
                                    return next;
                                  });
                                }}
                                className="text-[#EF4444] hover:text-red-700 transition-colors p-1 cursor-pointer"
                                title="Remove from Gift Box"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Gift Subtotal / Total Amount Display */}
                <div className="bg-white p-6 rounded-[20px] border border-outline-variant/30 mt-4 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="block font-display text-[10px] font-bold text-[#1B3022]/60 uppercase tracking-[0.15em] mb-1">
                      Total Amount ({Object.values(selectedProducts).reduce((sum, p) => sum + p.quantity, 0)} items)
                    </span>
                    <span className="font-display text-2xl font-extrabold text-[#1B3022]">
                      ₹{Object.entries(selectedProducts).reduce((sum, [_, data]) => sum + data.price * data.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1B3022]">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Free Premium Packaging</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: From & To Details */}
              <div className="flex flex-col gap-8">
                
                {/* FROM Section */}
                <div className="flex flex-col gap-4 bg-white p-8 rounded-[20px] border border-outline-variant/30 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/10 rounded-bl-[100px]" />
                  <h3 className="font-display text-xl text-[#1B3022] font-bold border-b border-outline-variant/20 pb-3 mb-2 flex items-center justify-between">
                    2. "From" Details
                    <span className="text-[10px] font-body text-[#6B7280] font-normal uppercase tracking-widest">Sender</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-display text-[10px] font-bold text-[#1B3022] uppercase tracking-[0.2em] mb-2">Your Name *</label>
                      <input 
                        type="text" 
                        value={senderName}
                        onChange={e => setSenderName(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-outline-variant/40 rounded-xl px-5 py-4 font-body text-[#1B3022] placeholder-[#6B7280]/50 focus:outline-none focus:border-[#D4AF37] transition-all"
                        placeholder="E.g., Sarah"
                      />
                    </div>
                    <div>
                      <label className="block font-display text-[10px] font-bold text-[#1B3022] uppercase tracking-[0.2em] mb-2">Your Mobile No. *</label>
                      <input 
                        type="tel" 
                        value={senderMobile}
                        onChange={e => setSenderMobile(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-outline-variant/40 rounded-xl px-5 py-4 font-body text-[#1B3022] placeholder-[#6B7280]/50 focus:outline-none focus:border-[#D4AF37] transition-all"
                        placeholder="For updates & payment"
                      />
                    </div>
                  </div>
                </div>

                {/* TO Section */}
                <div className="flex flex-col gap-4 bg-[#1B3022] p-8 rounded-[20px] border border-[#1B3022] shadow-[0_15px_30px_rgba(27,48,34,0.15)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/20 rounded-bl-[100px]" />
                  <h3 className="font-display text-xl text-white font-bold border-b border-white/10 pb-3 mb-2 flex items-center justify-between">
                    3. "To" Details
                    <span className="text-[10px] font-body text-[#D4AF37] font-normal uppercase tracking-widest">Recipient</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-display text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-2">Their Name *</label>
                      <input 
                        type="text" 
                        value={recipientName}
                        onChange={e => setRecipientName(e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 font-body text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-all"
                        placeholder="E.g., Priya Kumar"
                      />
                    </div>
                    <div>
                      <label className="block font-display text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-2">Their Phone (Optional)</label>
                      <input 
                        type="text" 
                        value={recipientPhone}
                        onChange={e => setRecipientPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 font-body text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-all"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-display text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-2">Delivery Address *</label>
                    <textarea 
                      value={recipientAddress}
                      onChange={e => setRecipientAddress(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 font-body text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-all resize-none h-20"
                      placeholder="Full delivery address..."
                    />
                  </div>
                  <div>
                    <label className="block font-display text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      Personal Message <Heart className="w-3 h-3 text-red-400" />
                    </label>
                    <textarea 
                      value={giftMessage}
                      onChange={e => setGiftMessage(e.target.value)}
                      className="w-full bg-black/20 border border-[#D4AF37]/50 rounded-xl px-5 py-4 font-body text-[#D4AF37] placeholder-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37] focus:bg-black/40 transition-all resize-none h-24 italic"
                      placeholder="Write a beautiful note that will be hand-written on our premium card..."
                    />
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#D4AF37] text-[#1B3022] font-display text-xs font-bold tracking-[0.2em] uppercase py-6 rounded-full shadow-[0_10px_20px_rgba(212,175,55,0.3)] hover:bg-[#C19B2D] hover:shadow-[0_15px_30px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Gift className="w-5 h-5" /> Pay & Wrap Gift
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- REALISTIC SUBMISSION ANIMATION SEQUENCE --- */}
      <AnimatePresence>
        {(animState === 'boxing' || animState === 'wrapping' || animState === 'ready') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF9F5] overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {/* STEP 1: BOXING (Actual products falling into a box) */}
              {animState === 'boxing' && (
                <motion.div 
                  key="boxing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center relative w-full h-full"
                >
                  {/* Dynamic Glowing Background elements */}
                  <motion.div 
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" 
                  />
                  
                  {/* Floating Sparkles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`sparkle-${i}`}
                      animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                      className="absolute"
                      style={{ 
                        left: `${40 + (Math.random() * 20)}%`, 
                        top: `${30 + (Math.random() * 40)}%` 
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                    </motion.div>
                  ))}

                  {/* The Box Base */}
                  <motion.div 
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 150, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="absolute w-64 h-24 bg-[#1B3022] rounded-b-2xl shadow-2xl flex items-center justify-center border-t border-[#3E5247] z-20"
                  >
                    <span className="font-display text-[#FAF9F5]/40 text-xs tracking-[0.3em] uppercase">Organic Sisterz</span>
                  </motion.div>

                  {/* The Products Falling */}
                  <div className="absolute flex gap-4 top-10">
                    {selectedImages.map((src, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ y: -300, opacity: 0, rotate: -20 + Math.random() * 40 }}
                        animate={{ y: 350, opacity: 1, rotate: 0 }}
                        transition={{ 
                          type: "spring", 
                          damping: 15, 
                          stiffness: 80, 
                          delay: idx * 0.3 
                        }}
                        className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl bg-white p-1.5 flex items-center justify-center overflow-hidden z-10"
                      >
                        <img src={src} className="max-w-full max-h-full object-contain" alt="gift product" />
                      </motion.div>
                    ))}
                  </div>

                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-24 font-display text-lg sm:text-2xl font-bold tracking-widest uppercase text-[#1B3022] text-center px-4"
                  >
                    Boxing Your Selections...
                  </motion.h3>
                </motion.div>
              )}

              {/* STEP 2: WRAPPING (SVG Ribbon Drawing) */}
              {animState === 'wrapping' && (
                <motion.div 
                  key="wrapping"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center relative w-full h-full"
                >
                  {/* Floating Elements Background */}
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute w-64 h-64 bg-[#1B3022]/5 rounded-full blur-2xl"
                  />
                  <div className="absolute inset-0 flex justify-center items-center opacity-20 pointer-events-none">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="text-[#D4AF37]">
                        <circle cx="100" cy="100" r="99" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10"/>
                      </svg>
                    </motion.div>
                  </div>

                  {/* Closed Box */}
                  <div className="relative w-72 h-40 bg-[#1B3022] rounded-xl shadow-[0_20px_50px_rgba(27,48,34,0.3)] flex items-center justify-center border-t border-white/10 mb-16 z-10 hover:-translate-y-2 transition-transform duration-700">
                    {/* SVG Ribbon Drawing Animation */}
                    <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" viewBox="0 0 288 160">
                      <motion.path
                        d="M 144,0 L 144,160 M 0,80 L 288,80"
                        stroke="#D4AF37"
                        strokeWidth="8"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                      {/* Ribbon Bow */}
                      <motion.path
                        d="M 144,80 C 120,40 100,60 144,80 C 168,40 188,60 144,80"
                        stroke="#D4AF37"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                      />
                    </svg>
                  </div>
                  
                  <motion.h3 
                    animate={{ opacity: [1, 0.5, 1] }} 
                    transition={{ duration: 2, repeat: Infinity }}
                    className="font-display text-lg sm:text-2xl font-bold tracking-widest uppercase text-[#1B3022] text-center px-4"
                  >
                    Tying The Ribbon...
                  </motion.h3>
                </motion.div>
              )}

              {/* STEP 3: READY (Confetti Explosion) */}
              {animState === 'ready' && (
                <motion.div 
                  key="ready"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                  className="flex flex-col items-center justify-center w-full h-full z-10 text-center"
                >
                  {/* Confetti Particles */}
                  {[...Array(40)].map((_, i) => (
                    <motion.div
                      key={`confetti-${i}`}
                      initial={{ 
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 0
                      }}
                      animate={{ 
                        opacity: 0,
                        x: (Math.random() - 0.5) * 800,
                        y: (Math.random() - 0.5) * 800,
                        scale: Math.random() * 2 + 1,
                        rotate: Math.random() * 360
                      }}
                      transition={{ 
                        duration: 2.5,
                        ease: "easeOut" 
                      }}
                      className={`absolute w-3 h-3 rounded-sm ${['bg-[#D4AF37]', 'bg-[#1B3022]', 'bg-[#4A5D52]'][Math.floor(Math.random() * 3)]}`}
                    />
                  ))}

                  <div className="w-24 h-24 rounded-full bg-[#1B3022] flex items-center justify-center mb-8 shadow-2xl relative z-20">
                    <Check className="w-12 h-12 text-[#FAF9F5] stroke-[3]" />
                  </div>
                  <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-widest uppercase text-[#1B3022] relative z-20 text-center px-4">Gift Ready!</h3>
                  <p className="font-body text-[#4B5563] mt-4 max-w-md leading-relaxed relative z-20 text-center px-6">
                    Your exquisite gift package has been meticulously prepared and will be delivered to <span className="text-[#1B3022] font-bold">{recipientName}</span>.
                  </p>
                  
                  <a
                    href={whatsappLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!whatsappLink) {
                        e.preventDefault();
                        const items = Object.entries(selectedProducts).map(([id, data]) => {
                          const p = products.find(p => p.id === id)!;
                          return {
                            productId: p.id,
                            name: p.name,
                            size: data.size,
                            price: data.price,
                            quantity: data.quantity
                          };
                        });
                        const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                        let whatsappNumber = import.meta.env.VITE_ADMIN_WHATSAPP_1 || "917904199050";
                        whatsappNumber = whatsappNumber.replace(/\D/g, '');
                        if (whatsappNumber.length === 10) {
                          whatsappNumber = `91${whatsappNumber}`;
                        }
                        const orderLines = items.map(it => `${it.quantity}x ${it.name} (${it.size}) - ₹${it.price * it.quantity}`).join("\n");
                        const text = `*New Gift Order!*\n\n*From:* ${senderName} (${senderMobile})\n*To:* ${recipientName}\n*Phone:* ${recipientPhone || "N/A"}\n*Address:* ${recipientAddress}\n\n*Products:*\n${orderLines}\n*Total:* ₹${totalPrice}\n\n*Gift Message:*\n"${giftMessage}"`;
                        
                        const link = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
                        window.open(link, '_blank');
                      }
                      setTimeout(() => navigate('/'), 500);
                    }}
                    className="mt-8 relative z-20 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1DA851] text-white font-body text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Send Gift to WhatsApp
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductDetailModal
        product={selectedDetailProduct}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDetailProduct(null);
        }}
        onAddToCart={(id, size) => {
          const product = products.find(p => p.id === id);
          if (product) {
            setSelectedProducts(prev => {
              const next = { ...prev };
              const sizeObj = product.sizes.find(s => s.size === size) || product.sizes[0];
              next[id] = {
                size: sizeObj.size,
                price: sizeObj.price,
                quantity: 1,
                image: product.image
              };
              return next;
            });
          }
        }}
      />
    </div>
  );
}
