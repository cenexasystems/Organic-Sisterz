import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Sparkles, Check, Heart, Plus, Minus, MessageSquare, ChevronDown, Trash2 } from 'lucide-react';
import { fetchProducts, insertGiftRequest } from '../utils/db';
import type { Product } from '../utils/store';
import ProductDetailModal from '../components/ui/ProductDetailModal';

export default function GiftCustomization() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, { productId: string, name: string, size: string, price: number, quantity: number, image: string }>>({});
  const [productSelections, setProductSelections] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
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
    fetchProducts().then(data => {
      const sorted = [...data].sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName.includes('herbal hair oil') || aName.includes('hair oil')) return -1;
        if (bName.includes('herbal hair oil') || bName.includes('hair oil')) return 1;
        return 0;
      });
      setProducts(sorted);
    }).catch(console.error);
  }, []);

  const addToBasket = (product: Product) => {
    const currentSize = productSelections[product.id] || product.sizes[0].size;
    const currentPrice = product.sizes.find(s => s.size === currentSize)?.price || product.sizes[0].price;
    const key = `${product.id}-${currentSize}`;
    
    setSelectedProducts(prev => {
      const next = { ...prev };
      if (next[key]) {
        next[key].quantity += 1;
      } else {
        next[key] = { productId: product.id, name: product.name, size: currentSize, price: currentPrice, quantity: 1, image: product.image };
      }
      return next;
    });
    setToastMessage("Added to gift basket!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateBasketQuantity = (key: string, delta: number) => {
    setSelectedProducts(prev => {
      const next = { ...prev };
      if (next[key]) {
        const newQuantity = next[key].quantity + delta;
        if (newQuantity <= 0) {
          delete next[key];
        } else {
          next[key] = { ...next[key], quantity: newQuantity };
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
    if (senderMobile.length !== 10) {
      alert("Your Mobile No. must be exactly 10 digits.");
      return;
    }
    if (recipientPhone && recipientPhone.length !== 10) {
      alert("Their Phone must be exactly 10 digits.");
      return;
    }

    const items = Object.values(selectedProducts).map(data => {
      return {
        productId: data.productId,
        name: data.name,
        size: data.size,
        price: data.price,
        quantity: data.quantity
      };
    });

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let whatsappNumber = import.meta.env.VITE_ADMIN_WHATSAPP_1 || "919500258080";
    whatsappNumber = whatsappNumber.replace(/\D/g, '');
    if (whatsappNumber.length === 10) {
      whatsappNumber = `91${whatsappNumber}`;
    }

    const eGift = decodeURIComponent('%F0%9F%8E%81'); // 🎁
    const eHeart = decodeURIComponent('%F0%9F%92%9D'); // 💝
    const eUser = decodeURIComponent('%F0%9F%91%A4'); // 👤
    const ePhone = decodeURIComponent('%F0%9F%93%9E'); // 📞
    const ePin = decodeURIComponent('%F0%9F%93%8D'); // 📍
    const ePkg = decodeURIComponent('%F0%9F%93%A6'); // 📦
    const eMoney = decodeURIComponent('%F0%9F%92%B0'); // 💰
    const eMail = decodeURIComponent('%F0%9F%92%8C'); // 💌
    const eSparkles = decodeURIComponent('%E2%9C%A8'); // ✨
    const eBullet = decodeURIComponent('%E2%80%A2'); // •
    const eRupee = decodeURIComponent('%E2%82%B9'); // ₹

    const orderLines = items.map(it => `${eBullet} ${it.quantity}x *${it.name}* (${it.size}) - ${eRupee}${it.price * it.quantity}`).join("\n");
    const text = `${eGift} *ORGANIC SISTERZ - NEW GIFT ORDER* ${eGift}\n----------------------------------\n${eHeart} *From (Sender):* ${senderName} (${senderMobile})\n${eUser} *To (Recipient):* ${recipientName}\n${ePhone} *Phone:* ${recipientPhone || "N/A"}\n${ePin} *Delivery Address:* ${recipientAddress}\n\n${ePkg} *Gift Box Selections:*\n${orderLines}\n\n${eMoney} *Total Amount:* *${eRupee}${totalPrice}* (+ Premium Packaging Charges)\n\n*Delivery charges may apply depending upon your location*\n💳 GPay Number : 9500258080\n----------------------------------\n${eMail} *Personal Message:*\n_"${giftMessage || "No message provided"}"_\n----------------------------------\n${eSparkles} Delivering organic magic to your loved ones! ${eSparkles}`;
    
    setWhatsappLink(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`);

    window.scrollTo(0, 0);
    setAnimState('boxing');
    
    // Boxing Animation
    setTimeout(() => {
      setAnimState('wrapping');
      
      // Wrapping Animation
      setTimeout(() => {
        setAnimState('ready');
        
        // Finalize Order
        const itemsWithMeta = [
          ...items,
          { __metadata: true, senderMobile, recipientAddress }
        ];

        insertGiftRequest(
          senderName,
          recipientName,
          recipientPhone || "N/A",
          giftMessage,
          itemsWithMeta,
          totalPrice
        ).catch(console.error);
      }, 4500);
    }, 4000);
  };

  const selectedImages = Object.values(selectedProducts)
    .map(p => p.image)
    .filter((img, index, arr) => arr.indexOf(img) === index) // Unique product images only
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1B3022] font-body relative overflow-hidden selection:bg-[#1B3022]/20">
      <Helmet>
        <title>Gift Customization | Organic Sisterz</title>
        <meta name="description" content="Create a personalized organic herbal gift box. Customize ingredients, add a special message, and send wellness to your loved ones with Organic Sisterz." />
        <link rel="canonical" href="https://organicsisterz.com/gift" />
      </Helmet>
      
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {products.map(product => {
                    const currentSize = productSelections[product.id] || product.sizes[0].size;
                    const currentPrice = product.sizes.find(s => s.size === currentSize)?.price || product.sizes[0].price;
                    const key = `${product.id}-${currentSize}`;
                    const basketItem = selectedProducts[key];

                    return (
                      <div 
                        key={product.id}
                        className="group relative p-4 sm:p-5 rounded-[20px] border border-outline-variant/30 hover:border-[#1B3022]/30 bg-white hover:shadow-lg transition-all duration-300 flex flex-col gap-3 overflow-hidden"
                      >
                        <div 
                          className="w-full h-56 md:h-48 pt-2 pb-2 flex items-center justify-center cursor-pointer transition-transform duration-500 group-hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDetailProduct(product);
                            setIsDetailModalOpen(true);
                          }}
                          title="Click to view details"
                        >
                          <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-xl" />
                        </div>
                        
                        <span className="font-display text-base sm:text-lg font-bold tracking-wide mt-2 text-[#1B3022] text-left leading-tight">
                          {product.name}
                        </span>
                        
                        {product.sizes.length > 1 ? (
                          <div className="relative w-full mb-1">
                            <select 
                              value={currentSize}
                              onChange={(e) => setProductSelections(prev => ({ ...prev, [product.id]: e.target.value }))}
                              onClick={e => e.stopPropagation()}
                              className="w-full bg-[#FAF9F5] border border-outline-variant/40 rounded-lg text-sm py-2 pl-3 pr-8 text-[#4A5D52] font-body focus:outline-none focus:border-[#D4AF37] appearance-none text-left cursor-pointer transition-colors shadow-sm font-medium"
                            >
                              {product.sizes.map(s => (
                                <option key={s.size} value={s.size}>{s.size}</option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#4A5D52]">
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs sm:text-sm text-[#4A5D52] font-body mb-1 text-left font-medium">{currentSize}</span>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-outline-variant/20">
                          <div className="flex flex-col">
                            <span className="font-display font-extrabold text-[#1B3022] text-sm sm:text-base">₹{currentPrice}</span>
                          </div>
                          
                          <div className="w-16 sm:w-20">
                            {basketItem ? (
                              <div className="flex items-center justify-between w-full bg-[#1B3022] text-white rounded-md h-7 sm:h-8 shadow-sm">
                                <button onClick={(e) => { e.stopPropagation(); updateBasketQuantity(key, -1); }} className="w-5 sm:w-6 h-full flex items-center justify-center hover:bg-white/20 rounded-l-md transition-colors"><Minus className="w-3 h-3" /></button>
                                <span className="font-bold text-[10px] sm:text-xs">{basketItem.quantity}</span>
                                <button onClick={(e) => { e.stopPropagation(); updateBasketQuantity(key, 1); }} className="w-5 sm:w-6 h-full flex items-center justify-center hover:bg-white/20 rounded-r-md transition-colors"><Plus className="w-3 h-3" /></button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => addToBasket(product)}
                                className="w-full h-7 sm:h-8 text-[10px] sm:text-xs font-bold rounded-md transition-all duration-300 cursor-pointer bg-white border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white shadow-sm flex items-center justify-center"
                              >
                                ADD
                              </button>
                            )}
                          </div>
                        </div>
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
                      {Object.entries(selectedProducts).map(([key, data]) => {
                        return (
                          <div key={key} className="flex gap-4 p-4 rounded-xl bg-[#FAF9F5] border border-outline-variant/20 hover:shadow-md transition-all duration-300">
                            {/* Left: Image */}
                            <div className="w-16 h-16 bg-white rounded-xl border border-outline-variant/30 flex items-center justify-center p-2 shrink-0 shadow-sm">
                              <img src={data.image} alt={data.name} className="max-w-full max-h-full object-contain" />
                            </div>

                            {/* Right: Info & Controls */}
                            <div className="flex flex-col flex-1 min-w-0">
                              {/* Top Row: Title & Price */}
                              <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0 flex-1">
                                  <h5 className="font-display font-bold text-sm sm:text-base text-[#1B3022] truncate">{data.name}</h5>
                                  <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider block mt-0.5">
                                    Size: <span className="text-[#1B3022] text-sm ml-1">{data.size}</span>
                                  </span>
                                </div>
                                <span className="font-display font-extrabold text-base text-[#1B3022] shrink-0">
                                  ₹{data.price * data.quantity}
                                </span>
                              </div>

                              {/* Bottom Row: Quantity & Remove */}
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-full border border-outline-variant/30 shadow-sm">
                                  <button onClick={(e) => { e.stopPropagation(); updateBasketQuantity(key, -1); }} className="text-[#1B3022] hover:text-[#D4AF37] transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                                  <span className="text-[#1B3022] font-body text-base font-extrabold w-4 text-center">{data.quantity}</span>
                                  <button onClick={(e) => { e.stopPropagation(); updateBasketQuantity(key, 1); }} className="text-[#1B3022] hover:text-[#D4AF37] transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    setSelectedProducts(prev => {
                                      const next = { ...prev };
                                      delete next[key];
                                      return next;
                                    });
                                  }}
                                  className="text-[#EF4444] hover:text-red-700 transition-colors p-1.5 cursor-pointer flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-red-50 hover:bg-red-100 rounded-lg"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                        maxLength={10}
                        value={senderMobile}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 10) setSenderMobile(val);
                        }}
                        className="w-full bg-[#FAF9F5] border border-outline-variant/40 rounded-xl px-5 py-4 font-body text-[#1B3022] placeholder-[#6B7280]/50 focus:outline-none focus:border-[#D4AF37] transition-all"
                        placeholder="10-digit number"
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
                        type="tel" 
                        maxLength={10}
                        value={recipientPhone}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 10) setRecipientPhone(val);
                        }}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 font-body text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-all"
                        placeholder="10-digit number"
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

                {/* Gift Subtotal / Total Amount Display */}
                <div className="bg-white p-6 rounded-[20px] border border-outline-variant/30 flex justify-between items-center shadow-sm mt-2">
                  <div>
                    <span className="block font-display text-[10px] font-bold text-[#1B3022]/60 uppercase tracking-[0.15em] mb-1">
                      Total ({Object.values(selectedProducts).reduce((sum, p) => sum + p.quantity, 0)} items)
                    </span>
                    <span className="font-display text-3xl font-extrabold text-[#1B3022]">
                      ₹{Object.entries(selectedProducts).reduce((sum, [_, data]) => sum + data.price * data.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 text-right">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[9px] font-bold text-[#1B3022]/60 uppercase tracking-widest max-w-[130px] leading-relaxed">
                      Premium Packaging Charges Will Apply
                    </span>
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
                    animate={{ y: 120, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="absolute w-72 h-32 bg-[#1B3022] rounded-b-2xl shadow-2xl flex items-end justify-center pb-4 border-t border-[#3E5247] z-20"
                  >
                    <span className="font-display text-[#FAF9F5]/40 text-xs tracking-[0.3em] uppercase">Organic Sisterz</span>
                  </motion.div>

                  {/* The Products Falling */}
                  <div className="absolute flex justify-center items-center w-full max-w-sm px-2 -space-x-12 sm:-space-x-16 z-10">
                    {selectedImages.map((src, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ y: -300, opacity: 0, rotate: -20 + Math.random() * 40 }}
                        animate={{ y: 10, opacity: 1, rotate: -15 + (idx * 12) }}
                        transition={{ 
                          type: "spring", 
                          damping: 15, 
                          stiffness: 80, 
                          delay: idx * 0.3 
                        }}
                        className="w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center z-10 bg-white rounded-xl border-4 border-white shadow-xl overflow-hidden shrink-0"
                      >
                        <img src={src} className="w-full h-full object-contain p-1" alt="gift product" />
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
                        const items = Object.values(selectedProducts).map(data => {
                          return {
                            productId: data.productId,
                            name: data.name,
                            size: data.size,
                            price: data.price,
                            quantity: data.quantity
                          };
                        });
                        const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                        let whatsappNumber = import.meta.env.VITE_ADMIN_WHATSAPP_1 || "919500258080";
                        whatsappNumber = whatsappNumber.replace(/\D/g, '');
                        if (whatsappNumber.length === 10) {
                          whatsappNumber = `91${whatsappNumber}`;
                        }
                        const emojiGift = String.fromCodePoint(0x1F381);
                        const emojiHeartRibbon = String.fromCodePoint(0x1F49D);
                        const emojiUser = String.fromCodePoint(0x1F464);
                        const emojiPhone = String.fromCodePoint(0x1F4DE);
                        const emojiPin = String.fromCodePoint(0x1F4CD);
                        const emojiBox = String.fromCodePoint(0x1F4E6);
                        const emojiMoney = String.fromCodePoint(0x1F4B0);
                        const emojiMail = String.fromCodePoint(0x1F4E9);
                        const emojiSparkles = String.fromCodePoint(0x2728);
                        const bullet = String.fromCodePoint(0x2022);
                        const rupee = String.fromCodePoint(0x20B9);

                        const orderLines = items.map(it => `${bullet} ${it.quantity}x *${it.name}* (${it.size}) - ${rupee}${it.price * it.quantity}`).join("\n");
                        const text = `${emojiGift} *ORGANIC SISTERZ - NEW GIFT ORDER* ${emojiGift}\n----------------------------------\n${emojiHeartRibbon} *From (Sender):* ${senderName} (${senderMobile})\n${emojiUser} *To (Recipient):* ${recipientName}\n${emojiPhone} *Phone:* ${recipientPhone || "N/A"}\n${emojiPin} *Delivery Address:* ${recipientAddress}\n\n${emojiBox} *Gift Box Selections:*\n${orderLines}\n\n${emojiMoney} *Total Amount:* *${rupee}${totalPrice}* (+ Premium Packaging Charges)\n\n*Delivery charges may apply depending upon your location*\n💳 GPay Number : 9500258080\n----------------------------------\n${emojiMail} *Personal Message:*\n_"${giftMessage || "No message provided"}"_\n----------------------------------\n${emojiSparkles} Delivering organic magic to your loved ones! ${emojiSparkles}`;
                        
                        const link = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`;
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
            const currentSize = size || product.sizes[0].size;
            const currentPrice = product.sizes.find(s => s.size === currentSize)?.price || product.sizes[0].price;
            const key = `${product.id}-${currentSize}`;
            
            setSelectedProducts(prev => {
              const next = { ...prev };
              if (next[key]) {
                next[key].quantity += 1;
              } else {
                next[key] = { productId: product.id, name: product.name, size: currentSize, price: currentPrice, quantity: 1, image: product.image };
              }
              return next;
            });
            setIsDetailModalOpen(false);
          }
        }}
      />

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1B3022] text-[#FAF9F5] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-[#3E5247] whitespace-nowrap"
          >
            <Check className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-body text-sm font-semibold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Checkout Banner (Zepto Style) */}
      <AnimatePresence>
        {Object.keys(selectedProducts).length > 0 && animState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="lg:hidden fixed bottom-4 left-4 right-4 bg-[#1B3022] text-white rounded-xl shadow-2xl p-3 flex items-center justify-between z-40 border border-[#3E5247]"
          >
            <div className="flex flex-col pl-1">
              <span className="text-[10px] font-bold text-white/70 tracking-widest uppercase">
                {Object.values(selectedProducts).reduce((sum, p) => sum + p.quantity, 0)} Items
              </span>
              <span className="font-display font-extrabold text-base">
                ₹{Object.values(selectedProducts).reduce((sum, p) => sum + p.price * p.quantity, 0)}
              </span>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="bg-white text-[#1B3022] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg flex items-center gap-2"
            >
              View Cart <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Simple Footer */}
      <footer className="w-full bg-primary mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left text-white/90 font-body text-xs py-6 px-6 lg:px-8">
          <div className="flex-1 md:text-left text-center">
            © {new Date().getFullYear()} Organic Sisterz. All Rights Reserved
          </div>
          
          <div className="flex-1 flex justify-center items-center gap-1.5 text-[10px] tracking-wider uppercase">
            <span className="opacity-70">Powered by</span>
            <a
              href="https://cenexasystems.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-bold hover:text-white transition-colors text-inverse-primary"
            >
              Cenexa Systems 
            </a>  © {new Date().getFullYear()}
          </div>
          
          <div className="flex-1 md:text-right text-center tracking-widest uppercase text-[10px] font-bold text-inverse-primary">
            Pure • Organic • Proven
          </div>
        </div>
      </footer>
    </div>
  );
}
